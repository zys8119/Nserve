var command = require("./index");
new command()
    .Commands({
        log:["a","这是...red('一')个命令",{},[]],
        callback:function () {
            this
                .Commands({
                    log:["c","这是a命令下的c命令",{},[]],
                    callback:function () {
                        console.log(this)
                    }
                })
                .Commands({
                    log:["-h","这是帮助命令",{},[]],
                    callback:function () {
                        console.log(this)
                    }
                })
                .init();
        }
    })
    .end("我是插入的信息")
    .end(function() {
        this.console
            .red("红色")
            .yellow("黄色")
            .color(function () {
                this
                    .red(" 哈哈~")
                    .yellow("哈哈~")
                    .success("哈哈~")
                    .info("哈哈~")
            })
            .success("成功");
            //...
    })
    .Commands({
        log:["b"],
    })
    .Options({
        log:["c"],
        callback:function (w) {
            this.console.warn("我是当前的argv参数："+w)
        }
    })
    .init();