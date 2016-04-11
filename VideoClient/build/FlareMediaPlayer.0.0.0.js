
(function(){

    var root = this;

/**
 * @namespace Flare
 */
var Flare = Flare || {
    /**
     * The Version Number
     * @constant
     * @type {string}
     */
    VERSION: '0.0.0',
    
    /**
     * An array of video player instances. This way we can add multiple video players without having 
     * to worry about it later.
     * @constant
     * @type {array}
     */
    PLAYERS: []
    
};


Flare.CONSTANTS = {
    //Put Constant values here
    VIDEO_SIZE:{
        ORIGINAL: 0,
        FIXED: 1,
        RESPONSIVE: 2
    },
    
    VIDEO_SCALE_MODE : {
        MAINTAIN_ASPECT: 0,
        FILL: 1
    },
    
    FLARE_MESSAGE_HEADER_LENGTH: 5,
    



};


Flare.InitializeVideoTask= function () {


    /**
    * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
    */
   
    this.data;
    this.dataView;
    this.flareOpCode;
    this.mediaPlayer;
    

    return this;
    
    
    
    
};

Flare.InitializeVideoTask.prototype.setData = function(data) {

    this.data = data;
    this.dataView = new DataView(this.data);
    this.flareOpCode = Flare.OpCode.OPEN_VIDEO;
    this.videoIsAvailable = false;
    
};

Flare.InitializeVideoTask.prototype.setMediaPlayer = function(mediaPlayer) {

    this.mediaPlayer = mediaPlayer
    
};


Flare.InitializeVideoTask.prototype.process = function() {

    var dataLength = this.dataView.getInt32(1);
    var videoIsAvailable = this.dataView.getInt8(5);
    console.log("the video you requested is " + this.mediaPlayer.options.videoPath);
    console.log(videoIsAvailable);
    
    if(videoIsAvailable === 1){
       this.videoIsAvailable = true; 
       console.log("video is available!");
    }else{
        console.log("video is not available!");
    }

    
    
    
};

Flare.InitializeVideoTask.prototype.constructor = Flare.InitializeVideoTask;

Flare.AudioEngine= function (mediaPlayer) {


    /**
    * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
    */
    this.mediaPlayer = mediaPlayer;

    return this;
    
    
    
};

Flare.AudioEngine.prototype = {


};

Flare.AudioEngine.prototype.constructor = Flare.AudioEngine;

Flare.Buffer= function (mediaPlayer) {


    /**
    * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
    */
   
    
   
    this.mediaPlayer = mediaPlayer;
    
    this.testFrame =  null;

    return this;
    
    
    
    
};

Flare.Buffer.prototype = {


};

Flare.Buffer.prototype.constructor = Flare.Buffer;

Flare.Canvas = function (mediaPlayer) {

    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;


    //Private canvas element
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");

    this.canvas.id = mediaPlayer.id;

    //for now hard code
    this.canvas.width = 960;
    this.canvas.height = 540;
    
    this.canvas.style.display = 'block';
    this.canvas.style.backgroundColor = 'black';

    return this;



};

Flare.Canvas.prototype = {
    
    addToDOM: function () {

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

        target.appendChild(this.canvas);

    },
    
    render: function(frame){
        this.ctx.drawImage(frame, 0 ,0);
        //RENDER LOGIC GOES HERE
        //THE ARGUMENT IS THE FULLY RENDERED FRAME, JUST NEED TO PAINT TO THE CANVAS
        
        
    }
};

Flare.Canvas.prototype.constructor = Flare.Canvas;
Flare.MediaPlayer = function (userOptions) {

    /**
     * @property {number} id - video player id, for handling multiple MediaPlayer Objects
     * @readonly
     */
    this.id = Flare.PLAYERS.push(this) - 1;
    
    
    this.options = {
        
        container : '',
        videoPath: '',
        videoSize : Flare.CONSTANTS.VIDEO_SIZE.ORIGINAL,
        videoScale: '',
        width: '',
        height: ''
                
    }; //Default options
    
    this.parseOptions(userOptions);

    this.parent = "parent";

    //Filling out some basic properties we might need
    //DONT FORGET TO DO COMMENTS LATER



    this.url = null;
    this.frameWidth = null;
    this.frameHeight = null;
    this._networkManager = null; //Not sure if public or private yet
    this._forceUpdate;
    this.isBooted = null;
    this.oscillator = null;
    
    this.buffer = null;
    
    this.isPlaying = false;
    
    this.testCounter = 0;
    
    
    /**
     * @property {Flare.Device} Reference to global device object
     */
    this.device = Flare.Device;

    //You have to wait for the device to be ready
    this.device.whenReady(this.boot, this);

    console.log('Flare Media Player BETA  www.flaremediaplayer.com');

    return this;
};

Flare.MediaPlayer.prototype = {
    
    parseOptions: function(userOptions){
        //REMEMBER TO SANITIZE USER INPUT
        if (typeof userOptions.videoPath != 'undefined'){
            
            this.options.videoPath = userOptions.videoPath;
            
        }else{
            console.log("location is not set");
        }
        
    },
    
    boot: function () {

        if (this.isBooted)
        {
            return;
        }

        this._forceUpdate = true;

        //Initialize System
        this.oscillator = new Flare.Oscillator(this);
        this.clock = new Flare.Clock(this);
        this.buffer = new Flare.Buffer(this);
        this._networkManager = new Flare.NetworkManager(this);
        //this._networkManager.requestVideo(this.options.videoPath);
        
        
        
        
        this.canvas = new Flare.Canvas(this);
        this.canvas.addToDOM();


        //FOR TESTING ONLY
        this.frames = [152];
        var fileNum;
        for(var f = 0 ; f< 152; f++){
            this.frames[f] = new Image(960,540);
            if(f  < 10 ) {
                fileNum = "00" + f;
            }else if (f < 100){
                fileNum = "0" + f;
            }else{
                fileNum = f;
            }
            this.frames[f].src = './testVideo/frame' + fileNum + '.jpg';
        }
        //END TESTING
        
        
        //Okay now start the oscillator
        this.clock.boot();
        this.oscillator.run();
        
        

    },
    
    
    //This should probably go in videoEngine
    update: function (time) {
        this.clock.update(time);
        
        
            
        

        //Finished with update, render the frame:
        //TESTING ONLY
        
  
        this.canvas.render(this.frames[this.testCounter%152]);
       
     
        
        
        this.testCounter++;
        //Timing is completely messed up. Need to figure out core video engine code
    }
    
  
};

Flare.MediaPlayer.prototype.constructor = Flare.MediaPlayer;

Flare.VideoEngine= function (mediaPlayer) {


    /**
    * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
    */
    this.mediaPlayer = mediaPlayer;

    return this;
    
    
    
};

Flare.VideoEngine.prototype = {


};

Flare.VideoEngine.prototype.constructor = Flare.VideoEngine;
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Flare.FlareMessage = function(){
    this.flareOpCode; //1 byte
    
    this.totalMessageLength; //int
    this.dataLength; // int
    
    this.headerLength = 5;
 
    return this;
};

Flare.FlareMessage.prototype = {
    
    addStringToBinary : function(dataView , offset, string){
        
        dataView.setUint8(offset , (string.length & 0xff));//Add The length of string
   
        for(var index = 0; index < string.length; index ++){
            dataView.setUint8(index + 1 + offset , string.charCodeAt(index));
        }
        
        
        
        
    }
  
    
};

Flare.Buffer.prototype.constructor = Flare.FlareMessage;



    



Flare.OpenVideoMessage = function () {

    Flare.FlareMessage.call(this);//Inherit from flaremessage

    this.flareOpCode = Flare.OpCode.OPEN_VIDEO;

    this.requestFile = "";

    return this;



};

Flare.OpenVideoMessage.prototype = Object.create(Flare.FlareMessage.prototype);
Flare.OpenVideoMessage.prototype.constructor = Flare.OpenVideoMessage;



Flare.OpenVideoMessage.prototype.setRequestFile = function (requestFile) {

    this.requestFile = requestFile;

};

Flare.OpenVideoMessage.prototype.toBinary = function () {

    this.dataLength = this.requestFile.length + 1;
    this.totalMessageLength = this.dataLength + this.headerLength;

    var data = new ArrayBuffer(this.totalMessageLength);
    var dataView = new DataView(data);





    dataView.setInt8(0, (this.flareOpCode & 0xff));//Set The Op Code
    dataView.setInt32(1, (this.totalMessageLength & 0xffffffff));//Set The Op Code

    this.addStringToBinary(dataView, this.headerLength, this.requestFile); // add the request string
    
    /*
    //For testing what the byte array looks like
    for(var test = 0; test < this.totalMessageLength; test++){
        console.log("byte Number :" + test + "  : "+ dataView.getUint8(test));
    }
    */


    return data;


};









Flare.OpCode = {
    //Put Constant values here

    OPEN_VIDEO : 0



};

Flare.TaskTable = {};
Flare.TaskTable[Flare.OpCode.OPEN_VIDEO] = Flare.InitializeVideoTask;

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

Flare.NETWORK_PROTOCOL_TABLE = {};

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Flare;
        }
        exports.Flare = Flare;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('Flare', (function() { return root.Flare = Flare; })() );
    } else {
        root.Flare = Flare;
    }

    return Flare;
    
}).call(this);

/**
 * Class to handle the internal clock time and do adjustments depending on how fast the browser handles the updates
 * @param {type} mediaPlayer
 * @returns {Flare.Clock}
 */
Flare.Clock = function (mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;
    
    this._timeInitialized = 0;
    
    this.elapsed = 0;
    
    this.elapsedMs = 0;
    
    this.previousTime = 0;

    this.currentTime = 0;
    
    this.timeUpdated = 0;
    
    this.lastTimeUpdated = 0;

    
    return this;


};

Flare.Clock.prototype = {
    boot: function(){
        this._timeInitialized = Date.now();
        this.timeUpdated = Date.now();
    },
    
    
    refresh: function () {

        //  Set to the old Date.now value
        this.lastTimeUpdated = this.timeUpdated;

        // this.time always holds a Date.now value
        this.timeUpdated = Date.now();

        //  Adjust accordingly.
        this.elapsedMs = this.timeUpdated - this.lastTimeUpdated;

    },
    
    update: function(time){
       
       
        this.lastTimeUpdated = this.timeUpdated;

        // this.time always holds a Date.now value
        this.timeUpdated = Date.now();

        this.elapsedMS = this.timeUpdated - this.lastTimeUpdated;

        this.previousTime = this.currentTime;
        
        this.currentTime = time;

        this.elapsed = this.currentTime - this.previousTime;
        
    }
  
};

Flare.Clock.prototype.constructor = Flare.Clock;


//This thing handles making the browser do loops
Flare.Oscillator = function (mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;

    this.running = false;

    this._loopFunction = null;
    
    this._eventId = null;
    
    this.fps = 30; // Testing for now
    
    this.updateSpeed = 0;
    
    this.usingSetTimeOut = false;
    this.usingRequestAnimationFrame = false;
    
    return this;


};

Flare.Oscillator.prototype = {
    
    run: function(){
        
        this.running = true;
        var _this = this;
        this.updateSpeed = Math.floor(1000/this.fps);
        
        //if window.requestAnimationFrame is not available, use setTimeout
        if (!window.requestAnimationFrame){
            
            this.usingSetTimeOut = true;

            this._loopFunction = function () {
                return _this.updateSetTimeout();
            };
            
            this._eventId = window.setTimeout(this._loopFunction, 0);

           
            
        }else{
            
            this.usingRequestAnimationFrame = true;

            this._loopFunction = function (time) {
                return _this.updateRequestAnimationFrame(time);
            };
            
            this._eventId =  window.requestAnimationFrame(this._loopFunction);

 
        }
        
    },
    
    stop: function(){
        
        if(this.usingSetTimeOut){
            
            clearTimeout(this._eventId);
            
        }else{
            
            window.cancelAnimationFrame(this._eventId);
        }
        
        this.running = false;
        
    },
    
    updateRequestAnimationFrame: function(time){
        
        this.mediaPlayer.update(Math.floor(time));

        this._eventId = window.requestAnimationFrame(this._loopFunction);
        
    },
    
    updateSetTimeout: function(){
        
        this.mediaPlayer.update(Date.now());
        
        this._eventId = window.setTimeout(this._loopFunction, this.updateSpeed);
        
    }
    
};

Flare.Oscillator.prototype.constructor = Flare.Oscillator;

Flare.Device = function () {


    /**
     * The time the device became ready.
     * @property {integer} deviceReadyAt
     * @protected
     */
    this.deviceReadyAt = 0;

    /**
     * The time as which initialization has completed.
     * @property {boolean} initialized
     * @protected
     */
    this.initialized = false;
    /* Device need to check if the browser can do websocket
     - Is it touch ?
     - Make a handler to get DOM info so we can tell if the video is in the view port and stuff like that
    */

    //  Features
    this.hasCanvas = false;
    this.hasWebGL = false;
    this.hasFile = false;
    //this.hasFileSystem = false;
    this.hasLocalStorage = false;
    this.hasCss3D = false;
    //this.hasPointerLock = false;
    this.hasTypedArray = false;
    //this.hasVibration = false;

    //  Input
    this.hasTouch = false;
    //this.hasMousePointer = false;
    //this.hasWheelEvent = null;

    //  Audio
    //this.hasAudioData = false;
    this.hasWebAudio = false;

    // Device features
    this.littleEndian = false;
    this.bigEndian = false;
    this.fullscreen = false;
    this.webSocket = false;



};


//Make Singleton
Flare.Device = new Flare.Device();
function supportsCanvas(){
    var c = document.createElement('canvas');
    return !!c.getContext;
}

function supportsWebAudio(){
    var hasWebKitAudio = 'webkitAudioContext' in window;
    var hasAudioContext = 'AudioContext' in window;

    if( ! (hasWebKitAudio || hasAudioContext)){
        var audioElement = document.createElement('audio');
        return audioElement.canPlayType;
    }
    return true;
}

function supportsWebGL(){
    try {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    }
    catch (e) {
      return false;
    }
    return !!ctx;
}

function supportsHTML5Storage(){
    try{
        return 'localStorage' in window && window['localStorage'] !== null;
    }
    catch(e){
        return false;
    }
}

function supportsCss3D(){
    if(!!window.getComputedStyle){//  The browser does not support getComputedStyle
        return false;
    }
    var element = document.createElement('p'); //Creating a random element
    var transforms = {
            'webkitTransform':'-webkit-transform',
            'OTransform':'-o-transform',
            'msTransform':'-ms-transform',
            'MozTransform':'-moz-transform',
            'transform':'transform'
    };
    document.body.insertBefore(element, null);
    for(var t in transforms){
        if(!!element[t]){
            el.style[t] = "translate3d(1px,1px,1px)";
            has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
        }
    }
    document.body.removeChild(element);
    return !!has3d && has3d.length > 0 && has3d !==  "none";
}

function isTouch(){
    return ('ontouchstart' in window) && (window.navigator.MaxTouchPoints > 0);
}

function supportsInputFile(){
    try{
        var inputElement = document.createElement("input");
        inputElement.setAttribute("type", "file");
    }
    catch(e){
        return false;
    }
    return inputElement.type !== "text";  // If type = text, the web browser didn't make  <input>
}

function supportsFullscreen(){
    var documentEl = document.documentElement;
    return ((!!documentEl.requestFullscreen)
            || !!documentEl.mozRequestFullScreen
            || !!documentEl.webkitRequestFullScreen
            || !!documentEl.msRequestFullscreen);
}
function supportsWebSocket(){
    try{
        return 'WebSocket' in window && window.WebSocket.CLOSING === 2;
    }
    catch(e){
        return false;
    }
}

Flare.Device._initialize = function () {

     //  Features
    this.hasCanvas = supportsCanvas();
    this.hasWebGL = supportsWebGL();
    this.hasFile = supportsInputFile();
    //this.hasFileSystem = false; // ??
    this.hasLocalStorage = supportsHTML5Storage();
    //this.hasCss3D = supportsCss3D();
    //this.hasPointerLock = false;
    this.hasTypedArray = 'ArrayBuffer' in window;
    //this.hasVibration = false;

    //  Input
    this.hasTouch = isTouch();
    // this.hasMousePointer = false; Why do we need this? 
    //this.hasWheelEvent = null;

    //  Audio
    //this.hasAudioData = false;
    this.hasWebAudio = supportsWebAudio();

    // Device features
    this.littleEndian = false;
    this.bigEndian = false;
    this.webSocket = supportsWebSocket();
    this.fullscreen = supportsFullscreen();
};

Flare.Device.whenReady = function (callback, context) {

    var readyCheck = this._readyCheck;

    if (this.deviceReadyAt || !readyCheck) {

        //Device is already done loading
        callback.call(context, this);

    } else if (readyCheck._monitor) {

        readyCheck._queue = readyCheck._queue || [];
        readyCheck._queue.push([callback, context]);

    } else {

        readyCheck._monitor = readyCheck.bind(this);
        readyCheck._queue = readyCheck._queue || [];
        readyCheck._queue.push([callback, context]);


        if (document.readyState === 'complete' || document.readyState === 'interactive') {

            window.setTimeout(readyCheck._monitor, 0);

        } else {
            document.addEventListener('DOMContentLoaded', readyCheck._monitor, false);
            window.addEventListener('load', readyCheck._monitor, false);
        }
    }
};


Flare.Device._readyCheck = function () {

    var readyCheck = this._readyCheck;

    if (!document.body)
    {

        window.setTimeout(readyCheck._monitor, 20);

    } else if (!this.deviceReadyAt) {

        this.deviceReadyAt = Date.now();

        document.removeEventListener('deviceready', readyCheck._monitor);
        document.removeEventListener('DOMContentLoaded', readyCheck._monitor);
        window.removeEventListener('load', readyCheck._monitor);

        this._initialize();
        this.initialized = true;


        var item;
        while ((item = readyCheck._queue.shift()))
        {
            var callback = item[0];
            var context = item[1];
            callback.call(context, this);
        }

        this._readyCheck = null;
        this._initialize = null;
        this.onInitialized = null;
    }   
};
//Going to need this so that we can have multiple listeners for multiple videos or multiple protocool callbacks and stuff
Flare.EventDispatcher = function () {




};

Flare.EventDispatcher.prototype = {
    
};

Flare.EventDispatcher.prototype.constructor = Flare.EventDispatcher;