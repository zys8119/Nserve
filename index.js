/**
 * @变量
 */
const command = require("ncommand");
const newCommand = new command();
var version = require("./package.json").version;
var http = require("http");
var fs = require("fs");
var path = require("path");
const process = require("process");
var projectPathUrl = process.cwd().replace(/\\/img,"\/");
/**
 * Nserve快速搭建服务工具 by 张云山 on 2017/9/12 0012.
 */
const Nserve = function (option) {
    option = option || {};

};
Nserve.prototype = {
    /**
     * @创建服务
     * @param port
     * @param home
     */
    server:function (port=3000,home=projectPathUrl) {
        var _this = this;
        var server = http.createServer(function(req,res){
            res.writeHead(200, {'Content-type' : 'text/html; charset=utf-8'});
            var fileName  = home + req.url;
            newCommand.console.warn("被请求资源："+req.url);
            fs.readFile( fileName, 'utf8',function( err, data ){
                if( err ){
                    if(req.url == "/") {
                        _this.readdirStat(fileName,function (files) {
                            res.write(`<h1>目录列表</h1><hr>`);
                            for(var i = 0 ; i < files.length ; i++){
                                res.write(`<a href="/${files[i]}" style="display: block;">${files[i]}</a>`);
                            }
                            res.end();
                        });
                    }else {
                        if(fs.existsSync(fileName)){
                            _this.readdirStat(fileName,function (files) {
                                res.write(`<h1>目录列表</h1>`);
                                res.write(`<span>当前URL：【${req.url}】</span>`);
                                console.log(req.url.replace(/\/.*/,""))
                                console.log(path.resolve("."+req.url,"."+req.url))
                                console.log("================================")
                                res.write(`<a href="${path.resolve("./"+req.url,"..")}" style="margin-left: 50px;">返回上一级</a><a href="/" style="margin-left: 50px;">返回首页</a>`);
                                res.write(`<hr>`);
                                for(var i = 0 ; i < files.length ; i++){
                                    res.write(`<a href="${req.url}/${files[i]}" style="display: block;">${files[i]}</a>`);
                                }
                                res.end();
                            });
                        }else {
                            res.write('404');
                            res.end();
                        }
                    }
                }else {
                    res.write(data);
                    res.end();
                }
            })
        });
        server.listen(port,null,function () {
            newCommand.console.info(`Server running at http://127.0.0.1:${port}/`);
        });
        return this;
    },
    /**
     * @文件目录读取异步转同步
     *
     * //==================目录路径
     * //默认为当前执行目录
     * @param {String} path
     *
     * //==================配置，编码等
     * //默认为Utf8编码
     * @param {Object} option
     *
     * //============================readdirStat成功回调
     * 例如：callback(files) files 是文件目录的列表文件Array，承接上下文
     * @param {function} callback
     *
     * @return this 上下文
     */
    readdirStat:function (path,option,callback) {
        path = path || projectPathUrl;
        option = option || {encoding:"utf8"};
        callback = callback || new Function;
        var _this = this;
        var directoryArr = [];
        //数据验证
        switch (callback.constructor.name){
            case "Function":
                callback = callback;
                break;
            default:
                newCommand.ERR(`Nserve对象的readdirStat方法的callback参数类型错误。应该是个Function，当前是${callback.constructor.name}`);
                break;
        }
        switch (option.constructor.name){
            case "Function":
                callback = option;
                option = {encoding:"utf8"};
                break;
            case "Object":
                option = option;
                if(!option.encoding){
                    option.encoding = "utf8";
                };
                if(option.encoding.constructor.name != "String"){
                    newCommand.ERR(`Nserve对象的readdirStat方法的option.encoding参数类型错误。应该是个String，当前是${option.encoding.constructor.name}`);
                };
                break;
            default:
                newCommand.ERR(`Nserve对象的readdirStat方法的option参数类型错误。应该是个Object，当前是${option.constructor.name}`);
                break;
        }
        switch (path.constructor.name){
            case "Function":
                callback = path;
                path = projectPathUrl;
                break;
            case "Object":
                option = path;
                path = projectPathUrl;
                break;
            case "String":
                path = path;
                break;
            default:
                newCommand.ERR(`Nserve对象的readdirStat方法的path参数类型错误。应该是个String，当前是${path.constructor.name}`);
                break;
        }
        fs.readdir(path,option, function(err,files){
            if (err) {
                console.log(err);
                return;
            };
            (function iterator(i){
                if(i == files.length) {
                    callback.call(_this,files);
                } else {
                    fs.stat(path + "/" + files[i], function(err,data){
                        if(err) throw err;
                        if(data.isDirectory()) {
                            directoryArr.push(files[i]);
                        }
                        iterator(i+1);
                    });
                }
            })(0);
        });
        return this;
    }
}
module.exports = Nserve;