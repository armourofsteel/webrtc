var express = require('express.io');
var app = express();

//when io is added
app.http().io();
var PORT = 3000;
console.log('server started on  port: ' + PORT);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
	res.render('index.ejs');
});


//To get the new user information and broadcast some details:
app.io.route('ready', function(req){
	req.io.join(req.data.chat_room)
	req.io.join(req.data.signal_room)
	app.io.room(req.data).broadcast('announce', {
		message: 'New client in the ' + req.data + ' room.'
	});
})

//To handle the submit button action 
app.io.route('send', function(req){
	app.io.room(req.data.room).broadcast('message', {
		message: req.data.message,
		author: req.data.author
	});
})

//To implement signaling
app.io.route('signal', function(req){
	req.io.room(req.data.room).broadcast('signaling_message',{
		type: req.data.type,
		message: req.data.message
	});
})

app.listen(PORT);