var Nserve = require('./index');
var a = new Nserve()
    .server({
        port:83,
        page404:"./bin/404.html",
        // InitHomefile:["aa.html","c.a","index.html"],
        InitHomefile:["aa.html","c.a","404.html"],
        // InitHomefile:"4041.html",
    })
// console.log(a)
