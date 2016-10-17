(function() {

    'use strict';

    const _ = require('lodash');

    let Scene = function(scene, canvas) {

        /* frames that compose this scene. a frame is made up of several
        overlapped images. */
        this.frames = scene.frames;

        /* default roll (sequence of frames) of this scene */
        this.roll = scene.roll;

        /* other rolls that depend on choices (like key presses) */
        this.choices = scene.choices;

        /* the html5 canvas object */
        this.canvas = canvas;

    };

    /* draw one of the specified frames in this scene */
    Scene.prototype.drawFrame = function(frame) {

        let images = this.frames[frame];

        images.forEach((image) => {
            this.canvas.drawImage(image);

        });
    };

    /* play a roll of this scene. if called with no arguments, it will
     * render the default scene roll.
     * alternatively one of the scene roll choices can be specified as
     * argument. */
    Scene.prototype.play = function(choice) {

        /* transform the scene roll definition given in the .json scene file
         * into a flat array of simple ({ name, duration }) objects.
         * this will deal with all the repeat: properties and multi level nesting */
        let expand = (roll) => {

            /* recursively expand repeats */
            let expanded = roll.map((scene) => {

                if (scene.hasOwnProperty('repeat')) {

                    let roll = [];

                    for (let i = 0; i < scene.repeat; i++) {
                        roll = roll.concat(scene.roll);
                    }

                    return expand(roll);
                }

                return scene;

            });

            return _.flattenDeep(expanded);

        };

        /* transform the expanded array into an array of functions that
         * return promises and that should be called one after another.
         * calling these functions will render the scene. */
        let functionalize = (expanded) => {

            let functionalized = expanded.map((frame) => {

                return () => new Promise((resolve, reject) => {

                    this.drawFrame(frame.name);
                    setTimeout(() => {
                        return resolve();
                    }, frame.duration);

                });
            });

            return functionalized;

        };

        /* pick scene to render between one of the several scene roll choices
         * or the default scene roll */
        let scene = choice ? this.choices[choice] : this.roll;

        /* expand the scene definition (get a flat array of simple { name, duration }
         * objects */
        let expanded = expand(scene);

        /* transform the array obtained into an array of functions */
        let functionalized = functionalize(expanded);

        /* call the functions in the array obtained one after the other after each
         * returned promise resolves */
        let promise = functionalized[0]();
        for (let i = 1; i < functionalized.length; i++) {
            promise = promise.then(functionalized[i]);
        }
        return promise;


    };

    module.exports = Scene;

})();