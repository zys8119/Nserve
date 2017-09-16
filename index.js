#!/usr/bin/env node
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
    //文件的mineType类型，可扩展
    this.mimeTypeList = {"png":"image/png","323":"text/h323","扩展名":"类型/子类型","&nbsp;":"application/octet-stream","acx":"application/internet-property-stream","ai":"application/postscript","aif":"audio/x-aiff","aifc":"audio/x-aiff","aiff":"audio/x-aiff","asf":"video/x-ms-asf","asr":"video/x-ms-asf","asx":"video/x-ms-asf","au":"audio/basic","avi":"video/x-msvideo","axs":"application/olescript","bas":"text/plain","bcpio":"application/x-bcpio","bin":"application/octet-stream","bmp":"image/bmp","c":"text/plain","cat":"application/vnd.ms-pkiseccat","cdf":"application/x-cdf","cer":"application/x-x509-ca-cert","class":"application/octet-stream","clp":"application/x-msclip","cmx":"image/x-cmx","cod":"image/cis-cod","cpio":"application/x-cpio","crd":"application/x-mscardfile","crl":"application/pkix-crl","crt":"application/x-x509-ca-cert","csh":"application/x-csh","css":"text/css","dcr":"application/x-director","der":"application/x-x509-ca-cert","dir":"application/x-director","dll":"application/x-msdownload","dms":"application/octet-stream","doc":"application/msword","dot":"application/msword","dvi":"application/x-dvi","dxr":"application/x-director","eps":"application/postscript","etx":"text/x-setext","evy":"application/envoy","exe":"application/octet-stream","fif":"application/fractals","flr":"x-world/x-vrml","gif":"image/gif","gtar":"application/x-gtar","gz":"application/x-gzip","h":"text/plain","hdf":"application/x-hdf","hlp":"application/winhlp","hqx":"application/mac-binhex40","hta":"application/hta","htc":"text/x-component","htm":"text/html","html":"text/html","htt":"text/webviewhtml","ico":"image/x-icon","ief":"image/ief","iii":"application/x-iphone","ins":"application/x-internet-signup","isp":"application/x-internet-signup","jfif":"image/pipeg","jpe":"image/jpeg","jpeg":"image/jpeg","jpg":"image/jpeg","js":"application/x-javascript","latex":"application/x-latex","lha":"application/octet-stream","lsf":"video/x-la-asf","lsx":"video/x-la-asf","lzh":"application/octet-stream","m13":"application/x-msmediaview","m14":"application/x-msmediaview","m3u":"audio/x-mpegurl","man":"application/x-troff-man","mdb":"application/x-msaccess","me":"application/x-troff-me","mht":"message/rfc822","mhtml":"message/rfc822","mid":"audio/mid","mny":"application/x-msmoney","mov":"video/quicktime","movie":"video/x-sgi-movie","mp2":"video/mpeg","mp3":"audio/mpeg","mpa":"video/mpeg","mpe":"video/mpeg","mpeg":"video/mpeg","mpg":"video/mpeg","mpp":"application/vnd.ms-project","mpv2":"video/mpeg","ms":"application/x-troff-ms","mvb":"application/x-msmediaview","nws":"message/rfc822","oda":"application/oda","p10":"application/pkcs10","p12":"application/x-pkcs12","p7b":"application/x-pkcs7-certificates","p7c":"application/x-pkcs7-mime","p7m":"application/x-pkcs7-mime","p7r":"application/x-pkcs7-certreqresp","p7s":"application/x-pkcs7-signature","pbm":"image/x-portable-bitmap","pdf":"application/pdf","pfx":"application/x-pkcs12","pgm":"image/x-portable-graymap","pko":"application/ynd.ms-pkipko","pma":"application/x-perfmon","pmc":"application/x-perfmon","pml":"application/x-perfmon","pmr":"application/x-perfmon","pmw":"application/x-perfmon","pnm":"image/x-portable-anymap","pot,":"application/vnd.ms-powerpoint","ppm":"image/x-portable-pixmap","pps":"application/vnd.ms-powerpoint","ppt":"application/vnd.ms-powerpoint","prf":"application/pics-rules","ps":"application/postscript","pub":"application/x-mspublisher","qt":"video/quicktime","ra":"audio/x-pn-realaudio","ram":"audio/x-pn-realaudio","ras":"image/x-cmu-raster","rgb":"image/x-rgb","rmi":"audio/mid","roff":"application/x-troff","rtf":"application/rtf","rtx":"text/richtext","scd":"application/x-msschedule","sct":"text/scriptlet","setpay":"application/set-payment-initiation","setreg":"application/set-registration-initiation","sh":"application/x-sh","shar":"application/x-shar","sit":"application/x-stuffit","snd":"audio/basic","spc":"application/x-pkcs7-certificates","spl":"application/futuresplash","src":"application/x-wais-source","sst":"application/vnd.ms-pkicertstore","stl":"application/vnd.ms-pkistl","stm":"text/html","svg":"image/svg+xml","sv4cpio":"application/x-sv4cpio","sv4crc":"application/x-sv4crc","swf":"application/x-shockwave-flash","t":"application/x-troff","tar":"application/x-tar","tcl":"application/x-tcl","tex":"application/x-tex","texi":"application/x-texinfo","texinfo":"application/x-texinfo","tgz":"application/x-compressed","tif":"image/tiff","tiff":"image/tiff","tr":"application/x-troff","trm":"application/x-msterminal","tsv":"text/tab-separated-values","txt":"text/plain","uls":"text/iuls","ustar":"application/x-ustar","vcf":"text/x-vcard","vrml":"x-world/x-vrml","wav":"audio/x-wav","wcm":"application/vnd.ms-works","wdb":"application/vnd.ms-works","wks":"application/vnd.ms-works","wmf":"application/x-msmetafile","wps":"application/vnd.ms-works","wri":"application/x-mswrite","wrl":"x-world/x-vrml","wrz":"x-world/x-vrml","xaf":"x-world/x-vrml","xbm":"image/x-xbitmap","xla":"application/vnd.ms-excel","xlc":"application/vnd.ms-excel","xlm":"application/vnd.ms-excel","xls":"application/vnd.ms-excel","xlt":"application/vnd.ms-excel","xlw":"application/vnd.ms-excel","xof":"x-world/x-vrml","xpm":"image/x-xpixmap","xwd":"image/x-xwindowdump","z":"application/x-compress","zip":"application/zip"};
   //数据验证
    option = option || {};
    if(option.constructor.name != "Object"){
        newCommand.ERR(`
        Nserve的option参数类型错误，
        应该是一个Object，当前是${option.constructor.name}`)
    }
    option.mimeType = option.mimeType || {};
    if(option.mimeType.constructor.name != "Object"){
        newCommand.ERR(`
        Nserve的option.mimeType参数类型错误，
        应该是一个Object，当前是${option.mimeType.constructor.name}`)
    }
    //追加或替换mineType
    for(var i in option.mimeType){
        this.mimeTypeList[i] = option.mimeType[i];
    }
};
Nserve.prototype = {
    /**
     * @创建服务
     * @param {Object} option
     */
    server:function (option) {
        option = option || {};
        //数据验证
        if(option.constructor.name != "Object"){
            newCommand.ERR(`Nserve对象serve方法的option 参数类型错误，
            应该是一个 Object，当前是${option.constructor.name}`);
        }else if(option.port && option.port.constructor.name != "Number"){
            newCommand.ERR(`Nserve对象serve方法的option.port 参数类型错误，
            应该是一个 Number，当前是${option.port.constructor.name}`);
        }else if(option.home && option.home.constructor.name != "String"){
            newCommand.ERR(`Nserve对象serve方法的option.home 参数类型错误，
            应该是一个 String，当前是${option.home.constructor.name}`);
        }else if(option.host && option.host !== null && option.host.constructor.name != "String"){
            newCommand.ERR(`Nserve对象serve方法的option.host 参数类型错误，
            应该是一个 String或null，当前是${option.host.constructor.name}`);
        }else if(option.headers && option.headers.constructor.name != "Object"){
            newCommand.ERR(`Nserve对象serve方法的option.headers 参数类型错误，
            应该是一个 Object，当前是${option.headers.constructor.name}`);
        }else if(option.callbackDirectorySuccess && option.callbackDirectorySuccess.constructor.name != "Function"){
            newCommand.ERR(`Nserve对象serve方法的option.callbackDirectorySuccess 参数类型错误，
            应该是一个 Function，当前是${option.callback.constructor.name}`);
        }else if(option.callbackStart && option.callbackStart.constructor.name != "Function"){
            newCommand.ERR(`Nserve对象serve方法的option.callbackStart 参数类型错误，
            应该是一个 Function，当前是${option.callback.constructor.name}`);
        }else if(option.callback && option.callback.constructor.name != "Function"){
            newCommand.ERR(`Nserve对象serve方法的option.callback 参数类型错误，
            应该是一个 Function，当前是${option.callback.constructor.name}`);
        }else if(option.page404 && option.page404.constructor.name != "String"){
            newCommand.ERR(`Nserve对象serve方法的option.page404 参数类型错误，
            应该是一个 String，当前是${option.page404.constructor.name}`);
        }else if(option.cssStyle && option.cssStyle.constructor.name != "String"){
            newCommand.ERR(`Nserve对象serve方法的option.cssStyle 参数类型错误，
            应该是一个 String，当前是${option.cssStyle.constructor.name}`);
        }else if(option.DirectoryTitle && option.DirectoryTitle.constructor.name != "String"){
            newCommand.ERR(`Nserve对象serve方法的option.DirectoryTitle 参数类型错误，
            应该是一个 String，当前是${option.DirectoryTitle.constructor.name}`);
        }else if(option.isShowDirectory && option.isShowDirectory.constructor.name != "Boolean"){
            newCommand.ERR(`Nserve对象serve方法的option.isShowDirectory 参数类型错误，
            应该是一个 Boolean，当前是${option.isShowDirectory.constructor.name}`);
        }else if(option.InitHomefile && option.InitHomefile.constructor.name != "String" && option.InitHomefile.constructor.name != "Array"){
            newCommand.ERR(`Nserve对象serve方法的option.InitHomefile 参数类型错误，
            应该是一个 String|Array，当前是${option.InitHomefile.constructor.name}`);
        };
        var  optionExtend =  {
            port:3000,//监听端口
            home:projectPathUrl,//服务目录路径
            host:null,//监听地址，默认是null，即127.0.0.1/localhost/您的ip地址
            //headers头，可写入资源请求的headers头
            headers:{},
            callbackStart:new Function,//服务创建之前，上下文是当前Nserve
            callbackDirectorySuccess:new Function,//读取目录回调
            callback:new Function,//服务回调，上下文是当前server，参数是当前Nserve
            page404:"./404.html",//404页路径，默认是根目录下的404.html
            //默认的目录页面css样式
            cssStyle:`@font-face{font-family:'iconfont';src:url('//at.alicdn.com/t/font_415895_lqvi8hwo5j7tlnmi.eot');src:url('//at.alicdn.com/t/font_415895_lqvi8hwo5j7tlnmi.eot?#iefix') format('embedded-opentype'),url('//at.alicdn.com/t/font_415895_lqvi8hwo5j7tlnmi.woff') format('woff'),url('//at.alicdn.com/t/font_415895_lqvi8hwo5j7tlnmi.ttf') format('truetype'),url('//at.alicdn.com/t/font_415895_lqvi8hwo5j7tlnmi.svg#iconfont') format('svg')}a{line-height:40px;text-decoration:none}a span{font-family:'iconfont';margin-right:5px}a span.Directory{color:#ff8100}a span.back,a span.home{color:#000}a span.file{color:#944b00}a:hover{background-color:#e5e5e5}`,
            DirectoryTitle:"目录列表",//目录浏览标题
            isShowDirectory:true,//是否允许显示目录列表，默认显示
            InitHomefile:null,//目录页面默认请求的文件,string|Array,如果为null将显示目录列表，前提是开启了目录显示
        };
        //追加或替换option
        for(var i in option){
            if(option[i]){
                switch (i){
                    case "cssStyle":
                        //追加样式
                        optionExtend[i] += option[i];
                        break;
                    default:
                        optionExtend[i] = option[i];
                        break;
                };
            }else if(i == "host" || i == "InitHomefile"){
                optionExtend[i] = option[i];
            };
        };
        var host = "127.0.0.1";
        if(optionExtend.host !== null){
            host = optionExtend.host;
        }
        var port=optionExtend.port;
        var home=optionExtend.home;
        var _this = this;
        optionExtend.callbackStart(this);
        var server = http.createServer(function(req,res){
            var fileName  = home + req.url;
            var reqUrl = req.url;
            newCommand.console.warn("[请求资源]："+req.url);
            fs.readFile( fileName,function( err, data ){
                //设置Header头
                for(var h in optionExtend.headers){
                    res.setHeader(h,optionExtend.headers[h]);
                };
                //判断
                if( err ){
                    //设置目录css样式
                    if(req.url == "/") {
                        if(optionExtend.isShowDirectory){
                            _this.readdirStat(fileName,function (files) {
                                optionExtend.callbackDirectorySuccess.call(_this,files,req,res);
                                if(optionExtend.InitHomefile){
                                    var InitHomefileErr = true;
                                    if(optionExtend.InitHomefile.constructor.name == "String"){
                                        for(var i = 0,len = files.length ;i<len; i++){
                                            if(files[i] == optionExtend.InitHomefile){
                                                InitHomefileErr = false;
                                                fs.readFile("."+req.url+files[i],function( err, data ){
                                                    if( err ){
                                                        console.log(err)
                                                        return;
                                                    }
                                                    res.write(data);
                                                    res.end();
                                                });
                                                break;
                                            }
                                        };
                                        if(InitHomefileErr){
                                            _this.ResourcesDoNotExist(req,res);
                                        }
                                    }else if(optionExtend.InitHomefile.constructor.name == "Array"){
                                        var InitHomefileBool = false;
                                        for(var jj = 0,lenj = optionExtend.InitHomefile.length ;jj<lenj; jj++){
                                            for(var i = 0,len = files.length ;i<len; i++){
                                                if(files[i] == optionExtend.InitHomefile[jj]){
                                                    InitHomefileErr = false;
                                                    InitHomefileBool = true;
                                                    fs.readFile("."+req.url+files[i],function( err, data ){
                                                        if( err ){
                                                            console.log(err)
                                                            return;
                                                        }
                                                        res.write(data);
                                                        res.end();
                                                    });
                                                    break;
                                                }
                                            };
                                            if(InitHomefileBool){
                                                break;
                                            };
                                        };
                                        if(InitHomefileErr){
                                            _this.ResourcesDoNotExist(req,res);
                                        }
                                    };
                                }else {
                                    res.writeHead(200, {'Content-type' : 'text/html; charset=utf-8'});
                                    res.write(`<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge">`);
                                    res.write(`<h1>${optionExtend.DirectoryTitle}</h1>`);
                                    res.write(`<span>当前URL：${req.url}    (${files.length}个文件)</span>`);
                                    res.write(`<hr>`);
                                    for(var i = 0,len = files.length ;i<len; i++){
                                        res.write(`<a href="${files[i]}" style="display: block;">${(function () {
                                            var stat = fs.lstatSync(fileName+files[i]);
                                            if(stat.isDirectory()){
                                                return `<span class="Directory">&#xe60f;</span>`;
                                            };
                                            return `<span class="file">&#xe647;</span>`;
                                        })()+files[i]}</a>`);
                                    }
                                    res.write(`<style>${optionExtend.cssStyle}</style>`);
                                    res.end();
                                }
                            });
                        }else {
                            _this.ResourcesDoNotExist(req,res);
                        }
                    }else {
                        if(fs.existsSync(fileName)){
                            if(optionExtend.isShowDirectory){
                                res.writeHead(200, {'Content-type' : 'text/html; charset=utf-8'});
                                _this.readdirStat(fileName,function (files) {
                                    optionExtend.callbackDirectorySuccess.call(_this,files,req,res);
                                    if(optionExtend.InitHomefile){
                                        var InitHomefileErr = true;
                                        if(optionExtend.InitHomefile.constructor.name == "String"){
                                            for(var i = 0,len = files.length ;i<len; i++){
                                                if(files[i] == optionExtend.InitHomefile){
                                                    InitHomefileErr = false;
                                                    fs.readFile(`.${req.url}/${files[i]}`,function( err, data ){
                                                        if( err ){
                                                            console.log(err)
                                                            return;
                                                        }
                                                        res.write(data);
                                                        res.end();
                                                    });
                                                    break;
                                                }
                                            };
                                            if(InitHomefileErr){
                                                _this.ResourcesDoNotExist(req,res);
                                            }
                                        }else if(optionExtend.InitHomefile.constructor.name == "Array"){
                                            var InitHomefileBool = false;
                                            for(var jj = 0,lenj = optionExtend.InitHomefile.length ;jj<lenj; jj++){
                                                for(var i = 0,len = files.length ;i<len; i++){
                                                    if(files[i] == optionExtend.InitHomefile[jj]){
                                                        InitHomefileErr = false;
                                                        InitHomefileBool = true;
                                                        fs.readFile(`.${req.url}/${files[i]}`,function( err, data ){
                                                            if( err ){
                                                                console.log(err)
                                                                return;
                                                            }
                                                            res.write(data);
                                                            res.end();
                                                        });
                                                        break;
                                                    }
                                                };
                                                if(InitHomefileBool){
                                                    break;
                                                };
                                            };
                                            if(InitHomefileErr){
                                                _this.ResourcesDoNotExist(req,res);
                                            }
                                        };
                                    }else {
                                        res.write(`<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge">`);
                                        res.write(`<h1>${optionExtend.DirectoryTitle}</h1>`);
                                        res.write(`<span>当前URL：【${req.url}】(${files.length}个文件)</span>`);
                                        var BackUrl=  req.url.replace(/\/[^/]*\/$|\/[^/]*$/,'');
                                        res.write(`<a href="${(BackUrl.length > 0)? BackUrl : '/'}" style="margin-left: 50px;"><span>&#xe607;</span>返回上一级</a><a href="/" style="margin-left: 50px;"><span>&#xe608;</span>返回首页</a>`);
                                        res.write(`<hr>`);
                                        for(var i = 0,len =  files.length ; i <len; i++){
                                            res.write(`<a href="${req.url}/${files[i]}" style="display: block;">${(function () {
                                                var stat1 = fs.lstatSync(fileName+"/"+files[i]);
                                                if(stat1.isDirectory()){
                                                    return `<span class="Directory">&#xe60f;</span>`;
                                                };
                                                return `<span class="file">&#xe647;</span>`;
                                            })()+files[i]}</a>`);
                                        }
                                        res.write(`<style>${optionExtend.cssStyle}</style>`);
                                        res.end();
                                    }
                                });
                            }else {
                                _this.ResourcesDoNotExist(req,res);
                            }
                        }else {
                            if(fs.existsSync(optionExtend.page404)){
                                fs.readFile(optionExtend.page404,function( err, page404Data ){
                                    if(err){
                                        console.log(err);
                                        return;
                                    };
                                    res.writeHead(200, {'Content-type':`${_this.getmimeType(path.extname(req.url))};`});
                                    res.write(page404Data);
                                    res.end();
                                });
                            }else {
                                _this.ResourcesDoNotExist(req,res);
                            }
                        }
                    }
                }else {
                    res.writeHead(200, {'Content-type':`${_this.getmimeType(path.extname(req.url))};`});
                    res.write(data);
                    res.end();
                }
            })
        });
        server.listen(port,optionExtend.host,function () {
            newCommand.console.log(`Nserve V:${version} 服务器创建成功 ${new Date()}`);
            newCommand.console.color(function () {
                this.info("侦听：").warn(`HTTP://${host}:${port}/`);
            });
            newCommand.console.color(function () {
                this.info("文档根目录：").warn(`${home}/`);
            });
            newCommand.console.color(function () {
                this.info("按【").warn("Ctrl-C").info("】退出");
            });
            console.log("----------------------------------");
            optionExtend.callback.call(server,_this);
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
    },
    /**
     * @根据文件后缀返回对应的文件mime-Type类型
     * @param {string} hz
     * @returns {string}
     */
    getmimeType:function (hz) {
        hz = hz || "";
        var nhz = hz.toString().replace(/^\./,"");
        var inithz = "text/html ; charset=utf-8";//默认文本格式
        for(var i in this.mimeTypeList){
            if(i == nhz){
                inithz  = this.mimeTypeList[i]+ "; charset=utf-8";
                break;
            }
        }
        return inithz;
    },
    ResourcesDoNotExist:function (req,res) {
        res.writeHead(200, {'Content-type' : 'text/html; charset=utf-8'});
        res.write(`<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"><meta http-equiv="X-UA-Compatible" content="ie=edge">`);
        res.write(`<div>对不起资源不存在</div><div>(Sorry, resource does not exist)</div>`);
        res.end();
    }
}
module.exports = Nserve;