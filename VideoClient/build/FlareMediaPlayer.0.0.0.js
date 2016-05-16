
(function(){

    var root = this;

/**
 * @namespace Flare
 */
var Flare = Flare || {
    /**
     * The Version Number
     * @constant
     * @type {string}
     */
    VERSION: '0.0.0',
    
    /**
     * An array of video player instances. This way we can add multiple video players without having 
     * to worry about it later.
     * @constant
     * @type {array}
     */
    PLAYERS: []
    
};


Flare.CONSTANTS = {
    //Put Constant values here
    VIDEO_SIZE:{
        ORIGINAL: 0,
        FIXED: 1,
        RESPONSIVE: 2
    },
    
    VIDEO_SCALE_MODE : {
        MAINTAIN_ASPECT: 0,
        FILL: 1
    },
    
    FLARE_MESSAGE_HEADER_LENGTH: 5,
    



};


Flare.InitializeVideoTask= function () {


    /**
    * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
    */
   
    this.data;
    this.dataView;
    this.flareOpCode;
    this.mediaPlayer;
    

    return this;
    
    
    
    
};

Flare.InitializeVideoTask.prototype.setData = function(data) {

    this.data = data;
    this.dataView = new DataView(this.data);
    this.flareOpCode = Flare.OpCode.OPEN_VIDEO;
    this.videoIsAvailable = false;

    this.width = 0;
    this.height = 0;
    this.fps = 0;
    this.duration = 0;
    
};

Flare.InitializeVideoTask.prototype.setMediaPlayer = function(mediaPlayer) {

    this.mediaPlayer = mediaPlayer;
    
};


Flare.InitializeVideoTask.prototype.process = function() {

    var dataLength = this.dataView.getInt32(1);
    var videoIsAvailable = this.dataView.getInt8(5);
    console.log("the video you requested is " + this.mediaPlayer.options.videoID);
    //console.log(videoIsAvailable);
    
    if(videoIsAvailable === 1){
       this.videoIsAvailable = true;
       this.width = this.dataView.getInt32(6);
       this.height = this.dataView.getInt32(10);
       this.fps = this.dataView.getFloat64(14);
       this.duration = this.dataView.getFloat64(22);
       console.log(this.width + " width" );
       console.log(this.height + " height " );
       console.log(this.fps + " fps " );
       console.log(this.duration + " duration " );
       
       this.mediaPlayer.buffer.initFrameBuffer(337, this.fps); //Swap out for dynamic buffer and frame rate later
       console.log("video is available!");
    }else{
        console.log("video is not available!");
    }

    
    
    
};

Flare.InitializeVideoTask.prototype.constructor = Flare.InitializeVideoTask;

Flare.ProcessAudioTask= function () {


    /**
    * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
    */
   
    this.data;
    this.dataView;
    this.flareOpCode;
    this.mediaPlayer;
    

    return this;
    
    
    
    
};

Flare.ProcessAudioTask.prototype.setData = function(data) {

    this.data = data;
    this.dataView = new DataView(this.data);
    this.flareOpCode = Flare.OpCode.FRAME;
    this.videoIsAvailable = false;
    
};

Flare.ProcessAudioTask.prototype.setMediaPlayer = function(mediaPlayer) {

    this.mediaPlayer = mediaPlayer
    
};


Flare.ProcessAudioTask.prototype.process = function() {

    var dataLength = this.dataView.getInt32(0);
    
    
    
    //This way is probably super slow!!!!
    //var blob = new Blob([this.data.slice(5)], { type: 'audio/m4a' });
    //var urlCreator = window.URL || window.webkitURL;
    //var audioUrl = urlCreator.createObjectURL( blob );
    
    this.mediaPlayer.buffer.setAudioData(this.data.slice(5));
    //this.mediaPlayer.audioEngine.init();

           
    


    
    
    
};

Flare.ProcessAudioTask.prototype.constructor = Flare.ProcessAudioTask;

Flare.ProcessFrameTask= function () {


    /**
    * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
    */
   
    this.data;
    this.dataView;
    this.flareOpCode;
    this.mediaPlayer;
    

    return this;
    
    
    
    
};

Flare.ProcessFrameTask.prototype.setData = function(data) {

    this.data = data;
    this.dataView = new DataView(this.data);
    this.flareOpCode = Flare.OpCode.FRAME;
    this.videoIsAvailable = false;
    
};

Flare.ProcessFrameTask.prototype.setMediaPlayer = function(mediaPlayer) {

    this.mediaPlayer = mediaPlayer
    
};


Flare.ProcessFrameTask.prototype.process = function() {

    var dataLength = this.dataView.getInt32(0);
    var index = this.dataView.getUint32(5);
    
    
    //This way is probably super slow!!!!
    var img = new Image;
    var blob = new Blob([this.data.slice(9)], { type: 'image/jpg' });
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL( blob );
    img.src = imageUrl;
    console.log("frame " +index + "loaded");
  
 

           
    this.mediaPlayer.buffer.setFrameAt(index, img);
 
    


    
    
    
};

Flare.ProcessFrameTask.prototype.constructor = Flare.ProcessFrameTask;
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

        if (!this.source.start) //If the browser does not support web audio
            this.source.start = source.noteOn;

        this.source.start(time);
        this.playing = true;
    },

    stopSound: function(time) {

        if (!this.source.stop)
            this.source.stop = this.source.noteOff;

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
    },

    changeVolume: function(rangeElement) {
        var volume = element.value;
        var portion = parseInt(volume) / parseInt(element.max);

        this.gainNode.gain.value = portion * portion;
    }


};

Flare.AudioEngine.prototype.constructor = Flare.AudioEngine;

Flare.AudioPlayer= function (mediaPlayer) {


    /**
    * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
    */
    this.mediaPlayer = mediaPlayer;

    return this;
    
    
    
};

Flare.AudioPlayer.prototype = {


};

Flare.AudioPlayer.prototype.constructor = Flare.AudioPlayer;

Flare.Buffer= function (mediaPlayer) {


    /**
    * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
    */
   
    
   
    this.mediaPlayer = mediaPlayer;
    
    this.testFrame =  null;

    this.channels = 2 //Stereo for now

    this.frame_count = this.mediaPlayer.audioCtx.sampleRate = 2.0;

    this.audio_buffer = this.mediaPlayer.audioCtx.createBuffer(this.channels, this.frame_count, this.mediaPlayer.audioCtx.sampleRate);

    this.frameBuffer;
    
    this.frameCount;

    this.frameRate;
    
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
        
        initFrameBuffer: function(_frameCount, _frameRate){
            
            this.frameBuffer = new Array(_frameCount);
            this.frameCount = _frameCount;
            this.frameRate = _frameRate
            
        },
        
        getFrameAt : function(index){
            
            return this.frameBuffer[index];
            
        },
        
        setFrameAt : function (index, frame){
            
            this.frameBuffer[index] = frame;
            this.framesLoaded++;
            
            if(this.frameCount == this.framesLoaded){
                this.isLoaded = true;
                this.mediaPlayer.videoPlayer.toggleLockingButtons(); // locking all buttons in mediaplayer
                this.mediaPlayer.videoPlayer.removeLoadingBar();
                console.log("buffer doneLoading");
            }
        },
        
        setAudioData : function(data){
            this.audioData = data;
            console.log(this.audioData);
        },
        
        getAudioSource : function(){
            return this.audioData;
        }

};

Flare.Buffer.prototype.constructor = Flare.Buffer;

Flare.Canvas = function (videoPlayer) {

    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    //this.mediaPlayer = mediaPlayer;
    this.videoPlayer = videoPlayer;


    //Private canvas element
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");

    this.canvas.id ="testId" ;//mediaPlayer.id;

    //for now hard code
    this.canvas.width = 960;
    this.canvas.height = 540;
    
    this.canvas.style.display = 'block';
    this.canvas.style.backgroundColor = 'black';

    return this;



};

Flare.Canvas.prototype = {
    
    render: function(frame){
        
        this.ctx.drawImage(frame, 0 ,0);
        //RENDER LOGIC GOES HERE
        //THE ARGUMENT IS THE FULLY RENDERED FRAME, JUST NEED TO PAINT TO THE CANVAS  
        
    },
    
    getCanvas: function(){
        
        return this.canvas;
        
    }
};

Flare.Canvas.prototype.constructor = Flare.Canvas;
Flare.MediaPlayer = function(userOptions) {

    /**
     * @property {number} id - video player id, for handling multiple MediaPlayer Objects
     * @readonly
     */
    this.id = Flare.PLAYERS.push(this) - 1;


    this.options = {
        videoID: '',
        container: '',
        //videoPath: '',
        videoSize: Flare.CONSTANTS.VIDEO_SIZE.ORIGINAL,
        videoScale: '',
        width: 960,
        height: 540

    }; //Default options

    this.parseOptions(userOptions);

    this.parent = "parent";

    //Filling out some basic properties we might need
    //DONT FORGET TO DO COMMENTS LATER



    this.url = null;
    this.frameWidth = null;
    this.frameHeight = null;
    this._networkManager = null; //Not sure if public or private yet
    this._forceUpdate;
    this.isBooted = null;
    this.oscillator = null;
    this.videoPlayer = null;
    this.audioEngine = null;
    this.buffer = null;
    this.audioCtx = null;
    this.isPlaying = false;

    this.testCounter = 0;
    this.timeStarted = 0;
    this.totalTimePaused = 0;
    this.numPressedPlay = 0;


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

    parseOptions: function(userOptions) {
        //REMEMBER TO SANITIZE USER INPUT
        console.log(userOptions);
        if (typeof userOptions.videoID != 'undefined') {

            this.options.videoID = userOptions.videoID;

        } else {
            console.log("location is not set");
        }

    },

    boot: function() {

        if (this.isBooted) {
            return;
        }

        this._forceUpdate = true;

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


    //This should probably go in videoEngine
    update: function(time) {
        this.clock.update(time);
        //Finished with update, render the frame:
        //TESTING ONLY

        if(this.numPressedPlay === 0){
            this.setStartTime(Date.now());
        }

        //this.canvas.render(this.frames[this.testCounter%152]);
        if (this.isPlaying) {
            //this.videoPlayer.update(this.frames[this.testCounter] , this.testCounter);
            this.videoPlayer.updateTimeDisplay(this.clock.totalTimePlayed(this.timeStarted, this.totalTimePaused), "0:33");

            this.videoPlayer.update(this.buffer.getFrameAt(this.testCounter), this.testCounter);
            this.testCounter = (this.testCounter + 1) % 151;

        }
        //Timing is completely messed up. Need to figure out core video engine code
    },

    setStartTime: function(time) {
        this.timeStarted = time;
    },

    togglePlay: function() {

        if (this.isPlaying) {
            this.isPlaying = false;
            this.clock.setPauseTime(Date.now());
        } else {
            this.isPlaying = true;
            this.audioEngine.playSound(0);
            if(this.numPressedPlay > 0){
                this.totalTimePaused += Date.now() - this.clock.getPauseTime();
            }
            this.numPressedPlay++;
        }
    },

    isPlayMode: function() {
        return this.isPlaying;
    },

    getNumPressedPlay: function() {
        return this.numPressedPlay;
    }


};

Flare.MediaPlayer.prototype.constructor = Flare.MediaPlayer;

Flare.VideoEngine= function (mediaPlayer) {


    /**
    * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
    */
    this.mediaPlayer = mediaPlayer;
    this.canvas = null;
    this.videoWidth;
    this.videoHeight;
    this.videoPlayer = null;
    return this;
    
    
    
};

Flare.VideoEngine.prototype = {
    
    boot: function(){
            var target;
        var parent = this.mediaPlayer.parent;

        
        if (parent)
        {
            if (typeof parent === 'string')
            {
                target = document.getElementById(parent);
            } else if (typeof parent === 'object' && parent.nodeType === 1)
            {
                target = parent;
            }
        }
        
        // Fallback, covers an invalid ID and a non HTMLelement object
        if (!target){
            
            target = document.body;
        }
        
        
        target.appendChild(this.videoPlayer);
    },
    
    initialize: function(){
        
        this.videoPlayer = document.createElement('div');
        this.videoPlayer.id = "videoId";
        
        this.canvas = new Flare.Canvas();
        

        
        
    }
    
    

};

Flare.VideoEngine.prototype.constructor = Flare.VideoEngine;
Flare.VideoPlayer = function(mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;
    this.canvas = null;
    this.videoWidth;
    this.videoHeight;
    this.videoPlayer;
    this.controlBar;
    this.progressBarContainer;
    this.playButton;
    this.controlBarInner;
    this.leftControls;
    this.rightControls;
    this.settingsButton;
    this.settingsPath;
    this.progressBar;
    this.progressBarDisplayGroup;
    this.playProgress;
    this.timeDisplay;
    this.volumeControl;
    this.muteButton;
    this.loadingBar;
    this.buttonsLocked = false;

    this.muteButtonStyle = {
        background: 'none',
        border: 'none',
        color: 'white'
    };

    this.volumeControlStyle = {
        display: 'inline-block'

    };

    this.timeDisplayStyle = {
        display: 'inline-block',
        padding: '0 5px',
        'line-height': '30px',
        color: 'rgba(255,255,255,0.95)',
        'font-family': 'Verdana, Geneva, sans-serif',
        'font-size': '12px'
    };

    this.playProgressStyle = {
        position: 'absolute',
        bottom: 0,
        left: '0px',
        'background-color': 'rgba(0,0,255,0.7)',
        height: '100%',
        width: '100%',
        'transform-origin': '0 0 '

    };

    this.progressBarDisplayGroupStyle = {
        height: '100%',
        //transform: 'scaleY(0.5)',
        transition: 'transform .1s cubic-bezier(0.4,0.0,1,1)',
        'background-color': 'rgba(255,255,255,0.6)',
        'transform-origin': 'bottom'


    };

    this.progressBarStyle = {
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '100%',
        'touch-action': 'none'

    };

    this.progressBarAttribtues = {
        role: 'slider',
        draggable: 'true',
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': 0,
        //'tabindex' : 0

    };

    this.rightControlsStyle = {
        float: 'right',
        height: '100%'
    };



    this.leftControlsStyle = {
        float: 'left',
        height: '100%'
    };

    this.videoPlayerStyle = {
        position: 'relative',
        overflow: 'hidden',
        width: '960px',
        height: '540px'

    };

    this.controlBarInnerStyle = {

    };

    this.controlBarStyle = {
        height: '30px',
        position: 'absolute',
        bottom: '0',
        left: 0,
        right: 0,
        'background-color': 'rgba(0,0,0,0.5)'
    };

    this.playButtonStyle = {
        color: 'white',
        'font-size': '20px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        width: '30px'

    };

    this.progressBarContainerStyle = {
        width: '100%',
        position: 'absolute',
        height: '5px',
        bottom: '30px',
        cursor: 'pointer'
    };

    this.loadingBarStyle = {
        position: 'absolute',
        left: '40%',
        top: '30%',
        right: '0px',
        bottom: '0px',
        width: '100%',
        height: '100%',
        'z-index': '99',
        background: "url('../src/images/page-loader.gif')",
        'background-repeat': 'no-repeat'
    };

    return this;



};

Flare.VideoPlayer.prototype = {

    boot: function() {

        this.videoPlayer = document.createElement("div");
        this.loadingBar = document.createElement("div");
        this.controlBar = document.createElement("div");
        this.progressBarContainer = document.createElement("div");
        this.leftControls = document.createElement("div");
        this.rightControls = document.createElement("div");
        this.controlBarInner = document.createElement("div");
        this.playButton = document.createElement("button");
        this.muteButton = document.createElement("button");
        this.volumeControl = document.createElement("div");
        this.progressBar = document.createElement("div");
        this.progressBarDisplayGroup = document.createElement("div");
        this.controlBarInner = document.createElement("div");
        this.playProgress = document.createElement("div");
        this.timeDisplay = document.createElement("div");
        this.settingsButton = document.createElement("svg");
        this.settingsPath = document.createElementNS('http://www.w3.org/2000/svg', "path");


        this.settingsPath.setAttributeNS(null, "d", Flare.Icons.settings);
        this.videoPlayer.id = "videoId";

        this.playButton.innerHTML = "&#x025B8;";
        this.muteButton.innerHTML = "&#9732;";


        this.canvas = new Flare.Canvas(this);


        this.setStyle(this.videoPlayer, this.videoPlayerStyle);
        this.setStyle(this.controlBar, this.controlBarStyle);
        this.setStyle(this.playButton, this.playButtonStyle);
        this.setStyle(this.progressBarContainer, this.progressBarContainerStyle);
        this.setStyle(this.leftControls, this.leftControlsStyle);
        this.setStyle(this.rightControls, this.rightControlsStyle);
        this.setStyle(this.progressBar, this.progressBarStyle);
        this.setStyle(this.progressBarDisplayGroup, this.progressBarDisplayGroupStyle);
        this.setStyle(this.playProgress, this.playProgressStyle);
        this.setStyle(this.timeDisplay, this.timeDisplayStyle);
        this.setStyle(this.volumeControl, this.volumeControlStyle);
        this.setStyle(this.muteButton, this.muteButtonStyle);
        this.setStyle(this.loadingBar, this.loadingBarStyle);

        this.setAttributes(this.progressBar, this.progressBarAttribtues);

        this.settingsButton.appendChild(this.settingsPath);
        this.videoPlayer.appendChild(this.canvas.getCanvas());
        this.controlBarInner.appendChild(this.leftControls);
        this.controlBarInner.appendChild(this.rightControls);
        this.volumeControl.appendChild(this.muteButton);
        this.leftControls.appendChild(this.playButton);
        this.leftControls.appendChild(this.volumeControl);
        this.leftControls.appendChild(this.timeDisplay);
        this.rightControls.appendChild(this.settingsButton);
        this.progressBarContainer.appendChild(this.progressBar);
        this.progressBar.appendChild(this.progressBarDisplayGroup);
        this.progressBarDisplayGroup.appendChild(this.playProgress);
        this.controlBar.appendChild(this.progressBarContainer);
        this.controlBar.appendChild(this.controlBarInner);

        //BIND HANDLERS
        this.progressBar.onmousedown = this.handleMouseDown.bind(this);
        this.progressBar.ondragstart = this.handleDragStart.bind(this);
        this.progressBar.ondrag = this.handleDrag.bind(this);
        this.progressBar.ondragend = this.handleDragEnd.bind(this);
        this.playButton.onclick = this.handlePlayButtonPress.bind(this);


        this.videoPlayer.appendChild(this.controlBar);
        this.videoPlayer.appendChild(this.loadingBar);
        if (!this.mediaPlayer.buffer.isLoaded) {
            this.toggleLockingButtons();
        }


        this.updatePlayProgress(0.4);



        var target;
        var parent = null; //this.mediaPlayer.parent;


        if (parent) {
            if (typeof parent === 'string') {
                target = document.getElementById(parent);
            } else if (typeof parent === 'object' && parent.nodeType === 1) {
                target = parent;
            }
        }

        // Fallback, covers an invalid ID and a non HTMLelement object
        if (!target) {

            target = document.body;
        }

        target.appendChild(this.videoPlayer);
    },



    update: function(frame, frameNumber) {

        this.canvas.render(frame);
        this.updatePlayProgress((frameNumber) / 150);
        //this.updateTimeDisplay();

    },

    setStyle: function(element, attributes) {

        for (var attribute in attributes) {
            element.style.setProperty(attribute, attributes[attribute]);
        }


    },

    setAttributes: function(element, attributes) {

        for (var attribute in attributes) {
            element.setAttribute(attribute, attributes[attribute]);
        }
    },



    updatePlayProgress: function(progress) {
        this.playProgress.style.setProperty("transform", "scaleX(" + progress + ")");
        this.progressBar.setAttribute("aria-valuenow", parseInt(progress * 100));
    },

    handleMouseDown: function(e) {
        console.log(e);
        var currentProgress = parseInt(this.progressBar.getAttribute('aria-valuenow'));
        this.mediaPlayer.isPlaying = false;

        return false;
    },

    handleDragStart: function(e) {

        console.log(e);

    },

    handleDrag: function(e) {

        //Make new indicator to show the drag location

        //First get position of cursor depending on location

        //Calculate percentage

        //Now set the valuenow to the % progress
        console.log(e);

    },

    handleDragEnd: function(e) {

        //if in play mode, continue playing from new location
        //buffer if neccessary

    },

    handlePlayButtonPress: function(e) {
        console.log("play clicked");
        this.mediaPlayer.togglePlay();

        if (this.mediaPlayer.isPlayMode()) {
            this.playButton.innerHTML = "||";
        } else {
            this.playButton.innerHTML = "&#x025B8;";
        }

    },

    updateTimeDisplay: function(elapsed, duration) {
        this.timeDisplay.innerHTML = elapsed + " / " + duration;    
    },

    removeLoadingBar: function(){
        this.videoPlayer.removeChild(this.loadingBar);
    },

    toggleLockingButtons: function() {
        if (this.buttonsLocked) {
            this.playButton.removeAttribute("disabled");
            this.muteButton.removeAttribute("disabled");
            this.volumeControl.removeAttribute("disabled");
            this.progressBar.removeAttribute("disabled");
            this.settingsButton.removeAttribute("disabled");

            this.buttonsLocked = false;
        } else { // lock buttons
            this.playButton.setAttribute("disabled", "disabled");
            this.muteButton.setAttribute("disabled", "disabled");
            this.volumeControl.setAttribute("disabled", "disabled");
            this.progressBar.setAttribute("disabled", "disabled");
            this.settingsButton.setAttribute("disabled", "disabled");
            this.buttonsLocked = true;
        }
    }





};

Flare.VideoPlayer.prototype.constructor = Flare.VideoPlayer;
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Flare.FlareMessage = function(){
    this.flareOpCode; //1 byte
    
    this.totalMessageLength; //int
    this.dataLength; // int
    
    this.headerLength = 5;
 
    return this;
};

Flare.FlareMessage.prototype = {
    
    addStringToBinary : function(dataView , offset, string){
        
        dataView.setUint8(offset , (string.length & 0xff));//Add The length of string
   
        for(var index = 0; index < string.length; index ++){
            dataView.setUint8(index + 1 + offset , string.charCodeAt(index));
        }
        
        
        
        
    }
  
    
};

Flare.Buffer.prototype.constructor = Flare.FlareMessage;



    



Flare.OpenVideoMessage = function () {

    Flare.FlareMessage.call(this);//Inherit from flaremessage

    this.flareOpCode = Flare.OpCode.OPEN_VIDEO;

    this.requestFile = "";

    return this;



};

Flare.OpenVideoMessage.prototype = Object.create(Flare.FlareMessage.prototype);
Flare.OpenVideoMessage.prototype.constructor = Flare.OpenVideoMessage;



Flare.OpenVideoMessage.prototype.setRequestFile = function (requestFile) {

    this.requestFile = requestFile;

};

Flare.OpenVideoMessage.prototype.toBinary = function () {

    this.dataLength = this.requestFile.length + 1;
    this.totalMessageLength = this.dataLength + this.headerLength;

    var data = new ArrayBuffer(this.totalMessageLength);
    var dataView = new DataView(data);





    dataView.setInt8(0, (this.flareOpCode & 0xff));//Set The Op Code
    dataView.setInt32(1, (this.totalMessageLength & 0xffffffff));//Set The Op Code

    this.addStringToBinary(dataView, this.headerLength, this.requestFile); // add the request string
    
    /*
    //For testing what the byte array looks like
    for(var test = 0; test < this.totalMessageLength; test++){
        console.log("byte Number :" + test + "  : "+ dataView.getUint8(test));
    }
    */


    return data;


};









Flare.OpCode = {
    //Put Constant values here

    OPEN_VIDEO : 0,
    FRAME : 1,
    AUDIO : 2



};

Flare.TaskTable = {};
Flare.TaskTable[Flare.OpCode.OPEN_VIDEO] = Flare.InitializeVideoTask;
Flare.TaskTable[Flare.OpCode.FRAME] = Flare.ProcessFrameTask;
Flare.TaskTable[Flare.OpCode.AUDIO] = Flare.ProcessAudioTask;

Flare.Icons = {
  settings : 
      "M863.24,382.771l-88.759-14.807c-6.451-26.374-15.857-51.585-28.107-75.099l56.821-70.452   c12.085-14.889,11.536-36.312-1.205-50.682l-35.301-39.729c-12.796-14.355-34.016-17.391-50.202-7.165l-75.906,47.716   c-33.386-23.326-71.204-40.551-112-50.546l-14.85-89.235c-3.116-18.895-19.467-32.759-38.661-32.759h-53.198   c-19.155,0-35.561,13.864-38.608,32.759l-14.931,89.263c-33.729,8.258-65.353,21.588-94.213,39.144l-72.188-51.518   c-15.558-11.115-36.927-9.377-50.504,4.171l-37.583,37.61c-13.548,13.577-15.286,34.946-4.142,50.504l51.638,72.326   c-17.391,28.642-30.584,60.086-38.841,93.515l-89.743,14.985C13.891,385.888,0,402.24,0,421.435v53.156   c0,19.193,13.891,35.547,32.757,38.663l89.743,14.985c6.781,27.508,16.625,53.784,29.709,78.147L95.647,676.44   c-12.044,14.875-11.538,36.312,1.203,50.669l35.274,39.73c12.797,14.382,34.028,17.363,50.216,7.163l77-48.37   c32.581,22.285,69.44,38.664,108.993,48.37l14.931,89.25c3.048,18.896,19.453,32.76,38.608,32.76h53.198   c19.194,0,35.545-13.863,38.661-32.759l14.875-89.25c33.308-8.147,64.531-21.245,93.134-38.5l75.196,53.705   c15.53,11.155,36.915,9.405,50.478-4.186l37.598-37.597c13.532-13.536,15.365-34.893,4.127-50.479l-53.536-75.059   c17.441-28.738,30.704-60.238,38.909-93.816l88.758-14.82c18.921-3.116,32.756-19.469,32.756-38.663v-53.156   C895.998,402.24,882.163,385.888,863.24,382.771z M449.42,616.013c-92.764,0-168-75.25-168-168c0-92.764,75.236-168,168-168   c92.748,0,167.998,75.236,167.998,168C617.418,540.763,542.168,616.013,449.42,616.013z"

   
    
};


Flare.NetworkManager = function (mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;
    this.socket;

    this.connected = false;

    this.callbacks = {};

    this.connect();
    this.setup();
    


    return this;



};

Flare.NetworkManager.prototype = {
    
    connect: function () {

        this.socket = new WebSocket('ws://localhost:6661');
        this.socket.binaryType = 'arraybuffer';
    },
    
    close: function () {

        this.socket.close();
    },
    
    setup: function () {

        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);

    },
    
    onOpen: function () {
        
        this.connected = true;
        console.log("connection Opened");
        //this.socket.send("hello");
        //this.requestVideo(this.mediaPlayer.options.videoPath);
        this.requestVideo();
        

    },
    
    onClose: function (message) {
        console.log("closed");
        console.log(message);
    },
    
    onMessage: function (message) {
        
        if (message.data instanceof ArrayBuffer ){
            
            
            //All incoming binary should be images
            //console.log(message);
            var dataView = new DataView(message.data);
            var opCode = dataView.getInt8(4);
            var dataLength = dataView.getUint32(0);
            //console.log("lenth " + dataLength);
            console.log("opCode " + opCode);
            
            
            var task = new Flare.TaskTable[opCode];
            task.setData(message.data);
            task.setMediaPlayer(this.mediaPlayer);
            task.process();
            
            
            
            /*
            var dataLength = dataView.getInt32(1);
            var videoIsAvailable = dataView.getInt8(5);
            console.log("opCode is " + opCode);
            console.log("data Length is " + dataLength);
            console.log("video is Available is " + videoIsAvailable);
            */
            
            /*
            var blob = new Blob([dataView], { type: 'image/bmp' });
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                var img = document.createElement('img');
                img.src =  reader.result;
                document.body.appendChild(img);
                
            }.bind(this);
            */
            
            
        }else if (typeof message.data === "string"){
            
            //Process as json

            var data = JSON.parse(message.data);
            console.log(data.test);
            
            
        }
        //var data = message.data;
        
    },
    
    onError: function (e) {
        console.log(e);
    },
    
    send: function (data) {

        this.socket.send(data);

    },
    
    getEndianness: function () {
        var a = new ArrayBuffer(4);
        var b = new Uint8Array(a);
        var c = new Uint32Array(a);
        b[0] = 0xa1;
        b[1] = 0xb2;
        b[2] = 0xc3;
        b[3] = 0xd4;
        if (c[0] === 0xd4c3b2a1) {
            return BlobReader.ENDIANNESS.LITTLE_ENDIAN;
        }
        if (c[0] === 0xa1b2c3d4) {
            return BlobReader.ENDIANNESS.BIG_ENDIAN;
        } else {
            throw new Error('Unrecognized endianness');
        }
    },
    
    requestVideo: function(){
        
        var videoRequest = new Flare.OpenVideoMessage();
        videoRequest.setRequestFile(this.mediaPlayer.options.videoID);
        
        
        //console.log(videoRequest.toBinary());
        this.socket.send(videoRequest.toBinary());
        
        
        
    }

};

Flare.NetworkManager.prototype.constructor = Flare.NetworkManager;

Flare.NETWORK_PROTOCOL_TABLE = {};

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Flare;
        }
        exports.Flare = Flare;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('Flare', (function() { return root.Flare = Flare; })() );
    } else {
        root.Flare = Flare;
    }

    return Flare;
    
}).call(this);

/**
 * Class to handle the internal clock time and do adjustments depending on how fast the browser handles the updates
 * @param {type} mediaPlayer
 * @returns {Flare.Clock}
 */
Flare.Clock = function (mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;
    
    this._timeInitialized = 0;
    
    this.elapsed = 0;
    
    this.elapsedMs = 0;
    
    this.previousTime = 0;

    this.currentTime = 0;
    
    this.timeUpdated = 0;
    
    this.lastTimeUpdated = 0;

    this.timeStarted = 0;

    this.timePaused = 0;

    this.time = 0;

    this.minutes = 0;
    
    return this;


};

Flare.Clock.prototype = {
    boot: function(){
        this._timeInitialized = Date.now();
        this.timeUpdated = Date.now();
    },
    
    
    refresh: function () {

        //  Set to the old Date.now value
        this.lastTimeUpdated = this.timeUpdated;

        // this.time always holds a Date.now value
        this.timeUpdated = Date.now();

        //  Adjust accordingly.
        this.elapsedMs = this.timeUpdated - this.lastTimeUpdated;

    },
    
    update: function(time) {
       
       
        this.lastTimeUpdated = this.timeUpdated;

        // this.time always holds a Date.now value
        this.timeUpdated = Date.now();

        this.elapsedMS = this.timeUpdated - this.lastTimeUpdated;

        this.previousTime = this.currentTime;
        
        this.currentTime = time;

        this.elapsed = this.currentTime - this.previousTime;
        
    },

    totalTimePlayed: function(startTime, pauseTime) {
        if(startTime === 0){    //video has not started playing yet
            return 0;
        }
        this.time = ((Date.now() - startTime) - pauseTime) / 1000;
        var seconds = Math.floor(this.time * 1) / 1;
        if(seconds > 59){
            console.log(seconds); 
            this.minutes++;
            this.time = 0;
            seconds = 0;
            this.mediaPlayer.setStartTime(Date.now()); 
        }
        if(seconds < 10){
            return this.minutes + ":0" + seconds;
        }
        return this.minutes + ":" + seconds;
    },

    getPauseTime: function() {
        return this.timePaused;
    },

    setPauseTime: function(time) {
        this.timePaused = time;
    }
  
};

Flare.Clock.prototype.constructor = Flare.Clock;


//This thing handles making the browser do loops
Flare.Oscillator = function (mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;

    this.running = false;

    this._loopFunction = null;
    
    this._eventId = null;
    
    this.fps = 30; // Testing for now
    
    this.updateSpeed = 0;
    
    this.usingSetTimeOut = false;
    this.usingRequestAnimationFrame = false;
    
    return this;


};

Flare.Oscillator.prototype = {
    
    run: function(){
        
        this.running = true;
        var _this = this;
        this.updateSpeed = Math.floor(1000/this.fps);
        
        //if window.requestAnimationFrame is not available, use setTimeout
        if (!window.requestAnimationFrame){
            
            this.usingSetTimeOut = true;

            this._loopFunction = function () {
                return _this.updateSetTimeout();
            };
            
            this._eventId = window.setTimeout(this._loopFunction, 0);

           
            
        }else{
            
            this.usingRequestAnimationFrame = true;

            this._loopFunction = function (time) {
                return _this.updateRequestAnimationFrame(time);
            };
            
            this._eventId =  window.requestAnimationFrame(this._loopFunction);

 
        }
        
    },
    
    stop: function(){
        
        if(this.usingSetTimeOut){
            
            clearTimeout(this._eventId);
            
        }else{
            
            window.cancelAnimationFrame(this._eventId);
        }
        
        this.running = false;
        
    },
    
    updateRequestAnimationFrame: function(time){
        
        this.mediaPlayer.update(Math.floor(time));

        this._eventId = window.requestAnimationFrame(this._loopFunction);
        
    },
    
    updateSetTimeout: function(){
        
        this.mediaPlayer.update(Date.now());
        
        this._eventId = window.setTimeout(this._loopFunction, this.updateSpeed);
        
    }
    
};

Flare.Oscillator.prototype.constructor = Flare.Oscillator;
Flare.Device = function() {


    /**
     * The time the device became ready.
     * @property {integer} deviceReadyAt
     * @protected
     */
    this.deviceReadyAt = 0;

    /**
     * The time as which initialization has completed.
     * @property {boolean} initialized
     * @protected
     */
    this.initialized = false;
    /* Make a handler to get DOM info so we can tell if the video is in the view port and stuff like that */
    this.isCompatible = false;
    //  Features
    this.hasGeneralInputTypes = false;
    this.hasCanvas = false;
    this.hasWebGL = false;
    this.hasFile = false;
    this.hasLocalStorage = false;
    //this.hasCss3D = false;
    this.hasTypedArray = false;
    //  Input
    this.hasTouch = false;
    //  Audio
    this.hasWebAudio = false;
    // Device features
    this.fullscreen = false;
    this.webSocket = false;
};


//Make Singleton
Flare.Device = new Flare.Device();


Flare.Device._initialize = function() {

    function supportsCanvas() {
        var c = document.createElement('canvas');
        return !!c.getContext;
    }

    function supportsWebAudio() {
        var hasWebKitAudio = 'webkitAudioContext' in window;
        var hasAudioContext = 'AudioContext' in window;

        if (!(hasWebKitAudio || hasAudioContext)) {
            var audioElement = document.createElement('audio');
            return audioElement.canPlayType;
        }
        return true;
    }

    function supportsWebGL() {
        try {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        } catch (e) {
            return false;
        }
        return !!ctx;
    }

    function supportsHTML5Storage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    function supportsCss3D() {
        if (!!window.getComputedStyle) { //  The browser does not support getComputedStyle
            return false;
        }
        var element = document.createElement('p'); //Creating a random element
        var transforms = {
            'webkitTransform': '-webkit-transform',
            'OTransform': '-o-transform',
            'msTransform': '-ms-transform',
            'MozTransform': '-moz-transform',
            'transform': 'transform'
        };
        document.body.insertBefore(element, null);
        for (var t in transforms) {
            if (!!element[t]) {
                el.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }
        document.body.removeChild(element);
        return !!has3d && has3d.length > 0 && has3d !== "none";
    }

    function isTouch() {
        return ('ontouchstart' in window) && (window.navigator.MaxTouchPoints > 0);
    }

    function supportsInput(type) {
        try {
            var input = document.createElement('input');
            input.setAttribute("type", type);
        } catch (e) {
            return false;
        }
        return input.type !== "text";
    }

    function supportsFullscreen() {
        var documentEl = document.documentElement;
        return ((!!documentEl.requestFullscreen) || !!documentEl.mozRequestFullScreen || !!documentEl.webkitRequestFullScreen || !!documentEl.msRequestFullscreen);
    }

    function supportsWebSocket() {
        try {
            return 'WebSocket' in window && window.WebSocket.CLOSING === 2;
        } catch (e) {
            return false;
        }
    }

    /** Variable initialization     */

    this.hasCanvas = supportsCanvas();
    this.hasWebGL = supportsWebGL();
    this.hasFile = supportsInput("file");
    this.hasLocalStorage = supportsHTML5Storage();
    //this.hasCss3D = supportsCss3D();
    this.hasTypedArray = 'ArrayBuffer' in window;
    //  Input
    this.hasTouch = isTouch();
    //  Audio
    this.hasWebAudio = supportsWebAudio();
    // Device features
    this.webSocket = supportsWebSocket();
    this.fullscreen = supportsFullscreen();
    var range = supportsInput("range");
    this.hasGeneralInputTypes = range; // Can do hasFile too
    this.isCompatible = this.hasCanvas && this.hasGeneralInputTypes
        && this.webSocket && this.hasWebAudio;
};

Flare.Device.whenReady = function(callback, context) {

    var readyCheck = this._readyCheck;

    if (this.deviceReadyAt || !readyCheck) {

        //Device is already done loading
        callback.call(context, this);

    } else if (readyCheck._monitor) {

        readyCheck._queue = readyCheck._queue || [];
        readyCheck._queue.push([callback, context]);

    } else {

        readyCheck._monitor = readyCheck.bind(this);
        readyCheck._queue = readyCheck._queue || [];
        readyCheck._queue.push([callback, context]);


        if (document.readyState === 'complete' || document.readyState === 'interactive') {

            window.setTimeout(readyCheck._monitor, 0);

        } else {
            document.addEventListener('DOMContentLoaded', readyCheck._monitor, false);
            window.addEventListener('load', readyCheck._monitor, false);
        }
    }
};

Flare.Device._readyCheck = function() {

    var readyCheck = this._readyCheck;

    if (!document.body) {

        window.setTimeout(readyCheck._monitor, 20);

    } else if (!this.deviceReadyAt) {

        this.deviceReadyAt = Date.now();

        document.removeEventListener('deviceready', readyCheck._monitor);
        document.removeEventListener('DOMContentLoaded', readyCheck._monitor);
        window.removeEventListener('load', readyCheck._monitor);

        this._initialize();
        this.initialized = true;


        var item;
        while ((item = readyCheck._queue.shift())) {
            var callback = item[0];
            var context = item[1];
            callback.call(context, this);
        }

        this._readyCheck = null;
        this._initialize = null;
        this.onInitialized = null;
    }
};

//Going to need this so that we can have multiple listeners for multiple videos or multiple protocool callbacks and stuff
Flare.EventDispatcher = function () {




};

Flare.EventDispatcher.prototype = {
    
};

Flare.EventDispatcher.prototype.constructor = Flare.EventDispatcher;