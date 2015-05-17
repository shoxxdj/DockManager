//Docker Servers
var devices=['localhost'];
var port="31337";

//Server
var express = require('express');
var app= express();

//Cmd execution
require('shelljs/global');

//HTTP requests
var request=require('request');
//HTTP requests json
var requestJson = require('request-json');
// Ajouter ca dans la vue concernée var client = request.createClient('http://addresse:port/');

//Async 
var async = require("async");

//Body Parser
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

 
app.use(express.static(__dirname+'/public'));


app.get('/',function(req,res){
	res.render('index.ejs');
});
app.get('/images',function(req,res){
	res.render('images.ejs');
});


//Index Page
app.get('/basicInfo',function(req,res){
	running_images=[];
	async.each(devices, //Arry to loop
		function(item,callback) // To do for each item in array
		{
			console.log(item);
			request('http://'+item+':'+port+'/containers/json?all=0&size=1',function(error,response,body)
			{
				if(!error && response.statusCode==200)
				{
					running_images.push(item);
					running_images.push(JSON.parse(body));
					callback(); // ne pas oublier !
				}
				else
				{
					callback();
				}
			});
		},
		function(err) // une fois que tout est finit faire : 
		{
			console.log("all done");
			console.log(running_images);
			res.render('basicInfo.ejs',{res:running_images});
		});

});
//Images Page
app.get('/runnableImages',function(req,res){
	runnable_images=[];
	async.each(devices,
		function(item,callback)
		{
			console.log(item);
			request('http://'+item+':'+port+'/images/json?all=0',function(error,response,body)
			{
				if(!error && response.statusCode==200)
				{
					runnable_images.push(item);
					runnable_images.push(JSON.parse(body));
					callback(); // ne pas oublier !
				}
				else
				{
					callback();
				}
			});
		},
		function(err)
		{
			console.log("all done");
			console.log(runnable_images);
			res.render('runnableImages.ejs',{res:runnable_images});
		}
		);
});

app.post('/images/:ip/:image/create',function(req,res){
	if(req.body.cmd!="")
	{
		var adresse=req.params.ip;
		var cmd=req.body.cmd;
		console.log(cmd);
		var image=req.params.image;
//		var mac = req.params.mac;
		var data = {
			"Hostname":"",
			"User":"",
	     	"Memory":0,
	     	"MemorySwap":0,
	     	"AttachStdin":true,
	     	"AttachStdout":true,
	     	"AttachStderr":true,
	     	"PortSpecs":null,
	     	"Privileged": false,
	     	"Tty":true,
	     	"OpenStdin":true,
	     	"StdinOnce":false,
	     	"Env":null,
	     	"Dns":null,
	     	"Image":image,
	     	"Volumes":{},
	     	"VolumesFrom":"",
	     	"WorkingDir":"",
	     	"Cmd":cmd
		}

		var client = requestJson.createClient('http://'+adresse+':'+port+'/');
		client.post('containers/create', data, function(err, response, body) {
		  if(response.statusCode==201)
		  {
		  	id=response.body.Id;
			console.log(id);
		  	client.post('containers/'+id+'/start',null,function(err,rep,body)
			{
				console.log(rep.statusCode);
				if(rep.statusCode==204)
				{
					res.end("success");
				}
				else
				{
					res.end("error");
				}
			});
		  }
		});
	}
	else
	{
		res.end("error");
	}
});

app.post('/images/:ip/:image/create/network',function(req,res){
	if(req.body.cmd!="")
	{
		var adresse=req.params.ip;
		var cmd=req.body.cmd;
		console.log(cmd);
		var image=req.params.image;
		var mac = req.body.mac;
		var exposedport = req.body.exposed;
		var bindings = req.body.bindings;

//		exposedport = Type.string(exposedport);
//		exposedport = JSON.stringify(exposedport);
		exposedport = JSON.parse(exposedport); //TRANSFORM AS OBJ
		exposedport = JSON.parse(exposedport);
		console.log(exposedport);
//		bindings = Type.string(bindings);
//		bindings = JSON.stringify(bindings);
		bindings = JSON.parse(bindings); //TRANSFORM AS OBJ
		bindings = JSON.parse(bindings);
		console.log(bindings);

		var data = {
			"Hostname":"",
			"User":"",
	     	"Memory":0,
	     	"MemorySwap":0,
	     	"AttachStdin":true,
	     	"AttachStdout":true,
	     	"AttachStderr":true,
	     	"PortSpecs":null,
	     	"Privileged": false,
	     	"Tty":true,
	     	"OpenStdin":true,
	     	"StdinOnce":false,
	     	"Env":null,
	     	"Dns":null,
	     	"Image":image,
	     	"Volumes":{},
	     	"VolumesFrom":"",
	     	"WorkingDir":"",
	     	"NetworkDisabled": false,

	     	"MacAddress": "", 
	     	"ExposedPorts": exposedport,
	     	"HostConfig": {
	     		"NetworkMode": "bridge",
	     		"PortBindings": bindings,
	     		"PublishAllPorts": false,
	     		"LxcConf":[]
	     	},
	     	"Cmd":cmd
		}
		console.log(data);
		var client = requestJson.createClient('http://'+adresse+':'+port+'/');
		client.post('containers/create', data, function(err, response, body) {
		  if(response.statusCode==201)
		  {
		  	id=response.body.Id;
			console.log(id);
		  	client.post('containers/'+id+'/start',null,function(err,rep,body)
			{
				console.log(rep.statusCode);
				if(rep.statusCode==204)
				{
					res.end("success");
				}
				else
				{
					console.log(body);
					res.end("error");
				}
			});
		  }
		});
	}
	else
	{
		res.end("error");
	}
});






//Containers Page
app.get('/containers',function(req,res){
	containers=[];
	async.each(devices, //Arry to loop
		function(item,callback) // To do for each item in array
		{
			console.log(item);
			request('http://'+item+':'+port+'/containers/json?all=1&size=1&limit=1',function(error,response,body)
			{
				if(!error && response.statusCode==200)
				{
					console.log("recu");
					containers.push(item);
					containers.push(JSON.parse(body));
					callback(); // ne pas oublier !
				}
				else
				{
					callback();
				}
			});
		},
		function(err) // une fois que tout est finit faire : 
		{
			console.log("all done");
			console.log(containers);
			res.render('containers.ejs',{res:containers});
		});
});

//Detail Page
app.get('/details/:address/:id',function(req,res){
	if(devices.indexOf(req.params.address)>-1 && req.params.id!="")
	{
		id=req.params.id;
		address=req.params.address;
		request('http://'+address+':'+port+'/containers/'+id+'/json',function(error,response,body)
		{
			if(!error && response.statusCode==200)
			{
				console.log(JSON.parse(body));
				res.render('details.ejs',{res:JSON.parse(body),ip:address,id:id});
			}
			else
			{
				res.render('error.ejs');
			}
		});
	}
	else
	{
		res.render('error.ejs');
	}
});

app.get('/process/:address/:id',function(req,res){
	if(devices.indexOf(req.params.address)>-1 && req.params.id!="")
	{
		id=req.params.id;
		address=req.params.address;
		request('http://'+address+':'+port+'/containers/'+id+'/top',function(error,response,body)
		{
			if(!error && response.statusCode==200)
			{
				console.log(JSON.parse(body));
				res.render('process.ejs',{res:JSON.parse(body)});
			}
			else
			{
				res.render('error.ejs');
			}
		});
	}
	else
	{
		res.render('error.ejs');
	}
});

// Run Server ! 
var server= app.listen(3000,function(){
	var host = server.address().address;
	var port = server.address().port;
});
