
Flare.Canvas = function (videoPlayer) {

    /**
     * @property Flare.VideoPlayer} videoPlayer - A reference to the videoPlayer.
     */
    this.videoPlayer = videoPlayer;


    //Private canvas element
    this.canvas = document.createElement('canvas');

    this.canvas.id = videoPlayer.id;

    //for now hard code
    this.canvas.width = 256;
    this.canvas.height = 256;
    
    this.canvas.style.display = 'block';
    this.canvas.style.backgroundColor = 'black';

    return this;



};

Flare.Canvas.prototype = {
    
    addToDOM: function () {

        var target;
        var parent = this.videoPlayer.parent;

        
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
        
        //RENDER LOGIC GOES HERE
        //THE ARGUMENT IS THE FULLY RENDERED FRAME, JUST NEED TO PAINT TO THE CANVAS
        
        
    }
};

Flare.Canvas.prototype.constructor = Flare.Canvas;