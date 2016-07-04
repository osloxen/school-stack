var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var IoTDeviceSchema   = new Schema({
	name: String,
    available: Boolean,
    deviceType: String,
    sensors: [],
    creationDate: Date,
    lastModifiedDate: Date,
    loanedTo: String,
    npmInstall: [],
    config: String

});

module.exports = mongoose.model('InternetThing', IoTDeviceSchema);