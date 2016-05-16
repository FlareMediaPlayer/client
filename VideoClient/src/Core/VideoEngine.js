
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