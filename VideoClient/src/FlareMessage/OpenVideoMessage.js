/**
 * Message for requesting a video
 * @author Brian Parra
 * @memberOf Flare
 * @class Flare.OpenVideoMessage
 * @augments Flare.FlareMessage
 * @constructor
 * @return {Flare.OpenVideoMessage} returns an OpenVideoMessage
 */
Flare.OpenVideoMessage = function () {

    Flare.FlareMessage.call(this);//Inherit from flaremessage

    this.flareOpCode = Flare.OpCode.OPEN_VIDEO;

    this.requestFile = "";

    return this;



};

Flare.OpenVideoMessage.prototype = Object.create(Flare.FlareMessage.prototype);
Flare.OpenVideoMessage.prototype.constructor = Flare.OpenVideoMessage;


/**
 * Sets the requestID of desired video
 * @memberof Flare.OpenVideoMessage.prototype
 * @function setRequestFile
 * @param {string} requestFile the string of the request ID
 */
Flare.OpenVideoMessage.prototype.setRequestFile = function (requestFile) {

    this.requestFile = requestFile;

};

/**
 * Turns the entire message into a binary array for sending
 * @memberof Flare.OpenVideoMessage.prototype
 * @function toBinary
 * @return {object} data view of binary
 */
Flare.OpenVideoMessage.prototype.toBinary = function () {

    this.dataLength = this.requestFile.length + 1;
    this.totalMessageLength = this.dataLength + this.headerLength;

    var data = new ArrayBuffer(this.totalMessageLength);
    var dataView = new DataView(data);





    dataView.setInt8(0, (this.flareOpCode & 0xff));//Set The Op Code
    dataView.setInt32(1, (this.totalMessageLength & 0xffffffff));//Set The Op Code

    this.addStringToBinary(dataView, this.headerLength, this.requestFile); // add the request string

    return data;


};








