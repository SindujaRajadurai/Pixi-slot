//Global variable

const margin = 80;
let running;
var presentResources;
var buttonActive;
var symbolOrder;



const app = new PIXI.Application(800, 400, {
	transparent: true,
	autoResize: true,
	antialias: true,
	resolution: 1,
});


class Betting {

	constructor(balance, stake, win) {
		this.balance = 500;
		this.stake = 1;
		this.win = 0;
		this.playing = false;
		this.reduceBalance = function () {
			this.balance = this.balance - this.stake;
		}

		this.addBalance = function (win) {
			this.balance = this.balance + win;
		}
	}
}

playerResources = new Betting();
app.renderer.backgroundColor = 0x87CEEB;
sideContainer = new PIXI.Container();
document.body.appendChild(app.view);


PIXI.loader
app.loader
	.add('symbol0', '../assets/symbols/symbol_00.json', { crossOrigin: true })
	.add('symbol1', '../assets/symbols/symbol_01.json', { crossOrigin: true })
	.add('symbol2', '../assets/symbols/symbol_02.json', { crossOrigin: true })
	.add('symbol3', '../assets/symbols/symbol_03.json', { crossOrigin: true })
	.add('symbol4', '../assets/symbols/symbol_04.json', { crossOrigin: true })
	.add('symbol5', '../assets/symbols/symbol_05.json', { crossOrigin: true })

	.add("buttonActive", "../assets/spin.png")
	.add("buttonDeactivated", "../assets/BTN_Spin_deactivated.png")
	.add("coins", "../assets/coin.png")
	.add("yellowBar", "../assets/leftArrow.png")
	.add("blueBar", "../assets/rightArrow.png")
	.add("background", "../assets/background.png")
	.add("slotBg", "../assets/slotBackground.png")
	.load(function (loader, resources) {
		presentResources = resources;
		onAssetsLoaded(resources)
	});


/*******************************************************************************************************
 * Initializes game UI assets and creates the reel container.
 * 
 * @name onAssetsLoaded
 * @function
 * @param resources {object}
 * @return {} void
 **********************************************************************************************************/

function onAssetsLoaded(resources) {


	addGameUIElements(resources);

	reelContainer = new PIXI.Container();

	reelContainer.y = margin * 2.8;
	reelContainer.x = 200;
	for (let i = 0; i < 4; i++) {
		rc = new PIXI.Container();
		rc.x = i * REEL_WIDTH;
		reelCArr.push(rc);
		reelContainer.addChild(rc);

		reel = {
			container: rc,
			symbols: [],
			position: 0,
			previousPosition: 0,
			blur: new PIXI.filters.BlurFilter()
		};

		reel.blur.blurX = 0;
		reel.blur.blurY = 0;
		rc.filters = [reel.blur];

		symbolOrder = [resources.symbol0.spineData, resources.symbol1.spineData, resources.symbol2.spineData, resources.symbol3.spineData, resources.symbol4.spineData]


		//Build the symbols
		for (let j = 0; j < 3; j++) {
			var randomSymIndex = Math.floor(Math.random() * symbolOrder.length)
			var symbol = new PIXI.spine.Spine(symbolOrder[randomSymIndex]);
			symbol.state.setAnimation(0, "static", true);
			//Scale the symbol to fit symbol area.
			symbol.y = j * SYMBOL_SIZE;
			symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
			symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 9);
			reel.symbols.push(symbol);
			rc.addChild(symbol);
		}
		reels.push(reel);
	}
	app.stage.addChild(reelContainer);


	running = false;

	app.ticker.add(delta => {
		for (const r of reels) {
			r.blur.blurY = (r.position - r.previousPosition) * 6;
			r.previousPosition = r.position;

			for (let j = 0; j < r.symbols.length; j++) {
				const s = r.symbols[j];
				const prevy = s.y;
				s.y = (r.position + j) % r.symbols.length * SYMBOL_SIZE - SYMBOL_SIZE;
			}
		}
	});
}


/*******************************************************************************************************
 * Reel spinning logic. Implemented via tween function.
 * 
 * @name startSpinning
 * @function
 * @param resources {object}
 * @return {} 
 **********************************************************************************************************/

function startSpinning(resources) {
	if (running) return;
	running = true;

	for (let i = 0; i < reels.length; i++) {
		const r = reels[i];
		const extra = Math.floor(Math.random() * 5);
		tweenTo(
			r,
			"position",
			r.position + 80 + i * 5 + extra,
			3000,
			backout(0.1), null,
			i == reels.length - 1 ? displayResults : null);
	}
}


/*******************************************************************************************************
 * Post reel stop display the end results.
 * Handles symbol Mapping
 * CHange in symbol textures
 * 
 * @name displayResults
 * @function
 * @param {}
 * @return {} 
 **********************************************************************************************************/

function displayResults() {
	running = false;
	buttonActive.alpha = 1;

	var randomResultIndex = Math.floor(Math.random() * 7)

	var currentSymIdIndex = 0;


	var HasWin = data[randomResultIndex].response.results.win;


	for (let i = 0; i < reelCArr.length; i++) {
		reelCArr[i].alpha = 0;
	}


	for (let i = 0; i < 4; i++) {
		rc = new PIXI.Container();
		rc.x = i * REEL_WIDTH;
		reelCArr.push(rc);
		reelContainer.addChild(rc);

		reel = {
			container: rc,
			symbols: [],
			position: 0,
			previousPosition: 0,
			blur: new PIXI.filters.BlurFilter()
		};

		//let newposition = reel.reelContainer.getChildIndex;
		reel.blur.blurX = 0;
		reel.blur.blurY = 0;
		rc.filters = [reel.blur];

		//Build the symbols
		for (let j = 0; j < 3; j++) {
			var randomSymIndex = 0;
			if (j === 1)
				randomSymIndex = data[randomResultIndex].response.results.symbolIDs[i];
			else
				randomSymIndex = Math.floor(Math.random() * symbolOrder.length)


			var currentSymbol;
			if (symbolOrder[randomSymIndex] === undefined)
				currentSymbol = symbolOrder[4]
			else
				currentSymbol = symbolOrder[randomSymIndex]

			var symbol = new PIXI.spine.Spine(currentSymbol);
			symbol.state.setAnimation(0, "static", true);
			symbol.y = j * SYMBOL_SIZE;
			symbol.scale.x = symbol.scale.y = Math.min(SYMBOL_SIZE / symbol.width, SYMBOL_SIZE / symbol.height);
			symbol.x = Math.round((SYMBOL_SIZE - symbol.width) / 9);
			reel.symbols.push(symbol);
			rc.addChild(symbol);
		}

		currentSymIdIndex++;
		reels.push(reel);
	}

	if (HasWin != 0) {
		functionPlayWinAnim(HasWin);
	}

}


/*******************************************************************************************************
 * Play Symbol win animations if any
 * @name functionPlayWinAnim
 * @function
 * @param HasWin {number}
 * @return {} 
 **********************************************************************************************************/
function functionPlayWinAnim(HasWin) {
	for (let i = 0; i < reels.length; i++) {
		reels[i].symbols[1].state.setAnimation(0, "win", false)
	}
	playerResources.addBalance(HasWin);
}


/*******************************************************************************************************
 * Handles SpinBTn UI
 * Balance UI logic
 * Stake UI 
 * @name addGameUIElements
 * @function
 * @param resources {object}
 * @return {} 
 **********************************************************************************************************/
function addGameUIElements(resources) {


	const top = new PIXI.Graphics();

	top.drawRect(0, 0, app.screen.width, margin);
	const bottom = new PIXI.Graphics();
	bottom.drawRect(0, 240 + margin, app.screen.width, margin);



	//Add text Style properties
	const style = new PIXI.TextStyle({
		fontFamily: 'Arial',
		fontSize: 24,
		fontStyle: 'italic',
		fontWeight: 'bold',
		fill: ['#ffffff', '#00ff99'], // gradient
		stroke: '#4a1850',
		strokeThickness: 5,
		dropShadow: true,
		// dropShadowColor: '#000000',
		dropShadowBlur: 4,
		dropShadowAngle: Math.PI / 6,
		dropShadowDistance: 6,
		wordWrap: true,
		wordWrapWidth: 300
	});

	// draw a rounded rectangle
	let graphicsTwo = new PIXI.Graphics();
	graphicsTwo.lineStyle(2, 0xFF00FF, 1);
	graphicsTwo.beginFill(0xFF00BB, 0.25);
	graphicsTwo.drawRoundedRect(665, 315, 120, 35, 15);
	graphicsTwo.endFill();


	//draw coin image for total balance
	let coins = new PIXI.Sprite.fromImage("./assets/coin.png");
	coins.x = 685;
	coins.y = 90;
	coins.scale.x *= 0.08;
	coins.scale.y *= 0.08;


	let slotBg = new PIXI.Sprite.fromImage("../assets/slotBackground.png");
	slotBg.x = app.screen.width / 8
	slotBg.y = app.screen.height / 15
	slotBg.scale.x = 0.87;
	slotBg.scale.y = 0.98
	app.stage.addChild(slotBg)


	//Stack Selector Text between arrow buttons
	let stackText = new PIXI.Text(`${playerResources.stake}`, style);
	stackText.x = (app.screen.width / 2 + 315);
	stackText.y = 315;
	sideContainer.addChild(stackText);

	let betText = new PIXI.Text("BET", style);
	betText.x = (app.screen.width / 2 + 310);
	betText.y = 280;
	sideContainer.addChild(betText);

	//Add balance text to the canvas
	let balanceText = new PIXI.Text(`${playerResources.balance}`, style);
	balanceText.x = 720;
	balanceText.y = 90;
	top.addChild(balanceText);


	const makeImageButton = (image, x, y, scale) => {
		const button = PIXI.Sprite.fromImage(image);
		button.interactive = true;
		button.buttonMode = true;
		button.x = x;
		button.y = y;
		button.scale.set(scale);
		return button;
	};

	buttonActive = makeImageButton('./assets/BTN_Spin_active.png', 680, 150, 1);

	//check for event on spin button
	buttonActive.addListener('pointerdown', () => {
		startSpinning(resources);
		playerResources.reduceBalance();
		buttonActive.alpha = 0.5;
		balanceText.text = playerResources.balance;
	});


	sideContainer.addChild(buttonActive)

	app.stage.addChild(top);
	app.stage.addChild(coins);
	app.stage.addChild(sideContainer);


	sideContainer.addChild(
		bottom,
		graphicsTwo,
		stackText);
	sideContainer.x = 0;
	sideContainer.y = 20;


}




/*******************************************************************************************************
 * Reel movement is handled with respect to the time
 **********************************************************************************************************/
app.ticker.add(delta => {
	const now = Date.now();
	const remove = [];
	for (var i = 0; i < tweening.length; i++) {
		const t = tweening[i];
		const phase = Math.min(1, (now - t.start) / t.time);

		t.object[t.property] = lerp(t.propertyBeginValue, t.target, t.easing(phase));
		if (t.change) t.change(t);
		if (phase == 1) {
			t.object[t.property] = t.target;
			if (t.complete)
				t.complete(t);
			remove.push(t);
		}
	}
	for (var i = 0; i < remove.length; i++) {
		tweening.splice(tweening.indexOf(remove[i]), 1);
	}
});




