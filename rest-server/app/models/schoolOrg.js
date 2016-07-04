var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var StaffSchema   = new Schema({
    firstName: String,
    lastName: String,
    active: Boolean,
    school: String,
    title: String,
    addedDate: Date,
    lastModifiedDate: Date,
    email: String,
    website: String,
    personalPageExtras: String

});

module.exports = mongoose.model('StaffMember', StaffSchema);