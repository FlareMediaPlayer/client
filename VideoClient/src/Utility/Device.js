
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

    //  Audio
    this.hasAudioData = false;
    this.hasWebAudio = false;

    // Device features
    this.pixelRatio = 0;
    this.littleEndian = false;
    this.LITTLE_ENDIAN = false;
    this.supports32bit = false;
    this.fullscreen = false;



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
    return ctx;
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

    return !!has3d && has3d !==  "none";
}


Flare.Device._initialize = function () {

     //  Features
    this.hasCanvas = supportsCanvas();
    this.hasWebGL = supportsWebGL();
    this.hasFile = false;// ?
    this.hasFileSystem = false; // ??
    this.hasLocalStorage = supportsHTML5Storage();
    this.hasCss3D = supportsCss3D();
    this.hasPointerLock = false;
    this.hasTypedArray = false;
    this.hasVibration = false;

    //  Input
    this.hasTouch = false;
    this.hasMousePointer = false;
    this.hasWheelEvent = null;

    //  Audio
    this.hasAudioData = false;
    this.hasWebAudio = supportsWebAudio();

    // Device features
    this.pixelRatio = 0;
    this.littleEndian = false;
    this.LITTLE_ENDIAN = false;
    this.supports32bit = false;
    this.fullscreen = false;

    this.deviceReadyAt = 0;

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