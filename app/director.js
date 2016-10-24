(function() {

    'use strict';

    const _ = {
        mapValues: require('lodash/mapvalues'),
        sample: require('lodash/sample')
    };
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

    /* enable user input */
    Director.prototype.enableUserInput = function(userChoices, afterChoice) {

        /* create user input area */
        document.getElementById('ul-teclas').innerHTML = userChoices.reduce((accumulator, choice) => {
            accumulator +=
                `<li class="user-action" id="li-${choice.name}" data-action="${choice.name}">${choice.key}<div>${choice.name}</div></li>`;
            return accumulator;
        }, '');

        /* define and add event listeners */
        /* * keyboard key listener * */
        this.keyListener = function(event) {

            let actions = userChoices.reduce((accumulator, choice) => {
                accumulator[choice.keyCode] = choice.name;
                return accumulator;
            }, {});

            let action = actions[event.keyCode];

            if (action) {
                afterChoice(action);
            }

        };
        /* * add event listener */
        window.addEventListener('keydown', this.keyListener, false);

        /* * mouse and touch listener */
        this.mouseTouchListener = function(event)  {
            let action = this.getAttribute('data-action');
            afterChoice(action);
        };
        /* LOL there is no forEach in DOM NodeList
         * http://stackoverflow.com/questions/13433799/why-doesnt-nodelist-have-foreach */
        Array.prototype.forEach.call(document.getElementsByClassName('user-action'), (element) => {

            /* add event listeners */
            element.addEventListener('mouseup', this.mouseTouchListener, false);
            element.addEventListener('touchup', this.mouseTouchListener, false);

        });

    };


    /* disable user input */
    Director.prototype.disableUserInput = function() {

        /* add event listeners */
        window.removeEventListener('keydown', this.keyListener, false);
        delete this.keyListener;

        /* see in enableUserInput above */
        Array.prototype.forEach.call(document.getElementsByClassName('user-action'), (element) => {

            /* remove event listeners */
            element.removeEventListener('mouseup', this.mouseTouchListener, false);
            element.removeEventListener('touchup', this.mouseTouchListener, false);

        });
        delete this.mouseTouchListener;

        /* remove user input area */
        document.getElementById('ul-teclas').innerHTML = '';

    };


    /* begins the game (actually runs the whole game) */
    /* @TODO lol everything is implemented here, if this needs to grow it will become ugly
     * think about refactoring all the code in here later */
    Director.prototype.begin = function() {

        /* defines which scenes can be chosen */
        let userChoices = [
            { 'name': 'anal', keyCode: 67, key: 'c' },
            { 'name': 'vaginal', keyCode: 70, key: 'f' },
            { 'name': 'oral', keyCode: 66, key: 'b' }
        ];

        /* when user chooses action, function this is to be called */
        let afterChoice = (scene) => {

            this.disableUserInput();

            /* play the selected choice screen */
            this.scenes['choice_' + scene].play()
                /* then play the chosen scene */
                .then(() => this.scenes[scene].play())
                /* then play the reinaldo scene */
                .then(() => {
                    /* set valor property for reinaldo scene */
                    this.scenes.reinaldo.properties.valor_acto = _.sample([1000, 2000, 3000]);
                    return this.scenes.reinaldo.play();
                })
                /* then start all over again */
                .then(main);
        };

        /* the game starts by calling this */
        let main = () => {
            return this.scenes.choice.play()
                .then(() => this.enableUserInput(userChoices, afterChoice));
        };

        return main();

    };

    module.exports = Director;

})();
