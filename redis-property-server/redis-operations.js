var redis = require('redis')
var client = redis.createClient(6379, '127.0.0.1', {});
var operation = process.argv[2];

var setFeatureFlag = function (featureFlagName,featureFlagStatus) {

    client.set(featureFlagName, featureFlagStatus, function(err, reply) {
        if (err) throw err;
        console.log("Feature " + featureFlagName +  " has been set to " + featureFlagStatus);
    });

};

var setTrafficRatio = function (trafficRatio) {

    client.set("trafficRatio", trafficRatio, function(err, reply) {
        if (err) throw err;
        console.log("trafficRatio has been set to " + trafficRatio);
    });

};

var addUrl = function (urlListName, urlName) {

    client.rpush([urlListName, urlName], function(err, reply) {
        if (err) throw err;
        console.log(urlName + " has been added to the list of " + urlListName);
    });

};

var addServer = function (serverListName, serverName) {

    client.rpush([serverListName, serverName], function(err, reply) {
        if (err) throw err;
        console.log(serverListName + " has been added to the list of " + serverName);
    });

};

var removeUrl = function (urlListName, urlName) {

    client.lrem(urlListName, 0 , urlName, function(err, reply) {
        if (err) throw err;
        console.log(urlName + " has been removed from the list of " + urlListName);
    });

};

var removeServer = function (serverListName, serverName) {

    client.lrem(serverListName, 0 , serverName, function(err, reply) {
        if (err) throw err;
        console.log(serverName + " has been removed from the list of " + serverListName);
    });

};

switch(operation){
	case setFeatureFlag:
		var featureFlagName = process.argv[3];
        var featureFlagStatus = process.argv[4];
        setFeatureFlag(featureFlagName,featureFlagStatus);
		break;

	case setTrafficRatio:
        var trafficRatio = Number(process.argv[3]);
        setTrafficRatio(trafficRatio);
        break;

	case addUrl:
        var urlListName = process.argv[3];
        var urlName = process.argv[4];
        addUrl(urlListName,urlName);
        break;

	case addServer:
        var serverListName = process.argv[3];
        var serverName = process.argv[4];
        addUrl(serverListName,serverName);
        break;

    case removeUrl:
        var urlListName = process.argv[3];
        var urlName = process.argv[4];
        removeUrl(urlListName,urlName);
        break;

        break;

    case removeServer:
        var serverListName = process.argv[3];
        var serverName = process.argv[4];
        removeServer(serverListName,serverName);
}

/*
node redis-operation.js setFeatureFlag feature1 false/true
node redis-operation.js setTrafficRatio 1.0
node redis-operation.js addServer prodServers 192.168.97.97
node redis-operation.js removeUrl canUrls 192.168.98.98
node redis-operation.js removeServer CanServers 192.168.97.97
node redis-operation.js addUrl ProdUrls 192.168.98.98
*/