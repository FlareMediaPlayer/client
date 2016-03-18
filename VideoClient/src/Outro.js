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