/**
 * Class for keeping track of time
 * @author Brian Parra
 * @memberOf Flare
 * @class Flare.Clock
 * @constructor
 * @param {Flare.MediaPlayer} mediaPlayer a reference to the mediaPlayer
 * @return {Flare.Clock} returns a Flare AudioEngine
 */

Flare.Clock = function (mediaPlayer) {


    /**
     * @property {Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;

    /**
     * @property {number} _timeInitialized the time the clock has started
     */
    this._timeInitialized = 0;

    /*
     * @property {number} elapsed time elapsed
     */
    this.elapsed = 0;

    /*
     * @property {number} elapsedMs time elapsed in ms
     */
    this.elapsedMs = 0;

    /*
     * @property {number} previousTime previous clock update time
     */
    this.previousTime = 0;

    /*
     * @property {number} currentTime the current time
     */
    this.currentTime = 0;

    /*
     * @property {number} timeUpdated the time updated
     */
    this.timeUpdated = 0;

    /*
     * @property {number} lastTimeUpdated last time updated
     */
    this.lastTimeUpdated = 0;

    /*
     * @property {number} timeStarted time when the clock was started
     */
    this.timeStarted = 0;

    /*
     * @property {number} timePaused time when paused
     */
    this.timePaused = 0;

    /*
     * @property {number} time getneric time holder
     */
    this.time = 0;

    /*
     * @property {number} minutes minutes played
     */
    this.minutes = 0;

    return this;


};

Flare.Clock.prototype = {
    /**
     * Boot function for the clock
     * @memberof Flare.Clock.prototype
     * @function boot
     * 
     */
    boot: function () {
        this._timeInitialized = Date.now();
        this.timeUpdated = Date.now();
    },
    /**
     * On each refresh, adjust all the time holders
     * @memberof Flare.Clock.prototype
     * @function refresh
     * 
     */
    refresh: function () {

        //  Set to the old Date.now value
        this.lastTimeUpdated = this.timeUpdated;

        // this.time always holds a Date.now value
        this.timeUpdated = Date.now();

        //  Adjust accordingly.
        this.elapsedMs = this.timeUpdated - this.lastTimeUpdated;

    },
    /**
     * The function thats called on update
     * @memberof Flare.Clock.prototype
     * @function update
     * @param {number} time  time updated
     * 
     */
    update: function (time) {


        this.lastTimeUpdated = this.timeUpdated;

        // this.time always holds a Date.now value
        this.timeUpdated = Date.now();

        this.elapsedMS = this.timeUpdated - this.lastTimeUpdated;

        this.previousTime = this.currentTime;

        this.currentTime = time;

        this.elapsed = this.currentTime - this.previousTime;

    },
    /**
     * Get the total time played
     * @memberof Flare.Clock.prototype
     * @function totalTimePlayed
     * @param {number} startTime time Started
     * @param {number} pauseTime time paused
     * @return {string} formated time string
     */
    totalTimePlayed: function (startTime, pauseTime) {
        if (startTime === 0) {    //video has not started playing yet
            return 0;
        }
        this.time = ((Date.now() - startTime) - pauseTime) / 1000;
        var seconds = Math.floor(this.time * 1) / 1;
        if (seconds > 59) {
            this.minutes++;
            this.time = 0;
            seconds = 0;
            this.mediaPlayer.setStartTime(Date.now());
        }
        if (seconds < 10) {
            return this.minutes + ":0" + seconds;
        }
        return this.minutes + ":" + seconds;
    },
    /**
     * Get the last tiem paused
     * @memberof Flare.Clock.prototype
     * @function getPauseTime
     * @return {number} time paused
     * 
     */
    getPauseTime: function () {
        return this.timePaused;
    },
    /**
     * Set time paused
     * @memberof Flare.Clock.prototype
     * @function setPauseTime
     * @param {number} time paused
     * 
     */
    setPauseTime: function (time) {
        this.timePaused = time;
    }

};

Flare.Clock.prototype.constructor = Flare.Clock;