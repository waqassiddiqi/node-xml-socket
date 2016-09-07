var net = require("net");
var endOfLine = require('os').EOL;
var parseString = require("xml2js").parseString;

var XmlSocket = function(socket) {
    socket.setEncoding("utf8");
    this._socket = socket;
    this._buffer = '';
    this._closed = false;

    socket.on('data', this._onData.bind(this));
    socket.on('close', this._onClose.bind(this));
    socket.on('err', this._onError.bind(this));
};

module.exports = XmlSocket;

XmlSocket.prototype = {
    _onData: function(data) {
        try {
            this._handleData(data);
        } catch (e) {
            throw e;
        }
    },

    _handleData: function(data) {
        if(data !== endOfLine) {
            this._buffer += data;
        } else {
            this._handleMessage(this._buffer);
        }
    },

    _handleMessage: function(data) {
        this._buffer = '';
        var that = this;
        parseString(data, function(err, xmlObj) {
            if(!err) {
                that._socket.emit('message', null, data);
            } else {
                that._socket.emit('message', err, null);
            }
        });
        
    },

    _onClose: function() {
        this._closed = true;
    },

    _onError: function() {
        this._closed = true;
    }
};

var delegates = [ 'connect', 'on', 'end', 'write' ];
delegates.forEach(function(method) {
    XmlSocket.prototype[method] = function() {
        this._socket[method].apply(this._socket, arguments);
        return this
    }
});