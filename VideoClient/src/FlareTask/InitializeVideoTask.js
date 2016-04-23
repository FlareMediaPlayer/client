
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
    
};

Flare.InitializeVideoTask.prototype.setMediaPlayer = function(mediaPlayer) {

    this.mediaPlayer = mediaPlayer
    
};


Flare.InitializeVideoTask.prototype.process = function() {

    var dataLength = this.dataView.getInt32(1);
    var videoIsAvailable = this.dataView.getInt8(5);
    console.log("the video you requested is " + this.mediaPlayer.options.videoPath);
    //console.log(videoIsAvailable);
    
    if(videoIsAvailable === 1){
       this.videoIsAvailable = true; 
       console.log("video is available!");
    }else{
        console.log("video is not available!");
    }

    
    
    
};

Flare.InitializeVideoTask.prototype.constructor = Flare.InitializeVideoTask;