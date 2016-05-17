Flare.MediaPlayer = function(userOptions) {

    /**
     * @property {number} id - video player id, for handling multiple MediaPlayer Objects
     * @readonly
     */
    this.id = Flare.PLAYERS.push(this) - 1;


    this.options = {
        port : 6661,
        uri : 'localhost',
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
    this.deltaTime;
    this.timePaused = 0;
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

    parseOptions: function(userOptions) {
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

    setStartTime: function(time) {
        this.timeStarted = time;
    },

    setPauseTime: function(time) {
        this.timePaused = time;
    },
    
    togglePlay: function() {

        if (this.isPlaying) {
            this.isPlaying = false;
            this.clock.setPauseTime(Date.now());
            this.timePaused = Date.now();
            this.audioEngine.stopSound();
        } else {
            this.isPlaying = true;
            
            
            if(this.timePaused === 0){
                this.setStartTime(Date.now());
            }else{
                this.setStartTime(Date.now()-this.deltaTime);
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
    
    reset: function(){
        //reset all counters
        this.timePaused = 0;
        this.timeStarted = 0;
        this.deltaTime = 0;
    },

    isPlayMode: function() {
        return this.isPlaying;
    },

    getNumPressedPlay: function() {
        return this.numPressedPlay;
    },
    
    finishPlayback: function(){
        this.isPlaying = false;
        this.audioEngine.stopSound();
        this.reset();
        
    }


};

Flare.MediaPlayer.prototype.constructor = Flare.MediaPlayer;