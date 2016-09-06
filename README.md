# XMLSocket
A wrapper over Node [Socket](https://nodejs.org/api/net.html#net_class_net_socket) to listen for incoming XML requests.

In order to work with legacy XML hungry Java clients, I wrote this library to deal with incoming XML data over TCP.

Heavily inspired and copied code from: [JsonSocket](https://github.com/sebastianseilund/node-json-socket) 

###Dependency
This library is dependent on [node-xml2js](https://github.com/Leonidas-from-XIV/node-xml2js) for parsing and validating incoming XML

###Usage
This library is intended for TCP servers, to listen for XML data. Example below shows, how to use XMLSocket:

    var server = require("net").createServer();
    var XmlSocket = require("./xml-socket.js");
    var port = 4001;
    
    server.on("connection", function(socket) {
        socket = new XmlSocket(socket);
        socket.on("message", function(err, data) {
            if(!err) {
                console.log("Got: " + data);
            } else {
                console.error(err);
            }
        });
    });
    
    server.listen(port);
