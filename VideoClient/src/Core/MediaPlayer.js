Flare.MediaPlayer = function (userOptions) {

    /**
     * @property {number} id - video player id, for handling multiple MediaPlayer Objects
     * @readonly
     */
    this.id = Flare.PLAYERS.push(this) - 1;
    
    
    this.options = {
        
        container : '',
        videoPath: '',
        videoSize : Flare.CONSTANTS.VIDEO_SIZE.ORIGINAL,
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
    
    this.buffer = null;
    
    this.isPlaying = false;
    
    this.testCounter = 0;
    
    
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
    
    parseOptions: function(userOptions){
        //REMEMBER TO SANITIZE USER INPUT
        if (typeof userOptions.videoPath != 'undefined'){
            
            this.options.videoPath = userOptions.videoPath;
            
        }else{
            console.log("location is not set");
        }
        
    },
    
    boot: function () {

        if (this.isBooted)
        {
            return;
        }

        this._forceUpdate = true;

        //Initialize System
        this.oscillator = new Flare.Oscillator(this);
        this.clock = new Flare.Clock(this);
        this.buffer = new Flare.Buffer(this);
        this._networkManager = new Flare.NetworkManager(this);
        //this._networkManager.requestVideo(this.options.videoPath);
        
        
        
        this.videoPlayer = new Flare.VideoPlayer(this);
        
        //this.canvas = new Flare.Canvas(this);
        //this.canvas.addToDOM();


        //FOR TESTING ONLY
        this.frames = [152];
        var fileNum;
        for(var f = 0 ; f< 152; f++){
            this.frames[f] = new Image(960,540);
            if(f  < 10 ) {
                fileNum = "00" + f;
            }else if (f < 100){
                fileNum = "0" + f;
            }else{
                fileNum = f;
            }
            this.frames[f].src = './testVideo/frame' + fileNum + '.jpg';
        }
        //END TESTING
        
        this.videoPlayer.boot();
        //Okay now start the oscillator
        this.clock.boot();
        this.oscillator.run();
       
        
        

    },
    
    
    //This should probably go in videoEngine
    update: function (time) {
        this.clock.update(time);
        
        
            
        

        //Finished with update, render the frame:
        //TESTING ONLY
        
  
        //this.canvas.render(this.frames[this.testCounter%152]);
        this.videoPlayer.update(this.frames[this.testCounter] , this.testCounter);
       
     
        
        
        this.testCounter = (this.testCounter + 1) %151;
        //Timing is completely messed up. Need to figure out core video engine code
    }
    
  
};

Flare.MediaPlayer.prototype.constructor = Flare.MediaPlayer;