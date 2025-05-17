var ByteStream = require("../../../DataStream/ByteStream");

module.exports = class {
    constructor() {
        this.ByteStream = new ByteStream();
    }
    encode() {
        this.ByteStream.writeInt(3); // protocol version
        this.ByteStream.writeInt(60); // crypto version
        this.ByteStream.writeInt(61); // major version
        this.ByteStream.writeInt(1); // build version
        this.ByteStream.writeInt(301); // minor version
        this.ByteStream.writeString("85930979c0ff747dbf97a5f0e8717efa12ff0b58"); // master hash
        this.ByteStream.writeInt(0);
        this.ByteStream.writeInt(0);
    }
}