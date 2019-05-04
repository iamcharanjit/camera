var express = require('express');
var cors = require('cors');
var bodyparser = require('body-parser');
var mongoose = require('mongoose');

var mongojs = require('mongojs');

var fs = require('fs');

var config = require('./global/config');

var galleryModel = require('./model/galleryModel');


var app = express();
app.use(cors());
app.use(bodyparser.urlencoded({extended:true}));
app.use(bodyparser.json());
app.use(express.static('public'));

//mongoose.connect(config.database, {useNewUrlParser:true});
mongodb:<dbuser>:<dbpassword>@ds161183.mlab.com:61183/amazonweb
mongoose.connect('mongodb://amazonwebuser:password123@ds161183.mlab.com:61183/amazonweb', { useNewUrlParser:true});


var port = process.env.PORT || 3000;
app.listen(port, ()=>{ console.log('You are at port number '+ port) } );

app.get('/getdata', function(req, res){
	res.send('got it');
})

app.get('/postdata', function(req, res){
	var data = {
		imageName : "a"
	}

	var galleyObject = new galleryModel(data);
	galleyObject.save(data, function(error, result){
		if(error) {
			console.log(error);
		} else {
			console.log(result);
		}
	})

})

app.post('/postPhoto', function (req, res) {
	// body...
	console.log(req.body);
	//console.log(req.body.filename);
    var dateTime = Date.now();
	var filename = "./public/gallery/"+dateTime+'_'+req.body.blob[0].filename;
	console.log(filename);
	var blobdata = req.body.blob[0].blobdata.split(',')[1];
	console.log(blobdata);
	fs.writeFile(filename, blobdata,'base64',function(err){
		if(err) {
			return console.log(err);
		} else {
			
			/***************** Save FileName ******************/
				var data = {
					imageName : dateTime+'_'+req.body.blob[0].filename
				}

				var galleyObject = new galleryModel(data);
				galleyObject.save(data, function(error, result){
					if(error) {
						console.log(error);
					} else {
						console.log(result);
						console.log('File Saved');
						res.send({result:'File Saved'});
					}
				})
			/*************************************************/
		}

	})	
	
})

app.get('/getGallery', function(req, res){
	galleryModel.find({}, function(error, result){
		if(error) {
			console.log(error);
		} else {
			res.send({result:result})
		}
	})
})

app.delete('/deletePhoto/:id', function(req, res){
	
	//console.log(req.params.id);
    //res.send(req.params.id);

    /*   mehohod 1 
    collectionModel.findByIdAndRemove(mongojs.ObjectId(req.params.id), function(err, result){
    	if(err) {console.log('delete error');res.send(err)}
    	res.send(result);
    })
    */
    var id = req.params.id;
    console.log(id);
    galleryModel.find({"_id": mongojs.ObjectId(id)}, function(error, result){
		if(error) {
			console.log(error);
		} else {
			console.log(result[0].imageName);
			
			fs.unlink("./public/gallery/"+result[0].imageName,function(err){
	        if(err) return console.log(err);
		        console.log('file deleted successfully');
		   	});
		}
	})
    galleryModel.findByIdAndRemove({"_id": mongojs.ObjectId(id)}, function(err, result){
    	if(err) {
    		return res.status(400).send({message:err.message})
    	}
    	res.send({success:result, message:'your data delete'})
    } )

})