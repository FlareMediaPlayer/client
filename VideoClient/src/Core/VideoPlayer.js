
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
    this.progressBarContainer;
    this.playButton;
    this.controlBarInner;
    this.leftControls;
    this.rightControls;
    this.settingsButton;
    this.settingsPath;
    this.progressBar;
    this.progressBarDisplayGroup;
    this.playProgress;
    
    this.playProgressStyle = {
        position: 'absolute',
        bottom : 0,
        left: '0px',
        'background-color':'rgba(0,0,255,0.7)',
        height : '100%',
        width : '100%',
        'transform-origin' : '0 0 '
        
    };
    
    this.progressBarDisplayGroupStyle = {
        height: '100%',
        //transform: 'scaleY(0.5)',
        transition: 'transform .1s cubic-bezier(0.4,0.0,1,1)',
        'background-color': 'rgba(255,255,255,0.6)',
        'transform-origin' : 'bottom'
        
        
    };
    
    this.progressBarStyle={
        position : 'absolute',
        bottom : 0,
        left : 0,
        width : '100%',
        height : '100%',
        'touch-action' : 'none'
        
    };
    
    this.progressBarAttribtues = {
        role: 'slider',
        draggable: 'true',
        'aria-valuemin' : 0,
        'aria-valuemax' : 100,
        'aria-valuenow' : 0,
        //'tabindex' : 0
        
    };
    
    this.rightControlsStyle = {
        float : 'right',
        height: '100%'
    };
    
    
    
    this.leftControlsStyle = {
        float : 'left',
        height : '100%'
    };
    
    this.videoPlayerStyle = {
      position: 'relative',
      overflow: 'hidden',
      width: '960px',
      height: '540px'
      
    };
    
    this.controlBarInnerStyle = {
        
    };
    
    this.controlBarStyle = {
        height: '30px',
        position: 'absolute',
        bottom: '0',
        left: 0 ,
        right: 0 ,
        'background-color': 'rgba(0,0,0,0.5)'
    };
    
    this.playButtonStyle = {
        color: 'white',
        'font-size': '20px',
        background : 'transparent',
        border : 'none',
        cursor: 'pointer'
        
    };
    
    this.progressBarContainerStyle = {
        width : '100%',
        position : 'absolute',
        height : '5px',
        bottom: '30px',
        cursor : 'pointer',
        
        
        
    };
    
    return this;
    
    
    
};

Flare.VideoPlayer.prototype = {
    
    boot: function(){
        
        this.videoPlayer = document.createElement("div");
        this.controlBar = document.createElement("div");
        this.progressBarContainer = document.createElement("div");
        this.leftControls = document.createElement("div");
        this.rightControls = document.createElement("div");
        this.controlBarInner = document.createElement("div");
        this.playButton = document.createElement("button");
        this.progressBar = document.createElement("div");
        this.progressBarDisplayGroup = document.createElement("div");
        this.controlBarInner = document.createElement("div");
        this.playProgress = document.createElement("div");
        this.settingsButton = document.createElement("svg");
        this.settingsPath = document.createElementNS('http://www.w3.org/2000/svg',"path"); 
        
        
        this.settingsPath.setAttributeNS(null, "d", Flare.Icons.settings);
        this.videoPlayer.id = "videoId";
        
        this.playButton.innerHTML = "&#x025B8;";
        

        this.canvas = new Flare.Canvas(this);
        

        this.setStyle(this.videoPlayer, this.videoPlayerStyle);
        this.setStyle(this.controlBar, this.controlBarStyle);
        this.setStyle(this.playButton, this.playButtonStyle);
        this.setStyle(this.progressBarContainer, this.progressBarContainerStyle);
        this.setStyle(this.leftControls, this.leftControlsStyle);
        this.setStyle(this.rightControls, this.rightControlsStyle);
        this.setStyle(this.progressBar, this.progressBarStyle);
        this.setStyle(this.progressBarDisplayGroup, this.progressBarDisplayGroupStyle);
        this.setStyle(this.playProgress, this.playProgressStyle);
        
        this.setAttributes(this.progressBar, this.progressBarAttribtues);
        
        this.settingsButton.appendChild(this.settingsPath);
        this.videoPlayer.appendChild(this.canvas.getCanvas()); 
        this.controlBarInner.appendChild(this.leftControls);
        this.controlBarInner.appendChild(this.rightControls);
        this.leftControls.appendChild(this.playButton);
        this.rightControls.appendChild(this.settingsButton);
        this.progressBarContainer.appendChild(this.progressBar);
        this.progressBar.appendChild(this.progressBarDisplayGroup);
        this.progressBarDisplayGroup.appendChild(this.playProgress);
        this.controlBar.appendChild(this.progressBarContainer);
        this.controlBar.appendChild(this.controlBarInner);
        
        //BIND HANDLERS
        this.progressBar.onmousedown = this.handleMouseDown.bind(this);
        this.progressBar.ondragstart = this.handleDragStart.bind(this);
        this.progressBar.ondrag = this.handleDrag.bind(this);
        this.progressBar.ondragend = this.handleDragEnd.bind(this);
        this.playButton.onclick = this.handlePlayButtonPress.bind(this);
        
        this.videoPlayer.appendChild(this.controlBar);
        
        this.updatePlayProgress(0.4);
        
        
        
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
    

    
    update: function(frame , frameNumber){
    
        this.canvas.render(frame);
        this.updatePlayProgress((frameNumber)/150)
        
    },
    
    setStyle : function(element, attributes){
        
        for (var attribute in attributes){
            element.style.setProperty(attribute, attributes[attribute]);
        }
        

    },
    
    setAttributes: function(element, attributes){
        
        for (var attribute in attributes){
            element.setAttribute(attribute, attributes[attribute]);
        }
    },
    
    
    
    updatePlayProgress: function (progress){
        this.playProgress.style.setProperty("transform", "scaleX(" + progress + ")");
        this.progressBar.setAttribute("aria-valuenow" , parseInt(progress*100));
    },
    
    handleMouseDown:function (e){
        var currentProgress = parseInt(this.progressBar.getAttribute('aria-valuenow'));
        this.mediaPlayer.isPlaying = false;
        
        return false;
    },
    
    handleDragStart: function(e){
        
        console.log("currentProgress" + currentProgress);
        
    },
    
    handleDrag: function(e){
        
        //Continuously calculate position and update
        
    },
    
    handleDragEnd: function(e){
        
    },
    
    handlePlayButtonPress: function(e){
        console.log("play clicked");
        this.mediaPlayer.togglePlay();
        
        if(this.mediaPlayer.isPlayMode()){
            this.playButton.innerHTML = "||";
        }else{
            this.playButton.innerHTML = "&#x025B8;";
        }
        
    }
    
    
    

};

Flare.VideoPlayer.prototype.constructor = Flare.VideoPlayer;