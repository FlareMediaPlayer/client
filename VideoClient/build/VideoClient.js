
(function(){

    var root = this;



    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = VideoPlayer;
        }
        exports.VideoPlayer = VideoPlayer;
    } else if (typeof define !== 'undefined' && define.amd) {
        define('VideoPlayer', (function() { return root.VideoPlayer = VideoPlayer; })() );
    } else {
        root.VideoPlayer = VideoPlayer;
    }

    return VideoPlayer;
    
}).call(this);



/**
 * @namespace Video Player
 */
var VideoPlayer = VideoPlayer || {
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



VideoPlayer.VideoPlayer = function () {
    
    /**
    * @property {number} id - video player id, for handling multiple VideoPlayer Objects
    * @readonly
    */
    this.id = VideoPlayer.VIDEOS.push(this) - 1;

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

VideoPlayer.VideoPlayer.prototype = {
    boot: function () {
        
        if (this.isBooted)
        {
            return;
        }
        
        this._networkManager = new VideoPlayer.NetworkManager(this);

    }

};

VideoPlayer.VideoPlayer.prototype.constructor = VideoPlayer.VideoPlayer;
VideoPlayer.Constants = {
    //Put Constant values here
    
    //Examples:
    REQUEST_CONNECT : 100,
    RESPONSE_CONNECT : 200

};


VideoPlayer.NetworkManager= function (videoPlayer) {


    /**
    * @property {VideoPlayer.VideoPlayer} videoPlayer - A reference to the videoPlayer.
    */
    this.videoPlayer = videoPlayer;

    return this;
    
    
};

VideoPlayer.NetworkManager.prototype = {


};

VideoPlayer.NetworkManager.prototype.constructor = VideoPlayer.NetworkManager;