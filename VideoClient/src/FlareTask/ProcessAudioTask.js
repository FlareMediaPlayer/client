
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