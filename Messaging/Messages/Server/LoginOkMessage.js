var ByteStream = require("../../../DataStream/ByteStream");

module.exports = class {
    constructor(wws) {
        this.ByteStream = new ByteStream();
        this.wws = wws;
    }
    decode() {}
    process(messaging) {
    	if (this.wws == 1) {
            messaging.sendFriend();
        } else if (this.wws == 2) {
            messaging.sendSpectate();
        }
    }
}

module.exports.getMessageType = () => 20104;
