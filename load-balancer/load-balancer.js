/*
    Proxy server acts as a load balancer and also as a proxy routing to the next available server using round robin.
*/
var fs = require('fs')
var httpProxy = require('http-proxy')
var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1', {}); //connects to the global redis store
var http = require('http')
var portNo = process.argv[2]

var listOfProdServers;
client.get("prodServers", function(errr, listOfServers) {
    if(err) throw err;
    listOfProdServers = listOfServers;
});

var listOfCanaryServers;
client.get("canServers", function(errr, listOfServers) {
    if(err) throw err;
    listOfCanaryServers = listOfServers;
});

var trafficRatio;
client.get("trafficRatio", function(errr, tr) {
    if(err) throw err;
    trafficRatio = Number(tr);
});

var proxy = httpProxy.createProxyServer({});
console.log('Load Balancer listening at port 8080');


http.createServer(function(req, res) {
    var targetInstance;
    if(trafficRatio === 1.0) {
        // proxy only to prod servers in round robin fashion
        client.rpoplpush(listOfProdServers, listOfProdServers, function(err, targetServer) {
            if(err) throw err;
            targetInstance = targetServer;
        });
    } else {
        if(Math.random() > trafficRatio ) {
            // proxy to canary server
            client.rpoplpush(listOfCanaryServers, listOfCanaryServers, function(err, targetServer) {
                if(err) throw err;
                targetInstance = targetServer;
            });
        } else {
            // proxy only to prod servers in round robin fashion
            client.rpoplpush(listOfProdServers, listOfProdServers, function(err, targetServer) {
                if(err) throw err;
                targetInstance = targetServer;
            });
        }
    }

    proxy.web(req, res, { target: 'http://' + targetInstance });

}).listen(portNo || 8080);




