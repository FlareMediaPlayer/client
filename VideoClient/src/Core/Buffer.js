/**
 * class for handling buffering
 * @author Jens Omfjord
 * @memberOf Flare
 * @class Flare.Buffer
 * @constructor
 * @param {MediaPlayer} mediaPlayer a reference to the mediaPlayer
 */
Flare.Buffer= function (mediaPlayer) {


    /**
    * @property {Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
    */

    this.mediaPlayer = mediaPlayer;
    
    /*
     * @property {number} channels number of audio channels
     */
    this.channels = 2 //Stereo for now

    
    this.frame_count = this.mediaPlayer.audioCtx.sampleRate = 2.0;

    this.audio_buffer = this.mediaPlayer.audioCtx.createBuffer(this.channels, this.frame_count, this.mediaPlayer.audioCtx.sampleRate);

    this.frameBuffer;
    
    this.frameCount;

    this.frameRate;
    
    this.duration;
    
    this.fps;
    
    this.framesLoaded = 0;
    this.isLoaded = false;
    
    this.audioData = null;
    
    return this;
    
    
    
    
};

Flare.Buffer.prototype = {
	write: function () {
		for(var channel = 0; channel < channels; channel++){
			this.current_buffer = this.audio_buffer.getChannelData(channel);
			for(var i = 0; i < this.frame_count; i++){
				this.current_buffer[i] = Math.random() * 2 - 1;
			}
		}

		var source = this.mediaPlayer.audioSource;

		source.buffer = this.audio_buffer;

		source.connect(this.mediaPlayer.audioCtx.destination);
	},

	read: function () {
		this.return_array = this.audio_buffer.slice();	//throw exception if reading from empty buffer
		return this.return_array;
	},
        
        initFrameBuffer: function(_frameCount, _frameRate, _duration){
            
            this.frameBuffer = new Array(_frameCount);
            this.frameCount = _frameCount;
            this.frameRate = _frameRate;
            this.duration = _duration;
            
        },
        
        getFrameAt : function(index){
            
            return this.frameBuffer[index];
            
        },
        
        setFrameAt : function (index, frame){
            
            this.frameBuffer[index] = frame;
            this.framesLoaded++;
            
            this.mediaPlayer.videoPlayer.updateLoadProgress(this.framesLoaded / this.frameCount);
            
            if(this.frameCount === this.framesLoaded){
                this.isLoaded = true;
                this.mediaPlayer.videoPlayer.toggleLockingButtons(); // locking all buttons in mediaplayer
                this.mediaPlayer.videoPlayer.removeLoadingBar();
                console.log("buffer doneLoading");
            }
        },
        
        setDuration: function(duration){
            this.duration = duration;
        },
        
        setAudioData : function(data){
            this.audioData = data;
            //this.mediaPlayer.audioEngine.createNewBufferSource();
            //console.log(this.audioData);
        },
        
        getAudioSource : function(){
            return this.audioData;
        },
        
        getFrameCount: function(){
            return this.frameCount;
        },
        
        getDuration: function(){
            return this.duration;
        },
        
        getFps : function(){
            return this.fps();
        },
        
        setFps : function(fps){
            this.fps = fps;
        }

};

Flare.Buffer.prototype.constructor = Flare.Buffer;