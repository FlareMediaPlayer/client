
/**
 * Class to handle the internal clock time and do adjustments depending on how fast the browser handles the updates
 * @param {type} mediaPlayer
 * @returns {Flare.Clock}
 */
Flare.Clock = function (mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;
    
    this._timeInitialized = 0;
    
    this.elapsed = 0;
    
    this.elapsedMs = 0;
    
    this.previousTime = 0;

    this.currentTime = 0;
    
    this.timeUpdated = 0;
    
    this.lastTimeUpdated = 0;

    
    return this;


};

Flare.Clock.prototype = {
    boot: function(){
        this._timeInitialized = Date.now();
        this.timeUpdated = Date.now();
    },
    
    
    refresh: function () {

        //  Set to the old Date.now value
        this.lastTimeUpdated = this.timeUpdated;

        // this.time always holds a Date.now value
        this.timeUpdated = Date.now();

        //  Adjust accordingly.
        this.elapsedMs = this.timeUpdated - this.lastTimeUpdated;

    },
    
    update: function(time){
       
       
        this.lastTimeUpdated = this.timeUpdated;

        // this.time always holds a Date.now value
        this.timeUpdated = Date.now();

        this.elapsedMS = this.timeUpdated - this.lastTimeUpdated;

        this.previousTime = this.currentTime;
        
        this.currentTime = time;

        this.elapsed = this.currentTime - this.previousTime;
        
    }
  
};

Flare.Clock.prototype.constructor = Flare.Clock;