
Flare.VideoPlayer= function (mediaPlayer) {


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

Flare.VideoPlayer.prototype = {
    
    boot: function(){
        
        this.videoPlayer = document.createElement("div");
        this.videoPlayer.id = "videoId";
        this.videoPlayer.style.height = '540px';
        this.videoPlayer.style.width = '960px';
        
        this.canvas = new Flare.Canvas(this);
        
        this.videoPlayer.appendChild(this.canvas.getCanvas());
        
        
        
        var target;
        var parent = null;//this.mediaPlayer.parent;

        
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
    

    
    update: function(frame){
    
        this.canvas.render(frame);
        
    }
    
    
    

};

Flare.VideoPlayer.prototype.constructor = Flare.VideoPlayer;