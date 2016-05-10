
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
    //console.log("frame " +index + "loaded");
  
 

           
    this.mediaPlayer.buffer.setFrameAt(index, img);
 
    


    
    
    
};

Flare.ProcessFrameTask.prototype.constructor = Flare.ProcessFrameTask;