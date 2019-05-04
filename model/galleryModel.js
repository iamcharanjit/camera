var mongoose = require('mongoose');

var schema = mongoose.Schema({
	imageName:String,
	createdTime:{type:String, default:new Date()}
})

module.exports = mongoose.model('gallery', schema);

