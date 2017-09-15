var Nserve = require('./index');
var a = new Nserve()
    .server({
        port:82,
        page404:"bin/index.html",
        InitHomefile:null,
    })
// console.log(a)
