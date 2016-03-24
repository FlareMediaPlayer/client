

//This thing handles making the browser do loops
Flare.Oscillator = function (mediaPlayer) {


    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;

    this.running = false;

    this._loopFunction = null;
    
    this.fps = 30; // Testing for now
    
    this.updateSpeed = 0;
    
    this.usingSetTimeOut = false;
    this.usingRequestAnimationFrame = false;
    
    return this;


};

Flare.Oscillator.prototype = {
    
    run: function(){
        
        this.running = true;
        var _this = this;
        this.updateSpeed = Math.floor(1000/this.fps);
        
        //if window.requestAnimationFrame is not available, use setTimeout
        if (!window.requestAnimationFrame){
            
            this.usingSetTimeOut = true;

            this._loopFunction = function () {
                return _this.updateSetTimeout();
            };
            
            window.setTimeout(this._loopFunction, 0);

           
            
        }else{
            
            this.usingRequestAnimationFrame = true;

            this._loopFunction = function (time) {
                return _this.updateRequestAnimationFrame(time);
            };
            
            window.requestAnimationFrame(this._loopFunction);

 
        }
        
    },
    
    updateRequestAnimationFrame: function(time){
        
        this.mediaPlayer.update(Math.floor(time));

        window.requestAnimationFrame(this._loopFunction);
        
    },
    
    updateSetTimeout: function(){
        
        this.mediaPlayer.update(Date.now());
        
        window.setTimeout(this._loopFunction, this.updateSpeed);
        
    }
    
};

Flare.Oscillator.prototype.constructor = Flare.Oscillator;