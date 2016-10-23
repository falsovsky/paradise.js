(function() {

    'use strict';

    const flattenDeep = require('lodash.flattendeep');

    let Scene = function(scene, canvas) {

        /* scene definition from json */
        this.scene = scene;

        /* the html5 canvas object */
        this.canvas = canvas;

    };

    /* draw one of the specified frames in this scene */
    Scene.prototype.drawFrame = function(images) {

        [].concat(images).forEach((image) => {
            this.canvas.drawImage(image);

        });
    };

    /* play this scene on the given canvas */
    Scene.prototype.play = function() {

        /* transform the scene roll definition given in the .json scene file
         * into a flat array of simple ({ name, duration }) objects.
         * this will deal with all the repeat: properties and multi level nesting */
        let expand = (scene) => {

            /* expand first roll */
            console.log('expanding', JSON.stringify(scene, null, 2));
            scene.roll = [].concat.apply([], Array(scene.repeat || 1).fill(scene.roll));

            /* recursively expand rolls */

            let expanded = scene.roll.map((scene) => {

                if (scene.hasOwnProperty('roll')) {
                    return expand(scene);
                }

                return scene;

            });

            return expanded;

        };

        /* transform the expanded array into an array of functions that
         * return promises and that should be called one after another.
         * calling these functions will render the scene. */
        let functionalize = (expanded) => {

            let functionalized = expanded.map((frame) => {

                return () => new Promise((resolve, reject) => {

                    this.drawFrame(frame.images);
                    setTimeout(() => {
                        return resolve();
                    }, frame.duration);

                });
            });

            return functionalized;

        };

        /* expand the scene definition (get a flat array of simple { name, duration }
         * objects */
        let expanded = expand(this.scene);
expanded.forEach(x => console.log(x));
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
