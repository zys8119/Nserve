/**
 * 颜色输出 by 张云山 on 2017/9/8.
 * @param {Object} extendColor
 */
var colors = function (extendColor = {}) {
    //色值
    this.colorList = {
        bold:"0;1",
        italic:"0;3",
        underline:"0;4",
        inverse:"0;7",
        strikethrough:"0;9",

        white:"39;37",
        grey:"39;90",
        black:"39;0",
        blue:"39;34",
        cyan:"39;36",
        green:"39;32",
        magenta:"39;35",
        red:"39;31",
        yellow:"39;33",

        whiteBG:"49;47",
        greyBG:"49;5",
        blackBG:"49;40",
        blueBG:"49;44",
        cyanBG:"49;46",
        greenBG:"49;42",
        magentaBG:"49;45",
        redBG:"49;41",
        yellowBG:"49;43",
    };
    //扩展颜色并初始化颜色方法
    this.extendColor(extendColor);

}
colors.prototype = {
    //注册相应色值的方法
    init:function (colorList = {}) {
        for(var i in colorList){
            (function (color,i) {
                colors.prototype[i] = function (Str = "") {
                    //判断是否多彩模式
                    if(this.colorBool){
                        this.colorTxt += "\x1b["+color+";1m" + Str + "\x1b[0;0;1m";
                    }else{
                        console.log("\x1b["+color+";1m",Str,"\x1b[0;0;1m");
                    };
                    return this;
                };
            })(colorList[i],i);
        };
    },
    //扩展颜色
    extendColor:function (extendColor = {}) {
        for(var i in extendColor){
            this.colorList[i] = extendColor[i];
        };
        //初始化并注册对应颜色方法
        this.init(this.colorList);
        return this;
    },
    //log普通
    log:function (Str = "",type = "") {
        var logBool = true;
        //判断是否多彩模式
        if(this.colorBool){
            if(type == ""){
                this.colorTxt += "_x1b[0;0;1m" +Str;
            }
            return this;
        }
        //普通模式
        for(var i in this.colorList){
            //判断类型
            if(i == type){
                console.log("\x1b["+this.colorList[i]+";1m",Str,"\x1b[0;0;0m");
                logBool = false;
                break;
            };
        };
        if(logBool){
            console.log(Str);
        }
        return this;
    },
    //公共方法
    pub:function (Str = "",type = "") {
        //判断是否多彩模式
        if(this.colorBool){
            this.colorTxt += "_x1b["+this.colorList[type]+";1m" +Str + "\x1b[0;0;1m";
        }
        return this.log(Str,type);
    },
    //error 错误
    error:function (Str = "") {return this.pub(Str,"red")},
    //errorBG 错误背景
    errorBG:function (Str = "") {return this.pub(Str,"redBG")},
    //info 信息
    info:function (Str = "") {return this.pub(Str,"blue")},
    //infoBG 信息背景
    infoBG:function (Str = "") {return this.pub(Str,"blueBG")},
    //success 成功
    success:function (Str = "") {return this.pub(Str,"green")},
    //successBG 成功背景
    successBG:function (Str = "") {return this.pub(Str,"greenBG")},
    //warn 警告
    warn:function (Str = "") {return this.pub(Str,"yellow")},
    //warnBG 警告背景
    warnBG:function (Str = "") {return this.pub(Str,"yellowBG")},
    //color 多彩颜色
    color:function (fn = new Function) {
        this.colorTxt = "";
        this.colorBool = true;
        fn.call(this);
        this.colorTxt += "_x1b[0;0;1m";
        console.log(this.colorTxt.replace(/_x1b/img,"\x1b"));
        delete this.colorTxt;
        delete this.colorBool;
        return this;
    },
}
module.exports = new colors();