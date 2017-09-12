/**
 * @依赖包*/
const command = require("ncommand");
/**
 * @变量
 */
var version = require("./package.json").version;
var http = require("http");
var fs = require("fs");
const process = require("process");
/**
 * Nserve快速搭建服务 by 张云山 on 2017/9/12 0012.
 */
const Nserve = function () {

};
Nserve.prototype = {
    /**
     * @创建服务
     * @param port
     * @param home
     */
    server:function (port=3000,home='./') {
        var _this = this;
        _this.readDirList(home,function (fileList) {
            var server = http.createServer(function( req, res ){
                var fileName  = home + req.url;
                fs.readFile( fileName, function( err, data ){
                    if( err ){
                        if(req.url == "/"){
                            res.write(`<h1>目录列表</h1><hr>`);
                            for(var i = 0 ; i < fileList.length ; i++){
                                res.write(`<a href="/${fileList[i]}" style="display: block;">${fileList[i]}</a>`);
                            }
                            res.end();
                        }else {
                            res.write('404');
                        }
                    }else {
                        res.write( data );
                    }
                    res.end();
                } );
            }).listen( 3000 );
        });
        return this;
    },
    /**
     * @获取目录下面的文件列表
     * @param {String} home
     * @param {function} callback
     */
    readDirList:function (home='./',callback = new Function) {
        var _this = this;
        fs.readdir(home,function(err,files) {
            if (err) {
                console.log(err);
                return;
            };
            callback.call(_this,files);
        });
        return this;
    }
}
const newNserve = new Nserve();
new command()
    .Commands({
        log:["-c","创建一个服务,默认是当前执行命令的路径,如果需要指定服务路径，请使用【-p】命令，端口为3000,如果需要指定端口，请使用【-s】命令"],
        callback:function () {
            newNserve.server();
            this.init(null,Function);
            return true;
        }
    })
    .Commands({
        log:["-s","...warn('<port>')","一个端口，创建一个指定的端口服务"],
        callback:function () {

        }
    })
    .Commands({
        log:["-p","...warn('<PathUrl>')","一个路径，指定需创建服务的文件路径"],
        callback:function () {

        }
    })
    .Options({
        log:["help","查看帮助命令"]
    })
    .Options({
        log:["-h","查看帮助命令"]
    })
    .Options({
        log:["-v","查看版本号"],
        callback:function () {
            console.log(version);
        }
    })
    .Options({
        log:["--version","查看版本号"],
        callback:function () {
            console.log(version);
        }
    })
    .init(null,Function);
