
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