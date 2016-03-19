
Flare.NetworkManager= function (videoPlayer) {


    /**
    * @property Flare.VideoPlayer} videoPlayer - A reference to the videoPlayer.
    */
    this.videoPlayer = videoPlayer;
    
    this.socket = new WebSocket('ws://localhost:6661' );

    return this;
    
    
    
};

Flare.NetworkManager.prototype = {


};

Flare.NetworkManager.prototype.constructor = Flare.NetworkManager;