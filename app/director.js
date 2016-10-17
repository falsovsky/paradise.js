(function() {

    'use strict';

    const _ = require('lodash');
    const Scene = require('./scene');

    let Director = function(canvas) {

        this.canvas = canvas;

        /* load scenes */
        const requireScenes = function (requireContext) {
            return requireContext.keys().reduce(function(accumulator, filename) {
                let framename = filename.match(/\.\/(\S+)\.json$/)[1];
                accumulator[framename] = requireContext(filename);
                return accumulator;
            }, {});
        };
        let scenes = requireScenes(require.context("../assets/scenes", true, /\.json$/));

        /* map object with scene definitions (with scene name as key) into object
         * containing Scene objects with scene name as a key */
        this.scenes = _.mapValues(scenes, (value, key) => {
            return new Scene(value, this.canvas);
        });

    };

    Director.prototype.begin = function() {

        let choice = (scene) => {
            window.removeEventListener('keydown', listener, true);
            this.scenes.choice.play(scene)
                .then(this.scenes[scene].play.bind(this.scenes[scene]))
                .then(main);
        };

        let listener = (event) => {

            switch (event.keyCode) {

                case 67:
                    choice('anal');
                    break;

                case 70:
                    choice('vaginal');
                    break;

                case 66:
                    choice('oral');
                    break;

            }
        };

        let main = () => {
            return this.scenes.choice.play()
                .then(() => {
                    window.addEventListener('keydown', listener, true);
                });
        };

        return main();

    };

    module.exports = Director;

})();