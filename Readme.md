# DockManager 0.1

DockManager is a simple web application to manage multiple docker servers
It's written in NodeJS, using Express. 

###How does it works ? 

DockManager is using the Docker API.
You just have to enable the remote connection from this server to your docker daemon

Something like :
```sh
$ docker -d -H 10.10.10.10:31337 #enable remote connection from 10.10.10.10 to Elite Port
```

###Stil in development ! 
To Do list : 
* Port binding in image creation
* DockerFile Uplaod
* Stop containers
* Restart containers
* Enable TLS security
* ....


>Booh your code sucks ! 

I didn't find any project that was doing this as I want it. So I made it. We live in an open source world, so if you think you can improve it 
do it and pull request ! 
>It doesn't work 

Let's talk about it in the Issues

### Tech
* NodeJs
* Express
* Request
* Request-json
* Jquery
* Twitter Bootstrap 

### Installation

```sh
$ git clone https://github.com/shoxxdj/DockManager.git Dockmanager
$ cd Dockmanager
$ npm install
$ node app.js
```

Edit the configuration.js file.
Foreach docker server that you want to manage add it to the devices array.
Set the port that your dockers are listening to in the port variable.
And just run the app.js !

To use the web application please use a Javascript enabled Web browser. 
We are in 2015 it's time to escape from Internet Explorer. 

**Free Software, Hell Yeah!**

