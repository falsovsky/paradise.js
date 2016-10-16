(function() {

    'use strict';

    require('../assets/style.css');

    const script = require('./script.json');

    const Canvas = require('./canvas');
    const Director = require('./director');

    let canvas = new Canvas(document.getElementById("canvasDiv"), 512, 272);
    let director = new Director(script, canvas);

    director.begin();

})();
