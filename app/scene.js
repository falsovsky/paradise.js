(function() {

    'use strict';

    let Scene = function(scene, canvas) {

        this.frames = scene.frames;
        this.roll = scene.roll;
        this.canvas = canvas;

    };

    Scene.prototype.drawFrame = function(frame) {

        let images = this.frames[frame];

        images.forEach((image) => {
            this.canvas.drawImage(image);

        });
    };

    Scene.prototype.play = function() {
        this.drawFrame('vaginal_initial');
    };

    module.exports = Scene;

})();