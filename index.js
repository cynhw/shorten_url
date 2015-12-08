
var express = require('express'),
	bodyParser = require('body-parser'),
	db = require('./models'),
	app = express(),
	Hashids = require("hashids"),
	hashids = new Hashids("url-shortner"),
	ejsLayouts = require("express-ejs-layouts");
	//id = hashids.encode(12345);
	//console.log(id);

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/static'));
app.use(ejsLayouts);



app.get('/', function(req, res) {
	res.render('index');
});

// POST : /show (Create Link)
// Accepts data from the form. Stores the url in the database and redirects to the show route.



app.post('/', function(req, res) {
	var userURL = {url: req.body.url};
	db.links.create(userURL).then(function(link) {
		link.hash = hashids.encode(link.id);
		link.save().then(function(shortURL) {
			res.redirect('/show/' + shortURL.id);
		});

	});

});

app.get('/show/:id', function(req, res) {

	var stuff = parseInt(req.params.id);
	db.links.find({ where: {id: stuff}}).then(function(link){
	console.log('this is the show promise');
	console.log(link)
		res.render('show', {link:link});
	});
});

app.get('/:hash', function(req,res){
	var hashId = req.params.hash;

	db.links.find({where: {hash: hashId}}).then(function(link){
		res.redirect(link.url);
	})
});




// Get links/hash (Redirects Link)
// Takes a hash and redirects the user to the url stored in the database


app.listen(process.env.PORT || 3000);
// console.log('( ˘︹˘ )');