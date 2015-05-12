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
//Async 
var async = require("async");
 
app.use(express.static(__dirname+'/public'));


app.get('/',function(req,res){
	res.render('index.ejs');
});

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
				res.render('details.ejs',{res:JSON.parse(body)});
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



app.get('/version',function(req,res){
	request('http://192.168.1.22:31337/version',function(error,response,body)
	{
		if(!error && response.statusCode==200){
			res.render('version.ejs',{res:devices})
		}
	})
});




app.get('/status/:id',function(req,res){
	if(req.params.id != '')
		{
			id = req.params.id;
			status = exec("docker inspect "+id).output;
			res.render('stats.ejs',{res:JSON.parse(status)});
		}
});


var server= app.listen(3000,function(){
	var host = server.address().address;
	var port = server.address().port;
});
