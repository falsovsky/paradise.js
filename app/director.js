(function() {

    'use strict';

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
        this.scenes = requireScenes(require.context("../assets/scenes", true, /\.json$/));

    };

    Director.prototype.begin = function() {
        console.log(this.scenes);
        let scene = new Scene(this.scenes.anal, this.canvas);

        scene.play()
            .then(() => console.log('done'))
            .catch((e) => console.error(e));

    };

    module.exports = Director;

})();