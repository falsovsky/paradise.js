(function() {

    'use strict';


    let Canvas = function(container, width, height) {

        this.container = container;
        this.width = width;
        this.height = height;
        this.images = {};

        /* canvas element */
        let canvas = document.createElement('canvas');
        canvas.setAttribute('width', this.width);
        canvas.setAttribute('height', this.height);
        canvas.setAttribute('id', 'canvas');
        this.container.appendChild(canvas);
        this.context = canvas.getContext("2d");

        /* load images */
        const requireImages = function (requireContext) {
            return requireContext.keys().reduce(function(accumulator, filename) {
                let framename = filename.match(/\.\/(\S+)\.png$/)[1];
                accumulator[framename] = requireContext(filename);
                return accumulator;
            }, {});
        };
        this.images = requireImages(require.context("../assets/images", true, /\.png$/));

    };

    Canvas.prototype.showImage = function(name) {

        if (!(name in this.images)) {
            throw new Error('image ' + name + ' unknown');
        }

        var image = new Image();
        image.onload = () => {
          this.context.drawImage(image, 0, 0);
        };
        image.src = this.images[name];

    };

    module.exports = Canvas;

})();