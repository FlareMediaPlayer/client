/**
 * This is the main Media Player class one single media player can be either an audio only, or video and audio player
 * @author Jens Omfjord and Brian Parra
 * @memberOf Flare
 * @class Flare.MediaPlayer
 * @constructor
 * @param {object} userOptions the passed in user options
 * @return {Flare.MediaPlayer} returns a Flare MediaPlayer
 */
Flare.MediaPlayer = function (userOptions) {

    /**
     * @property {number} id - video player id, for handling multiple MediaPlayer Objects
     */
    this.id = Flare.PLAYERS.push(this) - 1;

    /**
     * @property {object} options these are the default options which the user can override
     */
    this.options = {
        port: 6661,
        uri: 'localhost',
        videoID: '',
        container: '',
        //videoPath: '',
        videoSize: Flare.CONSTANTS.VIDEO_SIZE.ORIGINAL,
        videoScale: '',
        width: 960,
        height: 540

    }; //Default options


    this.parseOptions(userOptions);



    /**
     * @property {object} _networkManager internal reference to network manager
     */
    this._networkManager = null; //Not sure if public or private yet

    /**
     * @property {boolean} isBooted is the media player fully booted
     */
    this.isBooted = null;

    /**
     * @property {object} oscillator reference to an oscillator
     */
    this.oscillator = null;

    /**
     * @property {object} videoPlayer reference to the video player object
     */
    this.videoPlayer = null;

    /**
     * @property {object} audioEngine reference to an audio engine
     */
    this.audioEngine = null;

    /**
     * @property {object} buffer reference to the buffer
     */
    this.buffer = null;

    /**
     * @property {object} audioCtx reference to audio context
     */
    this.audioCtx = null;

    /**
     * @property {boolean} isPlaying is the media player currently in play mode
     */
    this.isPlaying = false;

    /**
     * @property {number} timeStarted time at which playback started
     */
    this.timeStarted = 0;

    /**
     * @property {number} totalTimePaused elapsed time while not in play mode after starting
     */
    this.totalTimePaused = 0;

    /**
     * @property {number} numPressedPlay a number for keeping track of toggling the play button
     */
    this.numPressedPlay = 0;

    /**
     * @property {number} deltaTime the difference in time since lased updated
     */
    this.deltaTime;

    /**
     * @property {number} timePaused time since paused
     */
    this.timePaused = 0;

    /**
     * @property {boolean} donePlaying has playback reached end of timeline
     */
    this.donePlaying = false;


    /**
     * @property {Flare.Device} Reference to global device object
     */
    this.device = Flare.Device;

    //You have to wait for the device to be ready
    this.device.whenReady(this.boot, this);

    console.log('Flare Media Player BETA  www.flaremediaplayer.com');

    return this;
};

Flare.MediaPlayer.prototype = {
    /**
     * Parses the user options
     * @memberof Flare.MediaPlayer.prototype
     * @function parseOptions
     * @param {object} userOptions These are the options passed in when initializing a flare media player
     */
    parseOptions: function (userOptions) {
        //REMEMBER TO SANITIZE USER INPUT
        console.log(userOptions);
        if (typeof userOptions.videoID != 'undefined') {

            this.options.videoID = userOptions.videoID;

        } else {
            console.log("location is not set");
        }

        if (typeof userOptions.uri != 'undefined') {

            this.options.uri = userOptions.uri;

        }

        if (typeof userOptions.container != 'undefined') {

            this.options.container = userOptions.container;

        }

    },
    /**
     * Boots up the entire media player
     * @memberof Flare.MediaPlayer.prototype
     * @function boot
     */
    boot: function () {

        if (this.isBooted) {
            return;
        }


        var AudioContext = window.AudioContext || window.webkitAudioContext;
        this.audioCtx = new AudioContext();
        //Initialize System
        this.oscillator = new Flare.Oscillator(this);
        this.clock = new Flare.Clock(this);
        this.buffer = new Flare.Buffer(this);
        this.audioEngine = new Flare.AudioEngine(this);
        this._networkManager = new Flare.NetworkManager(this);
        //this._networkManager.requestVideo(this.options.videoPath);



        this.videoPlayer = new Flare.VideoPlayer(this);

        //this.canvas = new Flare.Canvas(this);
        //this.canvas.addToDOM();

        this.videoPlayer.boot();
        this.audioEngine.boot();
        //Okay now start the oscillator
        this.clock.boot();
        this.oscillator.run();




    },
    /**
     * This is the core video logic loop
     * @memberof Flare.MediaPlayer.prototype
     * @param {time} time of update
     */
    update: function (time) {
        this.clock.update(time);
        //Finished with update, render the frame:
        //TESTING ONLY

        /*
         if(this.numPressedPlay === 0){
         this.setStartTime(Date.now());
         }
         */

        //this.canvas.render(this.frames[this.testCounter%152]);
        if (this.isPlaying) {


            this.deltaTime = Date.now() - this.timeStarted;
            this.audioEngine.playSound(this.deltaTime);
            //this.videoPlayer.updateTimeDisplay(this.clock.totalTimePlayed(this.timeStarted, this.totalTimePaused), "0:33");

            //this.videoPlayer.update(this.buffer.getFrameAt(this.testCounter), this.testCounter);
            this.videoPlayer.update(this.deltaTime);
            //this.testCounter = (this.testCounter + 1) % 151;

        }

    },
    /**
     * Sets the time started 
     * @memberof Flare.MediaPlayer.prototype
     * @function setStartTime
     * @param {number} time time at which playback starts
     */
    setStartTime: function (time) {
        this.timeStarted = time;
    },
    /**
     * Sets paused time
     * @memberof Flare.MediaPlayer.prototype
     * @function setPauseTime
     * @param {number} time time at which playback pauses
     */
    setPauseTime: function (time) {
        this.timePaused = time;
    },
    /**
     * Switches between play and pause mode
     * @memberof Flare.MediaPlayer.prototype
     * @function togglePlay
     */
    togglePlay: function () {

        if (this.isPlaying) {
            this.isPlaying = false;
            this.clock.setPauseTime(Date.now());
            this.timePaused = Date.now();
            this.audioEngine.stopSound();
        } else {
            this.isPlaying = true;


            if (this.timePaused === 0) {
                this.setStartTime(Date.now());
            } else {
                this.setStartTime(Date.now() - this.deltaTime);
            }
            //this.audioEngine.playSound(Date.now() - this.timeStarted);
            /*
             if(this.numPressedPlay > 0){
             this.totalTimePaused += Date.now() - this.clock.getPauseTime();
             }
             this.numPressedPlay++;
             */
        }
    },
    /**
     * Resets the timeline
     * @memberof Flare.MediaPlayer.prototype
     * @function reset
     */
    reset: function () {
        //reset all counters
        this.timePaused = 0;
        this.timeStarted = 0;
        this.deltaTime = 0;
    },
    /**
     * Is currently in play mode
     * @memberof Flare.MediaPlayer.prototype
     * @function isPlayMode
     * @return {boolean} is currently playing
     */
    isPlayMode: function () {
        return this.isPlaying;
    },
    /**
     * Gets number of times play was pressed
     * @memberof Flare.MediaPlayer.prototype
     * @function getNumPressedPlay
     * @return {number} number of times play was pressed
     */
    getNumPressedPlay: function () {
        return this.numPressedPlay;
    },
    /**
     * callback for when the end of the timeline has been reached
     * @memberof Flare.MediaPlayer.prototype
     * @function finishPlayback
     */
    finishPlayback: function () {
        this.isPlaying = false;
        this.audioEngine.stopSound();
        this.reset();

    }


};

Flare.MediaPlayer.prototype.constructor = Flare.MediaPlayer;