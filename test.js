const express = require('express');
const config = require('config');
const logModule = require('./common/logger.js');

const app = express();
const PORT = 3000;

logger = new logModule.Logger('o.test',config.get('config.log'));
logger.info('testing log');

app.use(logModule.expressLogger(config.get('config.log')))

app.get('/',function(request,response){
    response.status(404).send('test ground!');
});

//Start the app
app.listen(PORT, function(){
    console.log('Server listening on port '+ PORT);
});

