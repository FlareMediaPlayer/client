
Flare.NetworkManager = function (videoPlayer) {


    /**
     * @property Flare.VideoPlayer} videoPlayer - A reference to the videoPlayer.
     */
    this.videoPlayer = videoPlayer;
    this.socket;
    
    this.connected = false;
    
    this.callbacks = {};
    
    this.connect();
    this.setup();
    
    
    return this;



};

Flare.NetworkManager.prototype = {
    
    connect: function(){
        
        this.socket = new WebSocket('ws://localhost:6661');
    },
    
    close: function(){
        
        this.socket.close();
    },
    
    setup: function () {

        this.socket.onopen = this.onOpen;
        this.socket.onclose = this.onClose;
        this.socket.onmessage = this.onMessage;
        this.socket.onerror = this.onError;

        
    },
    
    onOpen: function(){
        
        console.log("connection Opened");

    },
    
    onClose: function(){
        console.log("closed");
    },
    
    onMessage: function(message){
        console.log(message);
    },
    
    onError: function(e){
        console.log(e);
    },
    
    send:function(data){
        
        this.socket.send(data);
        
    }
    
};

Flare.NetworkManager.prototype.constructor = Flare.NetworkManager;