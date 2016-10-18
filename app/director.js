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

    /* begins the game (actually runs the whole game) */
    /* @TODO lol everything is implemented here, if this needs to grow it will become ugly
     * think about refactoring all the code in here later */
    Director.prototype.begin = function() {

        /* enable user input */
        let enableUserInput = () => {

            /* add event listeners */
            window.addEventListener('keydown', keyListener, false);

            /* LOL there is no forEach in DOMNodeList
             * http://stackoverflow.com/questions/13433799/why-doesnt-nodelist-have-foreach */
            Array.prototype.forEach.call(document.getElementsByClassName('user-action'), (element) => {

                /* add event listeners */
                element.addEventListener('mouseup', mouseListener, false);
                element.addEventListener('touchup', touchListener, false);

            });

            /* hide user input area */
            document.getElementById('ul-teclas').className = '';

        };

        /* disable user input */
        let disableUserInput = () => {

            /* add event listeners */
            window.removeEventListener('keydown', keyListener, false);

            /* see above */
            Array.prototype.forEach.call(document.getElementsByClassName('user-action'), (element) => {

                /* remove event listeners */
                element.removeEventListener('mouseup', mouseListener, false);
                element.removeEventListener('touchup', touchListener, false);

            });

            /* hide user input area */
            document.getElementById('ul-teclas').className = 'hidden';

        };

        /* consequence of user action (key pressed) */
        let choice = (scene) => {

            disableUserInput();

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
        let keyListener = function(event) {

            let actions = {
                67: 'anal',
                70: 'vaginal',
                66: 'oral'
            };

            let action = actions[event.keyCode];

            if (action) {
                choice(action);
            }

        };

        let mouseListener = function(event)  {
            let action = this.getAttribute('data-action');
            choice(action);
        };

        let touchListener = function(event) {
            let action = this.getAttribute('data-action');
            choice(action);
        };

        /* the game starts by calling this */
        let main = () => {
            return this.scenes.choice.play()
                .then(enableUserInput);
        };

        return main();

    };

    module.exports = Director;

})();