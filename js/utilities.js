function tweenTo(object, property, target, time, easing, onchange, oncomplete) {
    const tween = {
        object,
        property,
        propertyBeginValue: object[property],
        target,
        easing,
        time,
        change: onchange,
        complete: oncomplete,
        start: Date.now()
    };

    tweening.push(tween);
    return tween;
}

function lerp(a1, a2, t) {
    return a1 * (1 - t) + a2 * t;
}

function  clamp(num, min, max)  {
    Math.min(Math.max(num, min), max);
} 


backout = amount => t => --t * t * ((amount + 1) * t + amount) + 1;
