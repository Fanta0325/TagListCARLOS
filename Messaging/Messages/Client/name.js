var ByteStream = require("../../../DataStream/ByteStream");

module.exports = class {
    constructor() {
        this.ByteStream = new ByteStream();
    }
    encode(name) {
        this.ByteStream.writeString("dsc.gg/kithackk"); //ğ
        this.ByteStream.writeVInt(1);
        
    }
}