
Flare.Canvas = function (mediaPlayer) {

    /**
     * @property Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer = mediaPlayer;


    //Private canvas element
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext("2d");

    this.canvas.id = mediaPlayer.id;

    //for now hard code
    this.canvas.width = 960;
    this.canvas.height = 540;
    
    this.canvas.style.display = 'block';
    this.canvas.style.backgroundColor = 'black';

    return this;



};

Flare.Canvas.prototype = {
    
    addToDOM: function () {

        var target;
        var parent = this.mediaPlayer.parent;

        
        if (parent)
        {
            if (typeof parent === 'string')
            {
                target = document.getElementById(parent);
            } else if (typeof parent === 'object' && parent.nodeType === 1)
            {
                target = parent;
            }
        }
        
        // Fallback, covers an invalid ID and a non HTMLelement object
        if (!target){
            
            target = document.body;
        }

        target.appendChild(this.canvas);

    },
    
    render: function(frame){
        this.ctx.drawImage(frame, 0 ,0);
        //RENDER LOGIC GOES HERE
        //THE ARGUMENT IS THE FULLY RENDERED FRAME, JUST NEED TO PAINT TO THE CANVAS
        
        
    }
};

Flare.Canvas.prototype.constructor = Flare.Canvas;