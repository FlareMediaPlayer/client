
Flare.NetworkManager = function (mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;
    this.socket;

    this.connected = false;

    this.callbacks = {};

    this.connect();
    this.setup();
    


    return this;



};

Flare.NetworkManager.prototype = {
    
    connect: function () {

        this.socket = new WebSocket('ws://localhost:6661');
        this.socket.binaryType = 'arraybuffer';
    },
    
    close: function () {

        this.socket.close();
    },
    
    setup: function () {

        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);

    },
    
    onOpen: function () {
        
        this.connected = true;
        console.log("connection Opened");
        //this.socket.send("hello");
        //this.requestVideo(this.mediaPlayer.options.videoPath);
        this.requestVideo();
        

    },
    
    onClose: function (message) {
        console.log("closed");
        console.log(message);
    },
    
    onMessage: function (message) {
        
        if (message.data instanceof ArrayBuffer ){
            
            //All incoming binary should be images
            //console.log(message);
            var dataView = new DataView(message.data);
            var opCode = dataView.getInt8(0);
            
            var task = new Flare.TaskTable[opCode];
            task.setData(message.data);
            task.setMediaPlayer(this.mediaPlayer);
            task.process();
            
            
            /*
            var dataLength = dataView.getInt32(1);
            var videoIsAvailable = dataView.getInt8(5);
            console.log("opCode is " + opCode);
            console.log("data Length is " + dataLength);
            console.log("video is Available is " + videoIsAvailable);
            */
            
            /*
            var blob = new Blob([dataView], { type: 'image/bmp' });
            var reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = function () {
                var img = document.createElement('img');
                img.src =  reader.result;
                document.body.appendChild(img);
                
            }.bind(this);
            */
            
            
        }else if (typeof message.data === "string"){
            
            //Process as json

            var data = JSON.parse(message.data);
            console.log(data.test);
            
            
        }
        //var data = message.data;
        
    },
    
    onError: function (e) {
        console.log(e);
    },
    
    send: function (data) {

        this.socket.send(data);

    },
    
    getEndianness: function () {
        var a = new ArrayBuffer(4);
        var b = new Uint8Array(a);
        var c = new Uint32Array(a);
        b[0] = 0xa1;
        b[1] = 0xb2;
        b[2] = 0xc3;
        b[3] = 0xd4;
        if (c[0] === 0xd4c3b2a1) {
            return BlobReader.ENDIANNESS.LITTLE_ENDIAN;
        }
        if (c[0] === 0xa1b2c3d4) {
            return BlobReader.ENDIANNESS.BIG_ENDIAN;
        } else {
            throw new Error('Unrecognized endianness');
        }
    },
    
    requestVideo: function(){
        
        var videoRequest = new Flare.OpenVideoMessage();
        videoRequest.setRequestFile(this.mediaPlayer.options.videoPath);
        //console.log(videoRequest);
        
        //console.log(videoRequest.toBinary());
        this.socket.send(videoRequest.toBinary());
        
        /*
        var request = {
            opCode: Flare.CONSTANTS.NETWORK.REQUEST_VIDEO,
            path : videoPath
        };
        
        //console.log(JSON.stringify(request));
        */
        this.socket.send("hello");
        
        
    }

};

Flare.NetworkManager.prototype.constructor = Flare.NetworkManager;