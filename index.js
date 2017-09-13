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
            var fileName  = home + req.url;
            newCommand.console.warn("被请求资源："+req.url);
            fs.readFile( fileName, 'utf8',function( err, data ){
                if( err ){
                    if(req.url == "/") {
                        res.writeHead(200, {'Content-type' : 'text/html; charset=utf-8'});
                        _this.readdirStat(fileName,function (files) {
                            res.write(`<h1>目录列表</h1><hr>`);
                            for(var i = 0 ; i < files.length ; i++){
                                res.write(`<a href="${files[i]}" style="display: block;">${files[i]}</a>`);
                            }
                            res.end();
                        });
                    }else {
                        if(fs.existsSync(fileName)){
                            res.writeHead(200, {'Content-type' : 'text/html; charset=utf-8'});
                            _this.readdirStat(fileName,function (files) {
                                res.write(`<h1>目录列表</h1>`);
                                res.write(`<span>当前URL：【${req.url}】</span>`);
                                var BackUrl=  req.url.replace(/\/[^/]*\/$|\/[^/]*$/,'');
                                res.write(`<a href="${(BackUrl.length > 0)? BackUrl : '/'}" style="margin-left: 50px;">返回上一级</a><a href="/" style="margin-left: 50px;">返回首页</a>`);
                                res.write(`<hr>`);
                                for(var i = 0 ; i < files.length ; i++){
                                    res.write(`<a href="${req.url}/${files[i]}" style="display: block;">${files[i]}</a>`);
                                }
                                res.end();
                            });
                        }else {
                            res.writeHead(200, {'Content-type' : 'text/html; charset=utf-8'});
                            res.write('404');
                            res.end();
                        }
                    }
                }else {
                    res.writeHead(200, {'Content-type':`${_this.mimeType(path.extname(req.url))};charset=utf-8;`});
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
    },
    /**
     * @根据文件后缀返回对应的文件mime-Type类型
     * @param {string} hz
     * @returns {string}
     */
    mimeType:function (hz) {
        hz = hz || "";
        var nhz = hz.replace(/^\./,"");
        var inithz = "text/html ; charset=utf-8";//默认文本格式
        var mimeTypeList = {"323":"text/h323","扩展名":"类型/子类型","&nbsp;":"application/octet-stream","acx":"application/internet-property-stream","ai":"application/postscript","aif":"audio/x-aiff","aifc":"audio/x-aiff","aiff":"audio/x-aiff","asf":"video/x-ms-asf","asr":"video/x-ms-asf","asx":"video/x-ms-asf","au":"audio/basic","avi":"video/x-msvideo","axs":"application/olescript","bas":"text/plain","bcpio":"application/x-bcpio","bin":"application/octet-stream","bmp":"image/bmp","c":"text/plain","cat":"application/vnd.ms-pkiseccat","cdf":"application/x-cdf","cer":"application/x-x509-ca-cert","class":"application/octet-stream","clp":"application/x-msclip","cmx":"image/x-cmx","cod":"image/cis-cod","cpio":"application/x-cpio","crd":"application/x-mscardfile","crl":"application/pkix-crl","crt":"application/x-x509-ca-cert","csh":"application/x-csh","css":"text/css","dcr":"application/x-director","der":"application/x-x509-ca-cert","dir":"application/x-director","dll":"application/x-msdownload","dms":"application/octet-stream","doc":"application/msword","dot":"application/msword","dvi":"application/x-dvi","dxr":"application/x-director","eps":"application/postscript","etx":"text/x-setext","evy":"application/envoy","exe":"application/octet-stream","fif":"application/fractals","flr":"x-world/x-vrml","gif":"image/gif","gtar":"application/x-gtar","gz":"application/x-gzip","h":"text/plain","hdf":"application/x-hdf","hlp":"application/winhlp","hqx":"application/mac-binhex40","hta":"application/hta","htc":"text/x-component","htm":"text/html","html":"text/html","htt":"text/webviewhtml","ico":"image/x-icon","ief":"image/ief","iii":"application/x-iphone","ins":"application/x-internet-signup","isp":"application/x-internet-signup","jfif":"image/pipeg","jpe":"image/jpeg","jpeg":"image/jpeg","jpg":"image/jpeg","js":"application/x-javascript","latex":"application/x-latex","lha":"application/octet-stream","lsf":"video/x-la-asf","lsx":"video/x-la-asf","lzh":"application/octet-stream","m13":"application/x-msmediaview","m14":"application/x-msmediaview","m3u":"audio/x-mpegurl","man":"application/x-troff-man","mdb":"application/x-msaccess","me":"application/x-troff-me","mht":"message/rfc822","mhtml":"message/rfc822","mid":"audio/mid","mny":"application/x-msmoney","mov":"video/quicktime","movie":"video/x-sgi-movie","mp2":"video/mpeg","mp3":"audio/mpeg","mpa":"video/mpeg","mpe":"video/mpeg","mpeg":"video/mpeg","mpg":"video/mpeg","mpp":"application/vnd.ms-project","mpv2":"video/mpeg","ms":"application/x-troff-ms","mvb":"application/x-msmediaview","nws":"message/rfc822","oda":"application/oda","p10":"application/pkcs10","p12":"application/x-pkcs12","p7b":"application/x-pkcs7-certificates","p7c":"application/x-pkcs7-mime","p7m":"application/x-pkcs7-mime","p7r":"application/x-pkcs7-certreqresp","p7s":"application/x-pkcs7-signature","pbm":"image/x-portable-bitmap","pdf":"application/pdf","pfx":"application/x-pkcs12","pgm":"image/x-portable-graymap","pko":"application/ynd.ms-pkipko","pma":"application/x-perfmon","pmc":"application/x-perfmon","pml":"application/x-perfmon","pmr":"application/x-perfmon","pmw":"application/x-perfmon","pnm":"image/x-portable-anymap","pot,":"application/vnd.ms-powerpoint","ppm":"image/x-portable-pixmap","pps":"application/vnd.ms-powerpoint","ppt":"application/vnd.ms-powerpoint","prf":"application/pics-rules","ps":"application/postscript","pub":"application/x-mspublisher","qt":"video/quicktime","ra":"audio/x-pn-realaudio","ram":"audio/x-pn-realaudio","ras":"image/x-cmu-raster","rgb":"image/x-rgb","rmi":"audio/mid","roff":"application/x-troff","rtf":"application/rtf","rtx":"text/richtext","scd":"application/x-msschedule","sct":"text/scriptlet","setpay":"application/set-payment-initiation","setreg":"application/set-registration-initiation","sh":"application/x-sh","shar":"application/x-shar","sit":"application/x-stuffit","snd":"audio/basic","spc":"application/x-pkcs7-certificates","spl":"application/futuresplash","src":"application/x-wais-source","sst":"application/vnd.ms-pkicertstore","stl":"application/vnd.ms-pkistl","stm":"text/html","svg":"image/svg+xml","sv4cpio":"application/x-sv4cpio","sv4crc":"application/x-sv4crc","swf":"application/x-shockwave-flash","t":"application/x-troff","tar":"application/x-tar","tcl":"application/x-tcl","tex":"application/x-tex","texi":"application/x-texinfo","texinfo":"application/x-texinfo","tgz":"application/x-compressed","tif":"image/tiff","tiff":"image/tiff","tr":"application/x-troff","trm":"application/x-msterminal","tsv":"text/tab-separated-values","txt":"text/plain","uls":"text/iuls","ustar":"application/x-ustar","vcf":"text/x-vcard","vrml":"x-world/x-vrml","wav":"audio/x-wav","wcm":"application/vnd.ms-works","wdb":"application/vnd.ms-works","wks":"application/vnd.ms-works","wmf":"application/x-msmetafile","wps":"application/vnd.ms-works","wri":"application/x-mswrite","wrl":"x-world/x-vrml","wrz":"x-world/x-vrml","xaf":"x-world/x-vrml","xbm":"image/x-xbitmap","xla":"application/vnd.ms-excel","xlc":"application/vnd.ms-excel","xlm":"application/vnd.ms-excel","xls":"application/vnd.ms-excel","xlt":"application/vnd.ms-excel","xlw":"application/vnd.ms-excel","xof":"x-world/x-vrml","xpm":"image/x-xpixmap","xwd":"image/x-xwindowdump","z":"application/x-compress","zip":"application/zip"};
        for(var i in mimeTypeList){
            if(i == nhz){
                inithz  = mimeTypeList[i]+ "; charset=utf-8";
                break;
            }
        }
        return inithz;
    }
}
module.exports = Nserve;