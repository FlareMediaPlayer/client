/**
 * class for handling audio engine
 * @author Brian
 * @memberOf Flare
 * @class Flare.Oscillator
 * @constructor
 * @param {Flare.MediaPlayer} mediaPlayer a reference to the mediaPlayer
 * @return {Flare.Oscillator} returns an Oscillator
 */

Flare.Oscillator = function (mediaPlayer) {


    /**
     * @property {Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;

    /**
     * @property {boolean} running is the oscillator running
     */
    this.running = false;

    /**
     * @property {function} _loopFunction this is the function that is continuously called
     */
    this._loopFunction = null;

    /**
     * @property {number} _eventId the id of the timeout event
     */
    this._eventId = null;

    /**
     * @property {number} fps the frames per second
     */
    this.fps = 30; // Testing for now

    /**
     * @property {number} speed at which the updates are occuring
     */
    this.updateSpeed = 0;

    /**
     * @property {boolean} usingSetTimeOut is SetTimeOut being used for loop
     */
    this.usingSetTimeOut = false;

    /**
     * @property {boolean} usingRequestAnimationFrame is RequestAnimationFrame being used for loop
     */
    this.usingRequestAnimationFrame = false;

    return this;


};

Flare.Oscillator.prototype = {
    /**
     * This is the main function to start the loops
     * @memberof Flare.Oscillator.prototype
     * @function run
     */
    run: function () {

        this.running = true;
        var _this = this;
        this.updateSpeed = Math.floor(1000 / this.fps);

        //if window.requestAnimationFrame is not available, use setTimeout
        if (!window.requestAnimationFrame) {

            this.usingSetTimeOut = true;

            this._loopFunction = function () {
                return _this.updateSetTimeout();
            };

            this._eventId = window.setTimeout(this._loopFunction, 0);



        } else {

            this.usingRequestAnimationFrame = true;

            this._loopFunction = function (time) {
                return _this.updateRequestAnimationFrame(time);
            };

            this._eventId = window.requestAnimationFrame(this._loopFunction);


        }

    },
    /**
     * Stop running the update loop
     * @memberof Flare.Oscillator.prototype
     * @function stop
     */
    stop: function () {

        if (this.usingSetTimeOut) {

            clearTimeout(this._eventId);

        } else {

            window.cancelAnimationFrame(this._eventId);
        }

        this.running = false;

    },
    /**
     * This is the loop function using RequestAnimationFrame
     * @memberof Flare.Oscillator.prototype
     * @param {number} time update time
     * @function updateRequestAnimationFrame
     */
    updateRequestAnimationFrame: function (time) {

        this.mediaPlayer.update(Math.floor(time));

        this._eventId = window.requestAnimationFrame(this._loopFunction);

    },
    /**
     * This is the loop function using updateSetTimeout
     * @memberof Flare.Oscillator.prototype
     * @function updateRequestAnimationFrame
     */
    updateSetTimeout: function () {

        this.mediaPlayer.update(Date.now());

        this._eventId = window.setTimeout(this._loopFunction, this.updateSpeed);

    }

};

Flare.Oscillator.prototype.constructor = Flare.Oscillator;