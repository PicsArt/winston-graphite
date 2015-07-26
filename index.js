var winston = require('winston');

require('./lib/winston-graphite-tcp.js');

winston.add(winston.transports.Graphite, {
    port: 2003,
    host: 'graph1'
});
winston.remove(winston.transports.Console);

setTimeout(function() {
    winston.info("k.b.c.d.e 1");
}, 5000)

