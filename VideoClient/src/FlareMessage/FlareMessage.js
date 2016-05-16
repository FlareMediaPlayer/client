/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


Flare.FlareMessage = function(){
    this.flareOpCode; //1 byte
    
    this.totalMessageLength; //int
    this.dataLength; // int
    
    this.headerLength = 5;
 
    return this;
};

Flare.FlareMessage.prototype = {
    
    addStringToBinary : function(dataView , offset, string){
        
        dataView.setUint8(offset , (string.length & 0xff));//Add The length of string
   
        for(var index = 0; index < string.length; index ++){
            dataView.setUint8(index + 1 + offset , string.charCodeAt(index));
        }
        
        
        
        
    }
  
    
};

Flare.Buffer.prototype.constructor = Flare.FlareMessage;



    

