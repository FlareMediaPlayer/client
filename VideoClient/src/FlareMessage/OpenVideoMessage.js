
Flare.OpenVideoMessage = function () {

    Flare.FlareMessage.call(this);//Inherit from flaremessage

    this.flareOpCode = Flare.OpCode.OPEN_VIDEO;

    this.requestFile = "";

    return this;



};

Flare.OpenVideoMessage.prototype = Object.create(Flare.FlareMessage.prototype);
Flare.OpenVideoMessage.prototype.constructor = Flare.OpenVideoMessage;



Flare.OpenVideoMessage.prototype.setRequestFile = function (requestFile) {

    this.requestFile = requestFile;

};

Flare.OpenVideoMessage.prototype.toBinary = function () {

    this.dataLength = this.requestFile.length + 1;
    this.totalMessageLength = this.dataLength + this.headerLength;

    var data = new ArrayBuffer(this.totalMessageLength);
    var dataView = new DataView(data);





    dataView.setInt8(0, (this.flareOpCode & 0xff));//Set The Op Code
    dataView.setInt32(1, (this.totalMessageLength & 0xffffffff));//Set The Op Code

    this.addStringToBinary(dataView, this.headerLength, this.requestFile); // add the request string
    
    /*
    //For testing what the byte array looks like
    for(var test = 0; test < this.totalMessageLength; test++){
        console.log("byte Number :" + test + "  : "+ dataView.getUint8(test));
    }
    */


    return data;


};








