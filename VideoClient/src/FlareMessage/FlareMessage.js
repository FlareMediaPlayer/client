/**
 * "Abstract" class for FlareMessage
 * @author Brian Parra
 * @memberOf Flare
 * @class Flare.FlareMessage
 * @constructor
 * @return {Flare.FlareMessage} returns a FlareMessage
 */
Flare.FlareMessage = function () {
    this.flareOpCode; //1 byte

    this.totalMessageLength; //int
    this.dataLength; // int

    this.headerLength = 5;

    return this;
};

Flare.FlareMessage.prototype = {
    /**
     * A function that adds a string to a binary dataView at a designated offset
     * @memberof Flare.FlareMessage.prototype
     * @function addStringToBinary
     * @param {object} dataView the binary dataView object
     * @param {number} offset the integer offset in the dataview
     * @param {string} string the string to add
     * 
     */
    addStringToBinary: function (dataView, offset, string) {

        dataView.setUint8(offset, (string.length & 0xff));//Add The length of string

        for (var index = 0; index < string.length; index++) {
            dataView.setUint8(index + 1 + offset, string.charCodeAt(index));
        }




    }


};

Flare.Buffer.prototype.constructor = Flare.FlareMessage;





