
/**
 * Class to handle the internal clock time and do adjustments depending on how fast the browser handles the updates
 * @param {type} mediaPlayer
 * @returns {Flare.Oscillator}
 */
Flare.Oscillator = function (mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;
    
    this.elapsed = 0;
    
    this.previousTime = 0;

    this.currentTime = 0;

    
    return this;


};

Flare.Oscillator.prototype = {
    
    update: function(time){
        
        //Finish figureout out the elapsed time here
        this.currentTime = time;
        
    }
  
};

Flare.Oscillator.prototype.constructor = Flare.Oscillator;