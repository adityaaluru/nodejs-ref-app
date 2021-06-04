const express = require('express');
const config = require('config');

const PORT = 3000;

//Load express routers
const books = require('./routers/books');

//utilify this debug as a framework - 
//get a common logger with info, error, warn methods and automatically add the filename of the JS file
const debug = require('debug');
debug.enable('*');
const info = debug('info').extend('index');
const error = debug('error').extend('index'); 
const warn = debug('warn').extend('index');


//Configure Express and its JSON middleware
const app = express();
app.use(express.json()); //required middleware for POST calls
//app.use(express.urlencoded({extended: true})); // for URL encoded payloads converted to JSON

//Change this later for an extensive access logging - that includes headers, payload as necessary
if(config.has('config.enableAccessLogs') && config.get('config.enableAccessLogs')){
    const morgan = require('morgan');
    app.use(morgan('common'));
    info('Enabled access logs...');
}

//Configure static file hosting
if(config.has('config.static.enabled') && config.get('config.static.enabled')){
    if(config.has('config.static.path')){
        app.use(express.static(config.get('config.static.path')));
    } else {
        app.use(express.static('./static'));
    }
    info('Enabled middleware for static files...');
}

//Configure templating engine
if(config.has('config.enableViewTemplates') && config.get('config.enableViewTemplates')){
    const mustacheExpress = require('mustache-express');
    app.engine('mst', mustacheExpress());
    app.set('view engine', 'mst');
    app.set('views', __dirname + '/views');
    info('Enabled views...');

    //Configure a sample view
    app.get('/views/sample-view',function(request,response){
        response.render('sample-view',{subject: request.query.sub});
    });
}


//Configure default route
app.get('/',function(request,response){
    response.redirect('/index.html');
});

//Configure various route handles
app.use('/books',books);

//Start the app
app.listen(PORT, function(){
    console.log('Server listening on port '+ PORT);
});
