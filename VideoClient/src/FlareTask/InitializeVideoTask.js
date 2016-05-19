/**
 * Class for handeling initialization of video metadata
 * @author Brian Parra
 * @memberOf Flare
 * @class Flare.InitializeVideoTask
 * @constructor
 * @return {Flare.InitializeVideoTask} returns a Flare InitializeVideoTask
 */

Flare.InitializeVideoTask = function () {


    /**
     * @property {object} data the raw incoming data
     */
    this.data;

    /**
     * @property {object} dataView the dataview created to navigate data
     */
    this.dataView;

    /**
     * @property {number} flareOpCode this is the flare opcode in the message
     */
    this.flareOpCode;

    /**
     * @property {Flare.VideoPlayer} mediaPlayer - A reference to the mediaPlayer.
     */
    this.mediaPlayer;


    return this;

};

/**
 * Sets the binary data recieved from message
 * @memberof Flare.InitializeVideoTask.prototype
 * @function setData
 * @param {object} data binary array of data
 */
Flare.InitializeVideoTask.prototype.setData = function (data) {

    this.data = data;
    this.dataView = new DataView(this.data);
    this.flareOpCode = Flare.OpCode.OPEN_VIDEO;
    this.videoIsAvailable = false;

    this.width = 0;
    this.height = 0;
    this.fps = 0;
    this.duration = 0;

};


/**
 * Sets media player reference
 * @memberof Flare.InitializeVideoTask.prototype
 * @function setMediaPlayer
 * @param {Flare.MediaPlayer} mediaPlayer reference to the media player
 */
Flare.InitializeVideoTask.prototype.setMediaPlayer = function (mediaPlayer) {

    this.mediaPlayer = mediaPlayer;

};

/**
 * Processess the message recieved
 * @memberof Flare.InitializeVideoTask.prototype
 * @function process
 */
Flare.InitializeVideoTask.prototype.process = function () {

    var dataLength = this.dataView.getInt32(1);
    var videoIsAvailable = this.dataView.getInt8(5);
    console.log("the video you requested is " + this.mediaPlayer.options.videoID);
    //console.log(videoIsAvailable);

    if (videoIsAvailable === 1) {
        this.videoIsAvailable = true;
        this.width = this.dataView.getInt32(6);
        this.height = this.dataView.getInt32(10);
        this.fps = this.dataView.getFloat64(14);
        this.duration = this.dataView.getFloat64(22);
        this.frameCount = this.dataView.getInt32(30);
        console.log(this.width + " width");
        console.log(this.height + " height ");
        console.log(this.fps + " fps ");
        console.log(this.duration + " duration ");
        console.log(this.frameCount + "frame Count");


        this.mediaPlayer.buffer.initFrameBuffer(this.frameCount, this.fps, this.duration); //Swap out for dynamic buffer and frame rate later
        this.mediaPlayer.videoPlayer.setDuration(this.duration);
        this.mediaPlayer.videoPlayer.setFps(this.fps);

        console.log("video is available!");
    } else {
        console.log("video is not available!");
    }




};

Flare.InitializeVideoTask.prototype.constructor = Flare.InitializeVideoTask;