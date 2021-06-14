let Logger = class  {
    constructor(logPkg,config) {
        this.logPkg = logPkg;
        this.exceptions = config.exceptions;

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
            console.log("DEBUG: "+msg);
        }
    }
    info(msg) {
        if(this.allowInfo || isAllowedThroughException('INFO',this.logPkg,this.exceptions)){
            console.log("INFO: "+msg);
        }
    }
    warn(msg) {
        if(this.allowWarn || isAllowedThroughException('WARN',this.logPkg,this.exceptions)){
            console.log("WARN: "+msg);
        }
    }
    error(msg) {
        if(this.allowError || isAllowedThroughException('ERROR',this.logPkg,this.exceptions)){
            console.log("ERROR: "+msg);
        }
    }
};
let isAllowedThroughException = function(logLevel,logPkg,exceptions){
    for(var i=0;i<exceptions.length;i++){
        if(logPkg.match(exceptions[i].package)){
            if(logLevel === exceptions[i].logLevel){
                return true;
            }
        }
    }
    return false;
}
module.exports = Logger;