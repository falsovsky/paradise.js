(function() {

    'use strict';

    require('../assets/style.css');

    /* Canvas abstraction */
    const Canvas = require('./canvas');

    /* Game director */
    const Director = require('./director');

    /* create a canvas */
    let canvas = new Canvas(document.getElementById("canvasDiv"), 512, 272);

    /* create game director with this canvas */
    let director = new Director(canvas);

    /* start everything */
    director.begin();

})();
