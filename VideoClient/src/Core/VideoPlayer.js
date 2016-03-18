
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