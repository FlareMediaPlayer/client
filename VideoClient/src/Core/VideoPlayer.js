
Flare.VideoPlayer= function (mediaPlayer) {


    /**
    * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
    */
    this.mediaPlayer = mediaPlayer;
    this.canvas = null;
    this.videoWidth;
    this.videoHeight;
    this.videoPlayer = null;
    this.controlBar = null;
    
    this.videoPlayerAttributes = {
      position: 'relative',
      overflow: 'hidden',
      width: '960px',
      height: '540px'
      
    };
    
    this.controlBarAttributes = {
        height: '30px',
        position: 'absolute',
        bottom: '0',
        left: 0 ,
        right: 0 ,
        'background-color': 'rgba(0,0,0,0.5)'
    };
    
    return this;
    
    
    
};

Flare.VideoPlayer.prototype = {
    
    boot: function(){
        
        this.videoPlayer = document.createElement("div");
        this.videoPlayer.id = "videoId";


        this.canvas = new Flare.Canvas(this);
        this.videoPlayer.appendChild(this.canvas.getCanvas());
        
        this.controlBar = document.createElement("div");


        this.setAttributes(this.videoPlayer, this.videoPlayerAttributes);
        this.setAttributes(this.controlBar, this.controlBarAttributes);
        this.videoPlayer.appendChild(this.controlBar);
        
        
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
        
    },
    
    setAttributes : function(element, attributes){
        
        for (var attribute in attributes){
            element.style.setProperty(attribute, attributes[attribute]);
        }
        

    }
    
    
    

};

Flare.VideoPlayer.prototype.constructor = Flare.VideoPlayer;