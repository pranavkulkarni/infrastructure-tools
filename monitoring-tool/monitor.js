var request = require("request");
var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1', {});
var apiPortNo = 3002;


setInterval(function() {

    client.exists("canServers", function(exception, existsValue) {
        if(existsValue != 0) {
            client.exists("canUrls", function(exc, existsVal) {
                if(existsVal != 0) {
                    client.lrange("canServers", 0, -1, function(err, canServers) {
                        if(err) throw err;
                        //console.log("CanServers ====== ");
                        var url = "http://" + canServers[0];
                        client.lrange("canUrls", 0 , -1, function(e, canUrls) {
                            if(e) throw e;
                            url += canUrls[0];
                            console.log("Monitoring canary url -- " + url);
                            request(url, function(er, x, y) {
                                if(er) throw er;
                                if(x.statusCode === 500) {
                                    client.set("trafficRatio", 1.0, function(error, val) {
                                        if(error) throw error;
                                        console.log("Stopped routing to Canary Server");
                                    });
                                }
                            });
                        });
                    });
                }
            });
        }
    });

}, 60000);



console.log("Monitoring tool started.");
