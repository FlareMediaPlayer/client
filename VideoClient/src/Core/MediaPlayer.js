Flare.MediaPlayer = function (options) {

    /**
     * @property {number} id - video player id, for handling multiple MediaPlayer Objects
     * @readonly
     */
    this.id = Flare.PLAYERS.push(this) - 1;

    this.parent = "parent";

    //Filling out some basic properties we might need
    //DONT FORGET TO DO COMMENTS LATER



    this.url = null;
    this.frameWidth = null;
    this.frameHeight = null;
    this._networkManager = null; //Not sure if public or private yet
    this._forceUpdate;
    this.isBooted = null;
    this.oscillator = null;

    /**
     * @property {Flare.Device} Reference to global device object
     */
    this.device = Flare.Device;

    //You have to wait for the device to be ready
    this.device.whenReady(this.boot, this);

    console.log('Flare Media Player BETA  www.flaremediaplayer.com');

    return this;
};

Flare.MediaPlayer.prototype = {
    
    boot: function () {

        if (this.isBooted)
        {
            return;
        }

        this._forceUpdate = true;

        //Initialize System
        this.oscillator = new Flare.Oscillator(this);
        this._networkManager = new Flare.NetworkManager(this);
        this.canvas = new Flare.Canvas(this);
        this.canvas.addToDOM();


        //Okay now start the oscillator
        this.oscillator.run();

    },
    
    update: function (time) {
  
        document.getElementById("test").innerHTML = time % 60;
            
        

    }
};

Flare.MediaPlayer.prototype.constructor = Flare.MediaPlayer;