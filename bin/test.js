var Nserve = require('./index');
new Nserve()
    .readdirStat(function () {
        console.log(this)
    });