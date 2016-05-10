Flare.AudioEngine = function(mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;
    //Remember to check device.isCompatible
    this.mute;
    this.source = null;

    this.analyser;
    this.distortion;
    this.gainNode;
    this.biquadFilter;
    this.soundSource;

    return this;
};

Flare.AudioEngine.prototype = {
    boot: function() {
        //this.mute = document.querySelector('.muteButton');

        this.gainNode = this.mediaPlayer.audioCtx.createGain();
        this.playing = false;

    },

    createNewBufferSource: function() {
        //this.source.buffer = this.mediaPlayer.buffer.getAudioSource();//Buffer.read Waiting for Jens to finish is buffering

        this.source = this.mediaPlayer.audioCtx.createBufferSource();
        this.mediaPlayer.audioCtx.decodeAudioData(this.mediaPlayer.buffer.getAudioSource(), function(decodedBuffer) {
            this.source.buffer = decodedBuffer;
            console.log("done loading buffer");
            this.source.connect(this.gainNode);
            this.gainNode.connect(this.mediaPlayer.audioCtx.destination);
        }.bind(this));



    },

    connectBuffer: function(decodedBuffer) {
        this.source.buffer = decodedBuffer;
        console.log("done loading buffer");
        this.source.connect(this.gainNode);
        this.gainNode.connect(this.mediaPlayer.audioCtx.destination);
    },

    playSound: function(time) {

        this.createNewBufferSource();

        //if (!this.source.start) //If the browser does not support web audio
          //  this.source.start = source.noteOn;
        console.log(time + "playing at");
        this.source.start(0,time*1000);
        this.playing = true;
    },

    stopSound: function() {

        //if (!this.source.stop)
          //  this.source.stop = this.source.noteOff;

        this.source.stop();
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
    },

    changeVolume: function(rangeElement) {
        var volume = element.value;
        var portion = parseInt(volume) / parseInt(element.max);

        this.gainNode.gain.value = portion * portion;
    },
    
    finishPlayback: function(){
        
    }
    
    


};

Flare.AudioEngine.prototype.constructor = Flare.AudioEngine;