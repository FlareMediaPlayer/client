/**
 * class for handling device specific apis
 * @author Fredrik
 * @memberOf Flare
 * @class Flare.AudioEngine
 * @constructor
 */

Flare.Device = function () {

    /*
     * @property {number} deviceReadyAt time device was initialized at
     */
    this.deviceReadyAt = 0;

    /*
     * @property {boolean} initialized if the device has initialized
     */
    this.initialized = false;

    /**
     * @property {boolean} isCompatible is the current device compatible
     */
    this.isCompatible = false;

    /**
     * @property {boolean} hasGeneralInputTypes does this device have inputs
     */
    this.hasGeneralInputTypes = false;

    /**
     * @property {boolean} hasCanvas is the canvas available
     */
    this.hasCanvas = false;

    /**
     * @property {boolean} hasWebGL does the device have WebGl
     */
    this.hasWebGL = false;

    /**
     * @property {boolean} does the device have File reading/writing capabilities
     */
    this.hasFile = false;

    /**
     * @property {boolean} hasLocalStorage can store local data
     */
    this.hasLocalStorage = false;

    /**
     * @property {boolean} hasTypedArray is typed array available
     */
    this.hasTypedArray = false;

    /**
     * @property {boolean} hasTouch is touch input available
     */
    this.hasTouch = false;

    /**
     * @property {boolean} hasWebAudio is webAudio available
     */
    this.hasWebAudio = false;

    /**
     * @property {boolean} fullscreen  is fullscreen available
     */
    this.fullscreen = false;

    /**
     * @property {boolean} webSocket is websocket available
     */
    this.webSocket = false;
};


//Make Singleton
Flare.Device = new Flare.Device();


/**
 * All device initialization goes here, including feature checking
 * @memberof Flare.Device
 * @function _initialize
 */
Flare.Device._initialize = function () {


    function supportsCanvas() {

        var c = document.createElement('canvas');
        return !!c.getContext;

    }

    function supportsWebAudio() {
        var hasWebKitAudio = 'webkitAudioContext' in window;
        var hasAudioContext = 'AudioContext' in window;

        if (!(hasWebKitAudio || hasAudioContext)) {
            var audioElement = document.createElement('audio');
            return audioElement.canPlayType;
        }
        return true;
    }

    function supportsWebGL() {
        try {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
        } catch (e) {
            return false;
        }
        return !!ctx;
    }

    function supportsHTML5Storage() {
        try {
            return 'localStorage' in window && window['localStorage'] !== null;
        } catch (e) {
            return false;
        }
    }

    function supportsCss3D() {
        if (!!window.getComputedStyle) { //  The browser does not support getComputedStyle
            return false;
        }
        var element = document.createElement('p'); //Creating a random element
        var transforms = {
            'webkitTransform': '-webkit-transform',
            'OTransform': '-o-transform',
            'msTransform': '-ms-transform',
            'MozTransform': '-moz-transform',
            'transform': 'transform'
        };
        document.body.insertBefore(element, null);
        for (var t in transforms) {
            if (!!element[t]) {
                el.style[t] = "translate3d(1px,1px,1px)";
                has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
            }
        }
        document.body.removeChild(element);
        return !!has3d && has3d.length > 0 && has3d !== "none";
    }

    function isTouch() {
        return ('ontouchstart' in window) && (window.navigator.MaxTouchPoints > 0);
    }

    function supportsInput(type) {
        try {
            var input = document.createElement('input');
            input.setAttribute("type", type);
        } catch (e) {
            return false;
        }
        return input.type !== "text";
    }

    function supportsFullscreen() {
        var documentEl = document.documentElement;
        return ((!!documentEl.requestFullscreen) || !!documentEl.mozRequestFullScreen || !!documentEl.webkitRequestFullScreen || !!documentEl.msRequestFullscreen);
    }

    function supportsWebSocket() {
        try {
            return 'WebSocket' in window && window.WebSocket.CLOSING === 2;
        } catch (e) {
            return false;
        }
    }

    /** Variable initialization     */

    this.hasCanvas = supportsCanvas();
    this.hasWebGL = supportsWebGL();
    this.hasFile = supportsInput("file");
    this.hasLocalStorage = supportsHTML5Storage();
    //this.hasCss3D = supportsCss3D();
    this.hasTypedArray = 'ArrayBuffer' in window;
    //  Input
    this.hasTouch = isTouch();
    //  Audio
    this.hasWebAudio = supportsWebAudio();
    // Device features
    this.webSocket = supportsWebSocket();
    this.fullscreen = supportsFullscreen();
    var range = supportsInput("range");
    this.hasGeneralInputTypes = range; // Can do hasFile too
    this.isCompatible = this.hasCanvas && this.hasGeneralInputTypes
            && this.webSocket && this.hasWebAudio;
};

/**
 * sets up Callback after device is detected to be ready, triggers the rest of the initialization
 * @memberof Flare.Device
 * @function whenReady
 * @param {function} callback function to callback after ready
 * @param {object} context context of the callback
 */
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

/**
 * Keeps checkign to see if DOM is fully loaded and ready 
 * @memberof Flare.Device
 * @function _readyCheck
 */
Flare.Device._readyCheck = function () {

    var readyCheck = this._readyCheck;

    if (!document.body) {

        window.setTimeout(readyCheck._monitor, 20);

    } else if (!this.deviceReadyAt) {

        this.deviceReadyAt = Date.now();

        document.removeEventListener('deviceready', readyCheck._monitor);
        document.removeEventListener('DOMContentLoaded', readyCheck._monitor);
        window.removeEventListener('load', readyCheck._monitor);

        this._initialize();
        this.initialized = true;


        var item;
        while ((item = readyCheck._queue.shift())) {
            var callback = item[0];
            var context = item[1];
            callback.call(context, this);
        }

        this._readyCheck = null;
        this._initialize = null;
        this.onInitialized = null;
    }
};
