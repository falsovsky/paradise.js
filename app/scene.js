(function() {

    'use strict';

    const _ = require('lodash');

    let Scene = function(scene, canvas) {

        this.frames = scene.frames;
        this.roll = scene.roll;
        this.choices = scene.choices;
        this.canvas = canvas;

    };

    Scene.prototype.drawFrame = function(frame) {

        let images = this.frames[frame];

        images.forEach((image) => {
            this.canvas.drawImage(image);

        });
    };

    /* if called with no arguments, it will render the scene specified in this.roll
     * otherwise it will render the roll specified in choices, with the key name
     * given as argument */
    Scene.prototype.play = function(choice) {

        /* transform a scene roll array into a flat array of simple
         * scene objects ({ name, duration }), repeating as needed  */
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

        /* transform the expanded array into an array of asynchronous
         * functions that can be called one after another, and so render
         * the scene */
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

        let scene = choice ? this.choices[choice] : this.roll;
        let expanded = expand(scene);
        let functionalized = functionalize(expanded);

        console.log(functionalized);
        let promise = functionalized[0]();
        for (let i = 1; i < functionalized.length; i++) {
            promise = promise.then(functionalized[i]);
        }
        return promise;


    };

    module.exports = Scene;

})();