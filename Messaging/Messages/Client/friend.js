var ByteStream = require("../../../DataStream/ByteStream");

module.exports = class {
    constructor() {
        this.ByteStream = new ByteStream();
    }
    encode(h,l) {
        this.ByteStream.writeInt(h); // high
        this.ByteStream.writeInt(l); // low
        this.ByteStream.writeInt(2);
        this.ByteStream.writeInt(0);
        
    }
}
