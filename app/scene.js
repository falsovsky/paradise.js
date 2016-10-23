    (function() {

    'use strict';

    const _ = {
        flattenDeep: require('lodash/flattendeep'),
        cloneDeep: require('lodash/clonedeep')
    };

    let Scene = function(scene, canvas) {

        /* scene definition from json */
        this.scene = scene;

        /* the html5 canvas object */
        this.canvas = canvas;

        /* scene properties */
        this.properties = {};
    };

    /* draw one of the specified frames in this scene */
    Scene.prototype.drawFrame = function(images) {

        [].concat(images).forEach((image) => {
            this.canvas.drawImage(image);

        });
    };

    /* */
    Scene.prototype.testCondition = function(scene) {

      if (!scene.if) {
        return true;
      }

      /* check if all conditions specified in the 'if' property match
       * the values stored in this scene's properties attribute */
      return Object.keys(scene.if).reduce((accumulator, condition) => {
          let value = scene.if[condition];
          return accumulator && this.properties[condition] === scene.if[condition];
      }, true);

    };

    /* play this scene on the given canvas */
    Scene.prototype.play = function() {

        /* transform the scene roll definition given in the .json scene file
         * into a flat array of simple ({ name, duration }) objects.
         * this will deal with all the repeat: properties and multi level nesting */
        let expand = (scene) => {

            /* test the if property for this scene. if it fails, filter it out
             * by returning an empty array as result of roll expansion */
            if (!this.testCondition(scene)) {
              return [];
            }

            /* expand this roll */
            let roll = [];
            for (let i = 0; i < (scene.repeat || 1); i++) {
                roll = roll.concat(_.cloneDeep(scene.roll));
            }
            scene.roll = roll;

            /* recursively expand child rolls */
            let expanded = scene.roll.map((scene) => {

                if (scene.hasOwnProperty('roll')) {
                    return expand(scene);
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

                    this.drawFrame(frame.images);
                    setTimeout(() => resolve(), frame.duration);

                });
            });

            return functionalized;

        };

        /* expand the scene definition (get a flat array of simple { name, duration }
         * objects */
        let expanded = expand(this.scene);

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
