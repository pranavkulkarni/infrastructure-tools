var request = require("request");
var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1', {});
var apiPortNo = 3002;

/*
setInterval(function() {

    client.exists("prodServers", function(exception, existsValue) {
        if(existsValue != 0) {
            client.exists("prodUrls", function(exc, existsVal) {
                if(existsVal != 0) {

                    client.lrange("prodServers", 0, -1, function(err, prodServers) {
                        if(err) throw err;
                        var i = 0;
                        while(i < prodServers.length) {
                            var errCount =0;
                            client.lrange("prodUrls", 0, -1, function(e, prodUrls) {
                                if(e) throw e
                                for(var j = 0; j < prodUrls.length; j++) {
                                    //var url = "http://" + prodServers[i] + ":" + apiPortNo + prodUrls[j];
                                    var url = "http://" + prodServers[i] + prodUrls[j];
                                    console.log("Monitoing -- " + url);
                                    request(url, function(er, x, y) {
                                        if(er) throw er;
                                        if(x.statusCode === 500) {
                                            errCount +=1;
                                        }
                                    });
                                }

                                client.llen("prodUrls", function(er, numOfUrls){
                                    if(er) throw er;

                                    if(errCount === numOfUrls){
                                        client.lrem("prodServers", 0, prodServers[i], function(error,z) {
                                            if(error) throw error;
                                            console.log("Stopped routing to Prod Server" + prodServers[i]);
                                        })
                                    }
                                })

                                i++;

                            });
                        }
                    });

                }
            })
        }

    })




}, 10000);
*/


/*
setInterval(function() {

    client.exists("canServers", function(exception, existsValue) {
        if(existsValue != 0) {
            client.exists("canUrls", function(exc, existsVal) {
                if(existsVal != 0) {

                    client.lrange("canServers", 0, -1, function(err, canServers) {
                        if(err) throw err;
                        var i = 0;
                        while(i < canServers.length) {
                            client.lrange("canUrls", 0, -1, function(e, canUrls) {
                                if(e) throw e;
                                for(var j = 0; j < canUrls.length; j++) {
                                    //var url = "http://" + canServers[i] + ":" + apiPortNo + canUrls[j];
                                    var url = "http://" + canServers[i] + canUrls[j];
                                    console.log("Monitoing canary-- " + url);
                                    request(url, function(er, x, y) {
                                        if(er) throw er;
                                        if(x.statusCode === 500) {
                                            client.set("trafficRatio", 1.0, function(error, val) {
                                                if(error) throw error;
                                                console.log("Stopped routing to Canary Server");
                                            });
                                        }
                                    });
                                }
                                i++;
                            });
                        }
                    });

                }
            })
        }
    })

}, 15000);

*/