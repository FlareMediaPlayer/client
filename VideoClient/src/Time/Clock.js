
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

    this.timeStarted = 0;

    this.timePaused = 0;

    this.time = 0;

    this.minutes = 0;
    
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
    
    update: function(time) {
       
       
        this.lastTimeUpdated = this.timeUpdated;

        // this.time always holds a Date.now value
        this.timeUpdated = Date.now();

        this.elapsedMS = this.timeUpdated - this.lastTimeUpdated;

        this.previousTime = this.currentTime;
        
        this.currentTime = time;

        this.elapsed = this.currentTime - this.previousTime;
        
    },

    totalTimePlayed: function(startTime, pauseTime) {
        if(startTime === 0){    //video has not started playing yet
            return 0;
        }
        this.time = ((Date.now() - startTime) - pauseTime) / 1000;
        var seconds = Math.floor(this.time * 1) / 1;
        if(seconds > 59){
            this.minutes++;
            this.time = 0;
            seconds = 0;
            this.mediaPlayer.setStartTime(Date.now()); 
        }
        if(seconds < 10){
            return this.minutes + ":0" + seconds;
        }
        return this.minutes + ":" + seconds;
    },

    getPauseTime: function() {
        return this.timePaused;
    },

    setPauseTime: function(time) {
        this.timePaused = time;
    }
  
};

Flare.Clock.prototype.constructor = Flare.Clock;