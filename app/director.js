(function() {

    'use strict';

    const _ = require('lodash');
    const Scene = require('./scene');

    let Director = function(canvas) {

        /* html5 canvas */
        this.canvas = canvas;

        /* load scenes dynamically from all .json files present in '../assets/scenes'.
         * this function implements a reducer that reduces all files loaded to a
         * single object with the scene filename minus extension as key and
         * the require()d file as value */
        const requireScenes = function (requireContext) {
            return requireContext.keys().reduce(function(accumulator, filename) {
                let framename = filename.match(/\.\/(\S+)\.json$/)[1];
                accumulator[framename] = requireContext(filename);
                return accumulator;
            }, {});
        };
        let scenes = requireScenes(require.context('../assets/scenes', true, /\.json$/));

        /* map object with scene definitions obtained above into object
         * containing Scene objects with scene name as a key */
        this.scenes = _.mapValues(scenes, (value, key) => {
            return new Scene(value, this.canvas);
        });

    };

    /*  begins the game */
    Director.prototype.begin = function() {

        /* consequence of user action (key pressed) */
        let choice = (scene) => {
            window.removeEventListener('keydown', listener, true);

            /* play the selected choice screen */
            this.scenes['choice_' + scene].play()
                /* then play the chosen scene */
                .then(() => this.scenes[scene].play())
                /* then play the reinaldo scene */
                .then(() => this.scenes.reinaldo.play())
                /* then start all over again */
                .then(main);
        };

        /* keydown window event listener */
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

        /* the game starts by calling this */
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