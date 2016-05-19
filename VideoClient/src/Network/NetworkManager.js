/**
 * class for handling audio engine
 * @author Brian Parra
 * @memberOf Flare
 * @class Flare.NetworkManager
 * @constructor
 * @param {Flare.MediaPlayer} mediaPlayer a reference to the mediaPlayer
 * @return {Flare.NetworkManager} returns a Flare AudioEngine
 */
Flare.NetworkManager = function (mediaPlayer) {


    /**
     * @property {Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;

    /**
     * @property {object} socket the websocket connection
     */
    this.socket;

    /**
     * @property {boolean} is the connection opened
     */
    this.connected = false;




    this.connect();
    this.setup();



    return this;



};

Flare.NetworkManager.prototype = {
    /**
     * This function connects the websocket
     * @memberof Flare.NetworkManager.prototype
     * @function connect
     */
    connect: function () {
        var connectionUrl = 'ws://' + this.mediaPlayer.options.uri + ':' + this.mediaPlayer.options.port;
        this.socket = new WebSocket(connectionUrl);
        this.socket.binaryType = 'arraybuffer';
    },
    /**
     * Closes the connection
     * @memberof Flare.NetworkManager.prototype
     * @function close
     */
    close: function () {

        this.socket.close();
    },
    /**
     * Binds all handlers to websocket
     * @memberof Flare.NetworkManager.prototype
     * @function setup
     */
    setup: function () {

        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onclose = this.onClose.bind(this);
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onerror = this.onError.bind(this);

    },
    /**
     * Onopen event handler
     * @memberof Flare.NetworkManager.prototype
     * @function onOpen
     */
    onOpen: function () {

        this.connected = true;
        console.log("connection Opened");
        //this.socket.send("hello");
        //this.requestVideo(this.mediaPlayer.options.videoPath);
        this.requestVideo();


    },
    /**
     * Close event handler
     * @memberof Flare.NetworkManager.prototype
     * @function onCloser
     */
    onClose: function (message) {
        console.log("closed");
        console.log(message);
    },
    /**
     * OnMessage event handler, process incoming data here
     * @memberof Flare.NetworkManager.prototype
     * @function onMessage
     */
    onMessage: function (message) {

        if (message.data instanceof ArrayBuffer) {


            //All incoming binary should be images
            //console.log(message);
            var dataView = new DataView(message.data);
            var opCode = dataView.getInt8(4);
            var dataLength = dataView.getUint32(0);
            //console.log("lenth " + dataLength);
            //console.log("opCode " + opCode);


            var task = new Flare.TaskTable[opCode];
            task.setData(message.data);
            task.setMediaPlayer(this.mediaPlayer);
            task.process();


        } else if (typeof message.data === "string") {

            //Process as json

            var data = JSON.parse(message.data);
            console.log(data.test);


        }
        //var data = message.data;

    },
    /**
     * Handler websocket errors here
     * @memberof Flare.NetworkManager.prototype
     * @function onError
     */
    onError: function (e) {
        console.log(e);
    },
    /**
     * Sends data
     * @memberof Flare.NetworkManager.prototype
     * @function send
     * @param {object} data binary data to send
     */
    send: function (data) {

        this.socket.send(data);

    },
    /**
     * Once the connection is opened, this function requests a video
     * @memberof Flare.NetworkManager.prototype
     * @function requestVideo
     */
    requestVideo: function () {

        var videoRequest = new Flare.OpenVideoMessage();
        videoRequest.setRequestFile(this.mediaPlayer.options.videoID);


        //console.log(videoRequest.toBinary());
        this.socket.send(videoRequest.toBinary());


    }

};

Flare.NetworkManager.prototype.constructor = Flare.NetworkManager;