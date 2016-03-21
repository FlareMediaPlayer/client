
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

        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);

        
    },
    
    onOpen: function(){
        
        console.log("connection Opened");
        this.socket.send("hello");

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