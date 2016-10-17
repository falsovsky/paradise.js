(function() {

    'use strict';

    /* css stuff */
    require('../assets/style.css');

    /* load title image into title div because im using a stupid fucking
     * plugin to generate index.html automagically and i dont know how
     * pass content to the template */
    const image = require('../assets/page/paradise.gif');
    document.getElementById('titleImg').src = image;

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
