var Nserve = require('./index');
new Nserve()
    .readdirStat(function (e) {
        console.log(this.readdirStat,e)
    })