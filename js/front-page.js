var arr = [];

document.getElementById("container").addEventListener( 'click', function (e) {
    let coords = { x: e.pageX, y: e.pageY };
    let rad = Math.floor(Math.random() * (12 - 2 + 1)) + 2;

    let burst = new mojs.Burst({
        left: 0, top: 0,
        radius:   { 0: (rad +10) },
        angle:    45,
        count:    10,
        children: {
            shape:        'line',
            radius:       'rand(-25, 25)',
            scale:        1,
            stroke:       {'#FFFFFF' : '#ffe13f'},
            strokeDasharray: '100%',
            strokeDashoffset: { '-100%' : '100%' },
            duration:     700,
            delay:        200,
            easing:       'quad.out',
        }
    });
    let shape = new mojs.Shape({
        left: 0, top: 0,
        stroke:   '#E0E0E0',
        strokeWidth: { [2*rad] : 0 },
        fill:     '#E0E0E0',
        scale:    { 0: 1},
        radius:   rad,
        duration:  500,
        delay:    600,
        easing:   'elastic.out'
    });

    arr.push(coords, burst);


    burst.tune(coords);
    burst.replay();
    shape.tune(coords);
    shape.replay();

    // timeline.replay();
});