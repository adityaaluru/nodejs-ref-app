/// Use the debug as an internal framework
//provision for log level as a separate dimension than debug's namespace
var path = require('path');
var filename = path.basename(__filename);
console.log(filename);

function log(req,res,next){
    console.log("Request Logging...");
    next();
    console.log("Response Logging...");
}

module.exports = log;