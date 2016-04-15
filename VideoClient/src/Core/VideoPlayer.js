
Flare.VideoPlayer= function (mediaPlayer) {


    /**
    * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
    */
    this.mediaPlayer = mediaPlayer;
    this.canvas = null;
    this.videoWidth;
    this.videoHeight;
    this.videoPlayer;
    this.controlBar;
    this.progressBar;
    this.playButton;
    this.controlBarInner;
    this.leftControls;
    this.rightControls;
    this.settingsButton;
    this.settingsPath;
    
    this.rightControlsAttributes = {
        float : 'right',
        height: '100%'
    };
    
    
    
    this.leftControlsAttributes = {
        float : 'left',
        height : '100%'
    };
    
    this.videoPlayerAttributes = {
      position: 'relative',
      overflow: 'hidden',
      width: '960px',
      height: '540px'
      
    };
    
    this.controlBarInnerAttributes = {
        
    };
    
    this.controlBarAttributes = {
        height: '30px',
        position: 'absolute',
        bottom: '0',
        left: 0 ,
        right: 0 ,
        'background-color': 'rgba(0,0,0,0.5)'
    };
    
    this.playButtonAttributes = {
        color: 'white',
        'font-size': '20px',
        background : 'transparent',
        border : 'none',
        cursor: 'pointer'
        
    };
    
    this.progressBarAttributes = {
        width : '100%',
        position : 'absolute',
        height : '5px',
        bottom: '30px',
        cursor : 'pointer',
        'background-color': 'rgba(255,255,255,0.6)'
        
        
    };
    
    return this;
    
    
    
};

Flare.VideoPlayer.prototype = {
    
    boot: function(){
        
        this.videoPlayer = document.createElement("div");
        this.controlBar = document.createElement("div");
        this.progressBar = document.createElement("div");
        this.leftControls = document.createElement("div");
        this.rightControls = document.createElement("div");
        this.controlBarInner = document.createElement("div");
        this.playButton = document.createElement("button");
        this.settingsButton = document.createElement("svg");
        this.settingsPath = document.createElementNS('http://www.w3.org/2000/svg',"path"); 
        
        
        this.settingsPath.setAttributeNS(null, "d", Flare.Icons.settings);
        this.videoPlayer.id = "videoId";
        
        this.playButton.innerHTML = "&#x025B8;";
        

        this.canvas = new Flare.Canvas(this);
        

        this.setStyle(this.videoPlayer, this.videoPlayerAttributes);
        this.setStyle(this.controlBar, this.controlBarAttributes);
        this.setStyle(this.playButton, this.playButtonAttributes);
        this.setStyle(this.progressBar, this.progressBarAttributes);
        this.setStyle(this.leftControls, this.leftControlsAttributes);
        this.setStyle(this.rightControls, this.rightContolsAttributes)
        
        this.settingsButton.appendChild(this.settingsPath);
        this.videoPlayer.appendChild(this.canvas.getCanvas()); 
        this.controlBarInner.appendChild(this.leftControls);
        this.controlBarInner.appendChild(this.rightControls);
        this.leftControls.appendChild(this.playButton);
        this.rightControls.appendChild(this.settingsButton);
        this.controlBar.appendChild(this.progressBar);
        this.controlBar.appendChild(this.controlBarInner);
        
        
        
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
    
    setStyle : function(element, attributes){
        
        for (var attribute in attributes){
            element.style.setProperty(attribute, attributes[attribute]);
        }
        

    }
    
    
    

};

Flare.VideoPlayer.prototype.constructor = Flare.VideoPlayer;