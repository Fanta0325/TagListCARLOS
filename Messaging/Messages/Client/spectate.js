var ByteStream = require("../../../DataStream/ByteStream");

module.exports = class {
    constructor() {
        this.ByteStream = new ByteStream();
    }
    encode(h,l) {
        this.ByteStream.writeInt(h);
        this.ByteStream.writeInt(l);
        this.ByteStream.writeByte(1);
        
    }
}
