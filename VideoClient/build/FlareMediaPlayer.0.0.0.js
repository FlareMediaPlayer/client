
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
    VIDEOS: []
    
};



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


Flare.VideoPlayer = function () {
    
    /**
    * @property {number} id - video player id, for handling multiple VideoPlayer Objects
    * @readonly
    */
    this.id = Flare.VIDEOS.push(this) - 1;

    //Filling out some basic properties we might need
    //DONT FORGET TO DO COMMENTS LATER
    this.canvas = null;
    this.url = null;
    this.frameWidth = null;
    this.frameHeight = null;
    this._networkManager = null; //Not sure if public or private yet
    this.isBooted = null;
    
    //Testing for now, does not necessarally need to be called on the constructor
    this.boot();

    return this;
};

Flare.VideoPlayer.prototype = {
    boot: function () {
        
        if (this.isBooted)
        {
            return;
        }
        
        this._networkManager = new Flare.NetworkManager(this);

    }

};

Flare.VideoPlayer.prototype.constructor = Flare.VideoPlayer;
Flare.Constants = {
    //Put Constant values here
    
    //Examples:
    REQUEST_CONNECT : 100,
    RESPONSE_CONNECT : 200

};


Flare.NetworkManager= function (videoPlayer) {


    /**
    * @property Flare.VideoPlayer} videoPlayer - A reference to the videoPlayer.
    */
    this.videoPlayer = videoPlayer;

    return this;
    
    
    
};

Flare.NetworkManager.prototype = {


};

Flare.NetworkManager.prototype.constructor = Flare.NetworkManager;