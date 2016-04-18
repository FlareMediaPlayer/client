Flare.AudioEngine = function(mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;
    this.audioCtx; //Remeber to check device.isCompatible
    this.mute;

    this.analyser;
    this.distortion;
    this.gainNode;
    this.biquadFilter;
    this.soundSource;

    return this;
};

Flare.AudioEngine.prototype = {
    boot: function() {
        this.audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        this.mute = document.querySelector('.muteButton');

        this.analyser = audioCtx.createAnalyser();
        this.distortion = audioCtx.createWaveShaper();
        this.gainNode = audioCtx.createGain();
        this.biquadFilter = audioCtx.createBiquadFilter();
        this.source = audioCtx.createBufferSource();
        this.playing = false;
        //this.source.buffer = Buffer.read Waiting for Jens to finish is buffering

    },

    playSound: function(time) {
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.audioCtx.destination);
        /*
        if (!this.source.start) //If the browser does not support web audio
          this.source.start = source.noteOn;
        */
        this.source.start(time);
        this.playing = true;
    },

    stopSound: function(time) {
        /*
          if(!this.source.stop)
            this.source.stop = this.source.noteOff;
        */
        this.source.stop(time)
        this.playing = false;
    },

    toggle: function(time) {
        this.playing ? this.stop(time) : this.play(time);
        this.playing = !this.playing;
    },

    muteAudio: function() {
        if (this.mute.id != "activated") {
            this.gainNode.gainvalue = 0; //Muting
            this.mute.id = "activated";
            this.mute.innerHTML = "Unmute"; //Will probably change to a different button in the mediaplayer
        } else {
            this.gainNode.gain.value = 1;
            this.mute.id = "deactivated";
            this.mute.innerHTML = "Mute";
        }
    }

};

Flare.AudioEngine.prototype.constructor = Flare.AudioEngine;
