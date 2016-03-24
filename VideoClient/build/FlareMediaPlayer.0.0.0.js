
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

    NETWORK:{
        
        REQUEST:{
            
            CONNECT: 100
            
        },
        
        RESPONSE:{
        
        }
                
    }


};


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

    this.canvas.id = mediaPlayer.id;

    //for now hard code
    this.canvas.width = 256;
    this.canvas.height = 256;
    
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
        
        //RENDER LOGIC GOES HERE
        //THE ARGUMENT IS THE FULLY RENDERED FRAME, JUST NEED TO PAINT TO THE CANVAS
        
        
    }
};

Flare.Canvas.prototype.constructor = Flare.Canvas;
Flare.MediaPlayer = function (options) {

    /**
     * @property {number} id - video player id, for handling multiple MediaPlayer Objects
     * @readonly
     */
    this.id = Flare.PLAYERS.push(this) - 1;

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
    
    boot: function () {

        if (this.isBooted)
        {
            return;
        }

        this._forceUpdate = true;

        //Initialize System
        this.oscillator = new Flare.Oscillator(this);
        this._networkManager = new Flare.NetworkManager(this);
        this.canvas = new Flare.Canvas(this);
        this.canvas.addToDOM();


        //Okay now start the oscillator
        this.oscillator.run();

    },
    
    update: function (time) {
  
        document.getElementById("test").innerHTML = time % 60;
            
        

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
        console.log(message.data);
    },
    
    onError: function(e){
        console.log(e);
    },
    
    send:function(data){
        
        this.socket.send(data);
        
    }
    
};

Flare.NetworkManager.prototype.constructor = Flare.NetworkManager;

Flare.NETWORK_PROTOCOL_TABLE = {};
Flare.NETWORK_PROTOCOL_TABLE[Flare.CONSTANTS.NETWORK.REQUEST.CONNECT] = "Connect";
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
 * @returns {Flare.Oscillator}
 */
Flare.Oscillator = function (mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;


    
    return this;


};

Flare.Oscillator.prototype = {
  
};

Flare.Oscillator.prototype.constructor = Flare.Oscillator;


//This thing handles making the browser do loops
Flare.Oscillator = function (mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;

    this.running = false;

    this._loopFunction = null;
    
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
            
            window.setTimeout(this._loopFunction, 0);

           
            
        }else{
            
            this.usingRequestAnimationFrame = true;

            this._loopFunction = function (time) {
                return _this.updateRequestAnimationFrame(time);
            };
            
            window.requestAnimationFrame(this._loopFunction);

 
        }
        
    },
    
    updateRequestAnimationFrame: function(time){
        
        this.mediaPlayer.update(Math.floor(time));

        window.requestAnimationFrame(this._loopFunction);
        
    },
    
    updateSetTimeout: function(){
        
        this.mediaPlayer.update(Date.now());
        
        window.setTimeout(this._loopFunction, this.updateSpeed);
        
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

    //  Browser / Host / Operating System


    this.isDesktop = false;
    this.isIOS = false;
    this.iOSVersion = 0;
    this.isAndroid = false;
    this.isChromeOS = false;
    this.isLinux = false;
    this.isOSX = false;
    this.isWindows = false;
    this.isWindowsPhone = false;

    //  Features

    this.hasCanvas = false;
    this.hasWebGL = false;
    this.hasFile = false;
    this.hasFileSystem = false;
    this.hasLocalStorage = false;
    this.hasCss3D = false;
    this.hasPointerLock = false;
    this.hasTypedArray = false;
    this.hasVibration = false;

    //  Input

    this.hasTouch = false;
    this.hasMousePointer = false;
    this.hasWheelEvent = null;

    // Browser
    this.isChrome = false;
    this.chromeVersion = 0;
    this.isEpiphany = false;
    this.isFirefox = false;
    this.firefoxVersion = 0;
    this.isIe = false;
    this.ieVersion = 0;
    this.isTrident = false;
    this.tridentVersion = 0;
    this.isEdge = false;
    this.isMobileIOS = false;
    this.isMidori = false;
    this.isOpera = false;
    this.isSafari = false;
    this.safariVersion = 0;
    this.isWebApp = false;
    this.isSilk = false;

    //  Audio

    this.hasAudioData = false;
    this.hasWebAudio = false;


    //  Device
    this.isIPhone = false;
    this.isIPad = false;

    // Device features
    this.pixelRatio = 0;
    this.littleEndian = false;
    this.LITTLE_ENDIAN = false;
    this.supports32bit = false;
    this.fullscreen = false;



};


//Make Singleton
Flare.Device = new Flare.Device();

Flare.Device._initialize = function () {
    //Check do device check
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