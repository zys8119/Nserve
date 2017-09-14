/**
 * @依赖包*/
const command = require("ncommand");
const Nserve = require("../index");
var version = require("../package.json").version;

const newCommand = new command();
const newNserve = new Nserve();
newCommand
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