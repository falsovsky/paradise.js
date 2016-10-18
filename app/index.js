(function() {

    'use strict';

    /* css stuff */
    require('../assets/style.scss');

    /* load title image into title div because im using a stupid fucking
     * plugin to generate index.html automagically and i dont know how
     * pass content to the template */
    const image = require('../assets/page/paradise.gif');
    document.getElementById('img-title').src = image;

    /* Canvas abstraction */
    const Canvas = require('./canvas');

    /* Game director */
    const Director = require('./director');

    /* create a canvas */
    const scale = 1;
    const width = 512;
    const height = 272;
    let canvas = new Canvas(document.getElementById("div-canvas"), width, height, scale);

    /* create game director with this canvas */
    let director = new Director(canvas);

    /* start everything */
    director.begin();

})();
