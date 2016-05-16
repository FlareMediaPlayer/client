
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