(function() {

    'use strict';

    require('../assets/style.css');

    const scenes = require('./scenes.json');
    const Canvas = require('./canvas');

    let canvas = new Canvas(document.getElementById("canvasDiv"), 512, 272);

    canvas.show('room');

})();
