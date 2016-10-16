(function() {

    'use strict';

    const Scene = require('./scene');

    let Director = function(script, canvas) {

        this.script = script;
        this.canvas = canvas;

    };

    Director.prototype.begin = function() {

        let scene = new Scene(this.script.scenes.vaginal, this.canvas);

        scene.play();

    };

    module.exports = Director;

})();