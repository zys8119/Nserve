/**
 * @依赖包
 * */
//颜色输出
const ncol = require("ncol");
/** 依赖包End*/
const process = require("process");
/**
 * @命令参数提示工具 by 张云山 on 2017/9/9.
 * @param {Object{input:Array(String...|Object{title:String,fnName:String}...)}} Options
 */
const command = function(Options){
    Options = Options || {};
    //默认["Commands","Options"]，命令和选项
    Options.input = Options.input || ["Commands","Options"];
    //存储命令回调callback集合
    this.callbacks = [];
    //判断数据
    if(Options.constructor.name != "Object"){
        this.ERR("command方法的Options参数类型错误,应该为一个Object对象,例如：command({})");
    }
    if(["Object","Array"].indexOf(Options.input.constructor.name) < 0){
        this.ERR("command方法的Options.input参数类型错误,应该为一个Array对象，例如：command({input:[]})");
    }
    //注册Options方法
    this.onInput = function (Str) {
        if(Options.input[i].fnName){
            this[Options.input[i].fnName+"Bool"] = true;
        }else{
            this[Options.input[i]+"Bool"] = true;
        };
        command.prototype[Str] = (function(Str,title){
            return function () {
                this.inInput(Str,title);
                return this;
            };
        })(Str,Options.input[i].title);
    }
    for(var i = 0,len = Options.input.length ; i < len; i++){
        //注册Options.input相关事件
        let input = Options.input[i];
        //判断数据
        switch (input.constructor.name){
            case "String":
                this.onInput(input);
                break;
            case "Object":
                if(input.title && input.title.constructor.name != "String"){
                    this.ERR(`command方法的Options.input[0].title参数类型错误,
                        \n 应该为一个String对象，例如：command({input:[{title:"String",fnName:"String"}]})，说明：(title选填，填后必须是String)`);
                }else
                if(!input.fnName || input.fnName.constructor.name != "String"){
                    this.ERR(`command方法的Options.input[0].fnName参数类型错误,
                        \n 应该为一个String对象，例如：command({input:[{fnName:"String"}]})，说明：(fnName必填)`);
                }
                this.onInput(input.fnName);
                break;
            default:
                this.ERR(`command方法的Options.input参数类型错误,应该为一个Array对象，例如：command({input:["String"]})`);
                break;
        }
    }
    //参数
    this.argv = (function (argv) {
        var argvs = [];
        for(var i = 2,len = argv.length; i < len ;i++){
            argvs.push(argv[i]);
        };
        return argvs;
    })(process.argv);
};
command.prototype = {
    /**
     *@暂存数据
     *@param {String} Str
     *@param {String} StrTitle
     */
    inInput:function (Str,StrTitle) {
        Str = Str || "";
        StrTitle = StrTitle || "";
        //追加回调callback集合
        this.callbacks.push({
            Str:Str,
            StrTitle:StrTitle,
            arguments:this[Str].arguments[0],
            callback:this[Str].arguments[0].callback || new Function,
            init:this.inptInit
        });
        return this;
    },
    /**
     *@初始化命令方法
     *@param {String} Str
     */
    inptInit:function (Str,StrTitle,argumentss) {
        Str = Str || "";
        StrTitle = StrTitle || "";
        var _this = this;
        //判断是否打印command标题
        if(this[Str+"Bool"]){
            this[Str+"Bool"] = false;
            console.log(Str,StrTitle);
        };
        // var args = this[Str].arguments[0];
        var args = argumentss;
        ///判断数据
        if(args){
            if(args.constructor.name == "Object"){
                if(args.callback && args.callback.constructor.name != "Function"){
                    this.ERR(`command.${Str}方法的command.${Str}.callback 参数类型错误,
                        \n 应该为一个functiion对象，例如：${Str}({callback:"function"})，说明：(callback选填，填后必须是function)`);
                }else
                if(!args.log || args.log.constructor.name != "Array"){
                    this.ERR(`command.${Str}方法的command.${Str}.log 参数类型错误,
                        \n 应该为一个Array对象，例如：${Str}({log:"Array"})，说明：(必填)]`);
                }
            }else{
                this.ERR(`command.${Str}方法参数类型错误,应该为一个Object对象，例如：${Str}a({log:"String:必填",callback:"function:选填"})`);
            }
        }
        //以下是颜色处理
        if(args && args.log){
            args.log = args.log.map(function(e,i){
                return ((i == 0)?"    ":" ")+JSON.stringify(e);
            });
            // console.log.apply(null,args.log);//原始写法
            //新增颜色输入控制,颜色使用说明：必须以 `...colorFn(content)` 形式使用
            this.console.color(function () {
                var logStr = "";
                args.log.map(function (e) {
                    logStr += _this.extends.removeSyh(e);
                });
                var newArgsLog = logStr.match(/\.{3}(\s|\w)*\(([^\(\)])*\)/img);
                //判断是否存在颜色渲染方法
                if(newArgsLog){
                    //如果存在进行颜色渲染处理
                    for(var i = 0 ,len = newArgsLog.length; i < len ; i++){
                        var logStrExcept = logStr.substring(0,logStr.indexOf(newArgsLog[i]));
                        var logStrColorFn = newArgsLog[i].replace(/^\.{3}/,"");
                        var  name = logStrColorFn.replace(/\(.*\)/img,"");
                        //不含颜色方法的默认渲染
                        this.log(logStrExcept);
                        //判断是否合法的颜色方法
                        if(eval(`this.${name}`)){
                            //渲染对应的颜色处理
                            eval(`this.${logStrColorFn}`);
                        }else{
                            //不存在的颜色方法处理
                            this.log(newArgsLog[i]);
                        };
                        var logStrNew = logStr.substring(logStr.indexOf(newArgsLog[i])+newArgsLog[i].length,logStr.length);
                        logStr = logStrNew;
                        if(!logStr.match(/\.{3}(\s|\w)*\(([^\(\)])*\)/img)){
                            //尾部处理
                            this.log(logStr)
                        };
                    };
                }else {
                    //如果不存在默认渲染
                    this.log(logStr);
                    if(args.log.length == 0){
                        this.yellow(`温馨提示：您的command.${Str}方法里面有一个${Str}方法的参数log字段数组为空，建议填写内容。`)
                    };
                }
            });
        }
        return this;
    },
    /**
     * @颜色打印输出 继承ncl
     **/
    console:ncol,
    /**
     * @错误打印扩展
     * @param {string} Str
     **/
    //字体颜色
    ERR:function (Str) {
        Str = Str || "错误";
        this.console.error(new Error(Str));
        process.exit();
    },
    //背景
    ERR_BG:function (Str) {
        Str = Str || "错误";
        this.console.errorBG(new Error(Str));
        process.exit();
    },
    /**
     * @显示帮助
     * @param {function} callback
     */
    showHelp:function (callback,type) {
        type = type || '';
        callback = callback || function () {
            this.console.color(function () {
              this
                  .log("温馨提示：如需帮助请执行命令 ")
                  .green("-help")
                  .log(" 或 ")
                  .green("-h")
                  .log(" 查看帮助");
            });
            return this;
        };
        if(callback.constructor.name != "Function"){
            switch (type){
                case "init":
                    this.ERR("command.init，showCallback应为Function对象，例如：init(Function,Function)");
                    break;
                default:
                    this.ERR("command.showHelp方法参数类型错误，callback应为Function对象，例如：showHelp(Function)");
                    break;
            };
        };
        callback.call(this);
        return this;
    },
    /**
     * @初始化command交互式命令解析器
     * 回调
     * @param {function} callback
     * 帮助回调
     * @param {function} showCallback
     */
    init:function (callback,showCallback) {
        callback = callback || new Function;
        if(callback.constructor.name != "Function"){
            this.ERR("command.init，callback应为Function对象，例如：init(Function)");
        };
        var _this = this;
        //判断argv参数是否匹配
        this.argv.map(function (argv) {
            _this.callbacks.map(function (e) {
                //如果匹配执行对应的回调方法
                if(e.arguments.log.length > 0 && e.arguments.log[0] == argv){
                    //清除临时存储命令回调callback集合
                    _this.callbacks = [];
                    //执行回调,并且传入当前的argv参数
                    if(!e.callback.call(_this,e.arguments.log)){
                        process.exit();
                    };
                };
            });
        });
        //如果没有匹配到就提示帮助或command命令等相关信息
        for(var i = 0 ; i< this.callbacks.length;i++){
            var initData = this.callbacks[i];
            if(initData.type && initData.type == 'end'){
                switch (initData.dataType){
                    case "string":
                        console.log(initData.Opt);
                        break;
                    case "function":
                        initData.Opt.call(this);
                        break;
                };
            }else{
                initData.init.call(this,initData.Str,initData.StrTitle,initData.arguments);
            };
        };
        this.showHelp(showCallback,"init");
        callback.call(this);
        return this;
    },
    /**
     *@备注方法
     *@param {String|Function} Opt
     */
    end:function (Opt) {
        Opt = Opt || '';
        //判断数据
        switch (typeof Opt){
            case "string":
                this.callbacks.push({
                    type:"end",
                    dataType:"string",
                    Opt:Opt,
                });
                break;
            case "function":
                this.callbacks.push({
                    type:"end",
                    dataType:"function",
                    Opt:Opt,
                });
                break;
            default:
                this.ERR("command.end方法参数类型错误,例如：end(string|function)");
                break;
        }
        return this;
    },
    /**
     * @扩展方法集合
     */
    extends:{
        //双去引号
        removeSyh:function (data) {
            return (function (s) {return (s)?s[0]:"";})(data.match(/^(\s)*/img))+data.replace(/^(\s)*"|"(\s)*$/img,"");
        }
    }
}
module.exports = command;