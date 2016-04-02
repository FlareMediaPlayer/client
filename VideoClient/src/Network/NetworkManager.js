
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

        console.log("connection Opened");
        this.socket.send("hello");

    },
    onClose: function () {
        console.log("closed");
    },
    onMessage: function (message) {
        
        if (message.data instanceof ArrayBuffer ){
            
            //All incoming binary should be images
            console.log(message);
            
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
    }

};

Flare.NetworkManager.prototype.constructor = Flare.NetworkManager;