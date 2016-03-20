Flare.VideoPlayer = function (parent) {

    /**
     * @property {number} id - video player id, for handling multiple VideoPlayer Objects
     * @readonly
     */
    this.id = Flare.VIDEOS.push(this) - 1;

    this.parent = "parent";

    //Filling out some basic properties we might need
    //DONT FORGET TO DO COMMENTS LATER



    this.url = null;
    this.frameWidth = null;
    this.frameHeight = null;
    this._networkManager = null; //Not sure if public or private yet
    this.isBooted = null;

    /**
     * @property {Flare.Device} Reference to global device object
     */
    this.device = Flare.Device;

    //You have to wait for the device to be ready
    this.device.whenReady(this.boot, this);
    
    console.log('Flare Media Player BETA  www.flaremediaplayer.com');

    return this;
};

Flare.VideoPlayer.prototype = {
    
    boot: function () {

        if (this.isBooted)
        {
            return;
        }

        this._networkManager = new Flare.NetworkManager(this);
        this.canvas = new Flare.Canvas(this);
        this.canvas.addToDOM();
        
        
        //Testing, trying to send some data
       // this._networkManager.send("hello");

    }

};

Flare.VideoPlayer.prototype.constructor = Flare.VideoPlayer;