var winston = require('winston');

var util = require('util'),
    common = require('winston/lib/winston/common'),
    Transport = require('winston/lib/winston/transports/transport').Transport;
var net = require('net');

// Constants.
var STATES = { // Connection States.
    DISCONNECTED: 0,
    CONNECTING: 1,
    CONNECTED: 2,
    CONNECTED_READ_ONLY: 3,
    CLOSING: -1,
    CLOSED: -2
};

var Graphite = exports.Graphite = function (options) {
    Transport.call(this, options);
    options = options || {};

    this.json = options.json || false;
    this.timestamp = typeof options.timestamp !== 'undefined' ? options.timestamp : false;
    this.showLevel = options.showLevel === undefined ? true : options.showLevel;
    this.label = options.label || null;
    this.port = options.port || 2003;
    this.host = options.host || "localhost";
    if (this.json) {
        this.stringify = options.stringify || function (obj) {
            return JSON.stringify(obj, null, 2);
        };
    }
    this.state = STATES.DISCONNECTED;
    this.socket = null;
    this.connect();
};

util.inherits(Graphite, Transport);

winston.transports.Graphite = Graphite;

Graphite.prototype.name = 'graphite';

Graphite.prototype.setState = function (state) {
    this.state = state;
};

Graphite.prototype.onSocketClosed = function (hasError) {
    var retry = false;

    switch (this.state) {
        case STATES.CLOSING:
            retry = false;
            break;
        default:
            retry = true;
    }

    this.setState(STATES.DISCONNECTED);

    if (retry) {
        this.connect();
    } else {
        this.setState(STATES.CLOSED);
    }
};

Graphite.prototype.onSocketError = function () {
    this.socket.destroy();
};

Graphite.prototype.log = function (level, msg, meta, callback) {
    var self = this;
    if (this.silent) {
        return callback(null, true);
    }

    var output = common.log({
        json: this.json,
        level: level,
        message: msg,
        meta: meta,
        stringify: this.stringify,
        timestamp: this.timestamp,
        showLevel: false,
        label: this.label,
        formatter: function(options) {
            return options.message + ' ' + Math.floor(new Date().getTime() / 1000) + "\n";
        },
        humanReadableUnhandledException: this.humanReadableUnhandledException
    });
    this.sendLog(output, function () {
        self.emit('logged');
        callback(null, true);
    });
};


Graphite.prototype.connect = function () {
    var self = this;
    this.setState(STATES.CONNECTING);
    this.socket = net.createConnection(this.port, this.host, function () {
        self.setState(STATES.CONNECTED);
    });
    this.socket.on('close', this.onSocketClosed.bind(this));
    this.socket.on('error', this.onSocketError.bind(this));

};

Graphite.prototype.close = function () {
    if (this.state == STATES.CONNECTED) {
        this.socket.end();
        this.socket.destroy();
        this.setState(STATES.CLOSED);
    }
};

Graphite.prototype.sendLog = function (message, callback) {
    if (this.state == STATES.CONNECTED) {
        this.socket.write(message);
        callback && callback();
    }
};

