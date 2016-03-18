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



VideoPlayer.VideoPlayer = function(){
    
    //Fill out video player properties here
    //DONT FORGET TO DO COMMENTS LATER
    this.canvas;
    this.url;
    this.frameWidth;
    this.frameHeight;
    
    
    return this;
};

VideoPlayer.VideoPlayer.prototype={
    
};

VideoPlayer.VideoPlayer.prototype.constructor = VideoPlayer.VideoPlayer;