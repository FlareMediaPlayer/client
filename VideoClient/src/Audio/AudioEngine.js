/**
 * class for handling audio engine
 * @author Fredrik
 * @memberOf Flare
 * @class Flare.AudioEngine
 * @constructor
 * @param {MediaPlayer} mediaPlayer a reference to the mediaPlayer
 */

Flare.AudioEngine = function (mediaPlayer) {

    /**
     * @property {Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;

    /**
     * @property {boolean} mute tells if audio playback is muted
     */
    this.mute;

    /**
     * @property {buffer} source this is the buffer source to play from
     */
    this.source = null;

    /**
     * @property {number} offset the offset in ms to start playing from 
     */
    this.offset;


    /**
     * @property {node} webAudio node for gain
     */
    this.gainNode;



    return this;
};

Flare.AudioEngine.prototype = {
    /**
     * Initializes the audio engine
     * @memberof Flare.AudioEngine.prototype
     * @function boot
     * 
     */
    boot: function () {
        //this.mute = document.querySelector('.muteButton');

        this.gainNode = this.mediaPlayer.audioCtx.createGain();
        this.playing = false;

    },
    /**
     * Creates a new buffer source. This needs to be updated because right now its decoding every time before playing
     * @memberof Flare.AudioEngine.prototype
     * @function createNewBufferSource
     */
    createNewBufferSource: function () {
        //this.source.buffer = this.mediaPlayer.buffer.getAudioSource();//Buffer.read Waiting for Jens to finish is buffering

        this.source = this.mediaPlayer.audioCtx.createBufferSource();
        this.mediaPlayer.audioCtx.decodeAudioData(this.mediaPlayer.buffer.getAudioSource(), function (decodedBuffer) {
            this.source.buffer = decodedBuffer;
            console.log("done loading buffer");
            this.source.connect(this.gainNode);
            this.gainNode.connect(this.mediaPlayer.audioCtx.destination);
            console.log(this.offset);
            this.source.start(0, this.offset);
        }.bind(this));



    },
    /**
     * Starts the playback at the desired offset in ms
     * @memberof Flare.AudioEngine.prototype
     * @function playSound
     * @param {number} time offset in ms
     */
    playSound: function (time) {

        if (this.playing)
            return;

        this.offset = time / 1000;
        this.createNewBufferSource();


        this.playing = true;
        
    },
    /**
     * Stops playback
     * 
     * @memberof Flare.AudioEngine.prototype
     * @function stopSound
     */
    stopSound: function () {

        //if (!this.source.stop)
        //  this.source.stop = this.source.noteOff;

        this.source.stop();
        this.playing = false;
        
    },
    /**
     * toggles playback time
     * 
     * @memberof Flare.AudioEngine.prototype
     * @function toggle
     * @param {number} time offset to toggle at
     */
    toggle: function (time) {
        
        this.playing ? this.stop(time) : this.play(time);
        this.playing = !this.playing;
        
    },
    /**
     * mutes the audio
     * 
     * @memberof Flare.AudioEngine.prototype
     * @function muteAudio
     */
    muteAudio: function () {
        
        if (this.mute.id != "activated") {
            this.gainNode.gainvalue = 0; //Muting
            this.mute.id = "activated";
            this.mute.innerHTML = "Unmute"; //Will probably change to a different button in the mediaplayer
        } else {
            this.gainNode.gain.value = 1;
            this.mute.id = "deactivated";
            this.mute.innerHTML = "Mute";
        }
        
    },
    /**
     * Canges the audio volume
     * 
     * @memberof Flare.AudioEngine.prototype
     * @function changeVolume
     * @param {rangeElement} rangeElement range of volume slider
     */
    changeVolume: function (rangeElement) {
        
        var volume = element.value;
        var portion = parseInt(volume) / parseInt(element.max);

        this.gainNode.gain.value = portion * portion;
        
    }
};

Flare.AudioEngine.prototype.constructor = Flare.AudioEngine;