/*
    Proxy server acts as a load balancer and also as a proxy routing to the next available server using round robin.
*/
var fs = require('fs')
var httpProxy = require('http-proxy')
var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1', {}); //connects to the global redis store
var http = require('http')
var portNo = process.argv[2]

var trafficRatio;
client.get("trafficRatio", function(errr, tr) {
    if(errr) throw errr;
    trafficRatio = Number(tr);
});

var proxy = httpProxy.createProxyServer({});

http.createServer(function(req, res) {
    console.log("\nReq received from client.");

    if(trafficRatio === 1.0) {
        // proxy only to prod servers in round robin fashion
        client.rpoplpush("prodServers", "prodServers", function(err, targetServer) {
            if(err) throw err;
            console.log("Proxying to server: http://" + targetServer );
            proxy.web(req, res, { target: 'http://' + targetServer });
        });
    } else {
        if(Math.random() > trafficRatio ) {
            // proxy to canary server
            client.rpoplpush("canServers", "canServers", function(err, targetServer) {
                if(err) throw err;
                console.log("Proxying to server: http://" + targetServer );
                proxy.web(req, res, { target: 'http://' + targetServer });
            });
        } else {
            // proxy only to prod servers in round robin fashion
            client.rpoplpush("prodServers", "prodServers", function(err, targetServer) {
                if(err) throw err;
                console.log("Proxying to server: http://" + targetServer );
                proxy.web(req, res, { target: 'http://' + targetServer });
            });
        }
    }

    console.log("Response sent to client.");

}).listen(portNo || 8080);

console.log('Load Balancer running at port 8080');



