/**
 * class for handling the canvas element
 * @author Fredrik Sigvartsen and Brian Parra
 * @memberOf Flare
 * @class Flare.Canvas
 * @constructor
 * @param {Flare.MediaPlayer} mediaPlayer a reference to the mediaPlayer
 * @return {Flare.Canvas} returns a Flare Canvas
 */

Flare.Canvas = function (videoPlayer) {

    /**
     * @property {Flare.VideoPlayer} mediaPlayer - A reference to the video player.
     */
    this.videoPlayer = videoPlayer;

    /**
     * @property {element} canvas the canvas element
     */
    this.canvas = document.createElement('canvas');

    /**
     * @param {object} ctx the 2d canvas context
     */
    this.ctx = this.canvas.getContext("2d");

    /**
     * @param {string} id the canvas id
     */
    this.canvas.id = "testId";//mediaPlayer.id;

    /**
     * @param {number} width the canvas width
     */
    this.canvas.width = 960;

    /**
     * @param {number} height the canvas height
     */
    this.canvas.height = 540;


    this.canvas.style.display = 'block';
    this.canvas.style.backgroundColor = 'black';

    return this;



};

Flare.Canvas.prototype = {
    /**
     * Renders the passed frame to canvas
     * @memberof Flare.Canvas.prototype
     * @function createNewBufferSource
     * @param {object} frame image data to draw
     */
    render: function (frame) {

        this.ctx.drawImage(frame, 0, 0);
        //RENDER LOGIC GOES HERE
        //THE ARGUMENT IS THE FULLY RENDERED FRAME, JUST NEED TO PAINT TO THE CANVAS  

    },
    /**
     * Returns the canvas element
     * @memberof Flare.Canvas.prototype
     * @function createNewBufferSource
     * @return {object} the canvas
     */
    getCanvas: function () {

        return this.canvas;

    }
};

Flare.Canvas.prototype.constructor = Flare.Canvas;