const express = require('express');
const books = require('./routers/books');
const config = require('config');
const morgan = require('morgan');

//utilify this debug as a framework - 
//get a common logger with info, error, warn methods and automatically add the filename of the JS file
const debug = require('debug');
debug.enable('*');
const info = debug('info').extend('index');
const error = debug('error').extend('index'); 
const warn = debug('warn').extend('index');

const port = 3000;


//Configure Express and its JSON middleware
const app = express();
app.use(express.json()); //required middleware for POST calls
//app.use(express.urlencoded({extended: true})); // for URL encoded payloads converted to JSON

//Configure static file hosting
if(config.has('config.static.enabled') && config.get('config.static.enabled')){
    if(config.has('config.static.path')){
        app.use(express.static(config.get('config.static.path')));
    } else {
        app.use(express.static('./static'));
    }
    info('Enabled middleware for static files...');
}

//Change this later for an extensive access logging - that includes headers, payload as necessary
if(config.has('config.enableAccessLogs') && config.has('config.enableAccessLogs')){
    app.use(morgan('common'));
    info('Enabled access logs...');
}

//Configure various route handles
app.use('/books',books);

//Create a template based hello world - use the app name from config
app.get('/',function(request,response){
    response.send('Hello World!');
});

app.listen(port, function(){
    console.log('Server listening on port '+ port);
});

//if the environment variable NODE_ENV is not set, then default is given as development
//console.log(`NODE_ENV (app): ${app.get('env')}`);
