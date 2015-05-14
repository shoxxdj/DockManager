//Docker Servers
var devices=['localhost','192.168.1.22'];
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

app.get('/images/:ip/:id',function(req,res){
	request('')
});

//Contnairs Page

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
