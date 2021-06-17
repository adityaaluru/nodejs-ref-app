const date = require('date-and-time');
const os = require('os');
const process = require('process');

let Logger = class  {
    constructor(logPkg,config) {
        this.logPkg = logPkg;
        this.exceptions = config.exceptions;
        this.logFormat = config.format;
        this.hostname = os.hostname();

        switch(config.rootLevel){
            case 'DEBUG':
                this.allowDebug = true;
                this.allowInfo = true;
                this.allowWarn = true;
                this.allowError = true;
                break;
            case 'INFO':
                this.allowDebug = false;
                this.allowInfo = true;
                this.allowWarn = true;
                this.allowError = true;
                break;
            case 'WARN':
                this.allowDebug = false;
                this.allowInfo = false;
                this.allowWarn = true;
                this.allowError = true;
                break;
            case 'ERROR':
                this.allowDebug = false;
                this.allowInfo = false;
                this.allowWarn = false;
                this.allowError = true;
                break;
            default:
                this.allowDebug = false;
                this.allowInfo = false;
                this.allowWarn = false;
                this.allowError = false;
        }
    }
    debug(msg) {
        if(this.allowDebug || isAllowedThroughException('DEBUG',this.logPkg,this.exceptions)){
            if(this.logFormat === 'json'){
                msg = JSON.stringify(this.getLogObject('DEBUG',msg));
            } else {
                msg = this.getLogLine('DEBUG',msg);
            }
            console.log(msg);
        }
    }
    info(msg) {
        if(this.allowInfo || isAllowedThroughException('INFO',this.logPkg,this.exceptions)){
            if(this.logFormat === 'json'){
                msg = JSON.stringify(this.getLogObject('INFO',msg));
            } else {
                msg = this.getLogLine('INFO',msg);
            }
            console.log(msg);
        }
    }
    warn(msg) {
        if(this.allowWarn || isAllowedThroughException('WARN',this.logPkg,this.exceptions)){
            if(this.logFormat === 'json'){
                msg = JSON.stringify(this.getLogObject('WARN',msg));
            } else {
                msg = this.getLogLine('WARN',msg);
            }
            console.log(msg);
        }
    }
    error(msg) {
        if(this.allowError || isAllowedThroughException('ERROR',this.logPkg,this.exceptions)){
            if(this.logFormat === 'json'){
                msg = JSON.stringify(this.getLogObject('ERROR',msg));
            } else {
                msg = this.getLogLine('ERROR',msg);
            }
            console.log(msg);
        }
    }
    getLogLine(logLevel, msg) {
        var timestamp = getCurrentTimestamp();
        return timestamp+" "+this.hostname+" "+process.pid+" "+logLevel+" "+this.logPkg+" "+msg;
    }
    getLogObject(logLevel, msg) {
        var logObject = {};
        logObject.timestamp = getCurrentTimestamp();
        logObject.hostname = this.hostname;
        logObject.pid = process.pid;
        logObject.level = logLevel;
        logObject.pkg = this.logPkg;
        logObject.msg = msg;
        return logObject;
    }
};

function expressLogger(config) {
    return function(req,res,next) {
        if(config.format === 'json') {
            var logObject = {};
            logObject.url = req.url;
            logObject.remoteip = req.ip;
            logObject.hostname = req.hostname;
            logObject.method = req.method;
            logObject.protocol = req.protocol;
            logObject.type = 'SYSLOG';
            if(config.express.logReqHeaders){
                logObject.reqHeaders = req.Header
            }
            switch(config.express.logType){
                case 'accessonly':
                    logObject.timestamp = getCurrentTimestamp();
                    logObject.msg = "Express Middlware Log - Access";
                    console.log(JSON.stringify(logObject));
                    next();
                    break;
                case 'roundtrip':
                    logObject.msg = "Express Middlware Log - Round Trip";
                    var startTime = Date.now();
                    next();
                    logObject.timestamp = getCurrentTimestamp();
                    var endTime = Date.now();
                    if(config.express.logResHeaders){
                        logObject.resHeaders = res.getHeaders();
                    }
                    logObject.statusCode = res.statusCode;
                    if(config.express.logLocals){
                        logObject.locals = res.locals;
                    }
                    logObject.startTime = startTime;
                    logObject.responseTime = (endTime - startTime);
                    console.log(JSON.stringify(logObject));
                    break;
                case 'req-and-res':
                    logObject.timestamp = getCurrentTimestamp();
                    logObject.msg = "Express Middlware Log - Request Log";
                    console.log(JSON.stringify(logObject));
                    var startTime = Date.now();
                    next();
                    logObject.timestamp = getCurrentTimestamp();
                    logObject.msg = "Express Middlware Log - Response Log";
                    var endTime = Date.now();
                    if(config.express.logResHeaders){
                        logObject.resHeaders = res.getHeaders();
                    }
                    logObject.statusCode = res.statusCode;
                    if(config.express.logLocals){
                        logObject.locals = res.locals;
                    }
                    logObject.responseTime = (endTime - startTime);
                    console.log(JSON.stringify(logObject));
                    break;
            }
        }
    }
}
function getCurrentTimestamp() {
    return date.format(new Date(),'YYYY-MM-DDTHH:mm:ss.SSSZ');
}

function isAllowedThroughException(logLevel,logPkg,exceptions) {
    for(var i=0;i<exceptions.length;i++){
        if(logPkg.match(exceptions[i].package)){
            if(logLevel === exceptions[i].logLevel){
                return true;
            }
        }
    }
    return false;
}
module.exports.Logger = Logger;
module.exports.expressLogger = expressLogger;