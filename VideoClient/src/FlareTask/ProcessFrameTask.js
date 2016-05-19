
/**
 * Class for handeling incoming Frame Data
 * @author Brian Parra
 * @memberOf Flare
 * @class Flare.ProcessFrameTask
 * @constructor
 * @return {Flare.ProcessFrameTask} returns a Flare ProcessFrameTask
 */

Flare.ProcessFrameTask = function () {


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
 * @memberof Flare.ProcessFrameTask.prototype
 * @function setData
 * @param {object} data binary array of data
 */
Flare.ProcessFrameTask.prototype.setData = function (data) {

    this.data = data;
    this.dataView = new DataView(this.data);
    this.flareOpCode = Flare.OpCode.FRAME;
    this.videoIsAvailable = false;

};

/**
 * Sets media player reference
 * @memberof Flare.ProcessFrameTask.prototype
 * @function setMediaPlayer
 * @param {Flare.MediaPlayer} mediaPlayer reference to the media player
 */
Flare.ProcessFrameTask.prototype.setMediaPlayer = function (mediaPlayer) {

    this.mediaPlayer = mediaPlayer

};

/**
 * Processess the message recieved
 * @memberof Flare.ProcessFrameTask.prototype
 * @function process
 */
Flare.ProcessFrameTask.prototype.process = function () {

    var dataLength = this.dataView.getInt32(0);
    var index = this.dataView.getUint32(5);


    //This way is probably super slow!!!!
    var img = new Image;
    var blob = new Blob([this.data.slice(9)], {type: 'image/jpg'});
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(blob);
    img.src = imageUrl;
    //console.log("frame " +index + "loaded");




    this.mediaPlayer.buffer.setFrameAt(index, img);







};

Flare.ProcessFrameTask.prototype.constructor = Flare.ProcessFrameTask;