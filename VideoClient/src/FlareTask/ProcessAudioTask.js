/**
 * Class for handeling incoming audio data
 * @author Brian Parra 
 * @memberOf Flare
 * @class Flare.ProcessAudioTask
 * @constructor
 * @return {Flare.ProcessAudioTask} returns a Flare ProcessAudioTask
 */
Flare.ProcessAudioTask = function () {


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
 * @memberof Flare.ProcessAudioTask.prototype
 * @function setData
 * @param {object} data binary array of data
 */
Flare.ProcessAudioTask.prototype.setData = function (data) {

    this.data = data;
    this.dataView = new DataView(this.data);
    this.flareOpCode = Flare.OpCode.FRAME;
    this.videoIsAvailable = false;

};

/**
 * Sets media player reference
 * @memberof Flare.ProcessAudioTask.prototype
 * @function setMediaPlayer
 * @param {Flare.MediaPlayer} mediaPlayer reference to the media player
 */
Flare.ProcessAudioTask.prototype.setMediaPlayer = function (mediaPlayer) {

    this.mediaPlayer = mediaPlayer

};

/**
 * Processess the message recieved
 * @memberof Flare.ProcessAudioTask.prototype
 * @function process
 */
Flare.ProcessAudioTask.prototype.process = function () {

    var dataLength = this.dataView.getInt32(0);


    this.mediaPlayer.buffer.setAudioData(this.data.slice(5));

};

Flare.ProcessAudioTask.prototype.constructor = Flare.ProcessAudioTask;