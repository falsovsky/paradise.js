(function() {

    'use strict';

    let Canvas = function(container, width, height) {

        /* html element that the canvas will be created in */
        this.container = container;

        /* canvas width */
        this.width = width;

        /* canvas height */
        this.height = height;

        /* canvas element - create and set properties */
        this.canvas = document.createElement('canvas');
        this.canvas.setAttribute('width', this.width);
        this.canvas.setAttribute('height', this.height);
        this.canvas.setAttribute('id', 'canvas');

        /* insert in dom */
        this.container.appendChild(this.canvas);

        /* get drawing interface */
        this.context = this.canvas.getContext("2d");

        /* load images dynamically from all .png files present in '../assets/images'.
         * this function implements a reducer that reduces all files loaded to a
         * single object with the image filename name minus extension as key
         * and the require()d file as value */
        const requireImages = function (requireContext) {
            return requireContext.keys().reduce(function(accumulator, filename) {
                let framename = filename.match(/\.\/(\S+)\.png$/)[1];
                accumulator[framename] = requireContext(filename);
                return accumulator;
            }, {});
        };
        this.images = requireImages(require.context('../assets/images', true, /\.png$/));

    };

    /* draw the image specified as argument on this canvas */
    Canvas.prototype.drawImage = function(name) {

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