var redis = require('redis')
var client = redis.createClient(6379, '127.0.0.1', {});
var operation = process.argv[2];

var setFeatureFlag = function (featureFlagName,featureFlagStatus) {

    client.set(featureFlagName, featureFlagStatus, function(err, reply) {
        if (err) throw err;
        console.log("Feature " + featureFlagName +  " has been set to " + featureFlagStatus);
        process.exit(0);
    });

};

var setTrafficRatio = function (trafficRatio) {

    client.set("trafficRatio", trafficRatio, function(err, reply) {
        if (err) throw err;
        console.log("trafficRatio has been set to " + trafficRatio);
        process.exit(0);
    });

};

var addUrls = function (urlListName, urlNames) {
    var urlEndPoints = urlNames.split(',');
    for(var i = 0; i < urlEndPoints.length; i++) {
        client.rpush([urlListName, urlEndPoints[i]], function(err, reply) {
            if (err) throw err;
            console.log(urlEndPoints[i] + " has been added to the list of " + urlListName);
        });
    }
    process.exit(0);
};

var addServer = function (serverListName, serverName) {

    client.rpush([serverListName, serverName], function(err, reply) {
        if (err) throw err;
        console.log(serverListName + " has been added to the list of " + serverName);
    });
    process.exit(0);
};

var removeUrls = function (urlListName, urlNames) {

    var urlEndPoints = urlNames.split(',');
    for(var i = 0; i < urlEndPoints.length; i++) {
        client.lrem(urlListName, 0, urlEndPoints[i], function(err, reply) {
            if (err) throw err;
            console.log(urlEndPoints[i] + " has been removed from the list of " + urlListName);
        });
    }
    process.exit(0);
};

var removeServer = function (serverListName, serverName) {

    client.lrem(serverListName, 0 , serverName, function(err, reply) {
        if (err) throw err;
        console.log(serverName + " has been removed from the list of " + serverListName);
    });
    process.exit(0);

};

switch(operation){
	case 'setFeatureFlag':
		var featureFlagName = process.argv[3];
        var featureFlagStatus = process.argv[4];
        setFeatureFlag(featureFlagName,featureFlagStatus);
		break;

	case 'setTrafficRatio':
        var trafficRatio = Number(process.argv[3]);
        setTrafficRatio(trafficRatio);
        break;

	case 'addUrls':
        var urlListName = process.argv[3];
        var urlNames = process.argv[4];
        addUrls(urlListName,urlNames);
        break;

	case 'addServer':
        var serverListName = process.argv[3];
        var serverName = process.argv[4];
        addUrl(serverListName,serverName);
        break;

    case 'removeUrls':
        var urlListName = process.argv[3];
        var urlNames = process.argv[4];
        removeUrls(urlListName,urlNames);
        break;

    case 'removeServer':
        var serverListName = process.argv[3];
        var serverName = process.argv[4];
        removeServer(serverListName,serverName);
}

/*
node redis-operation.js setFeatureFlag feature1 false/true
node redis-operation.js setTrafficRatio 1.0
node redis-operation.js addServer prodServers 192.168.97.97
node redis-operation.js removeUrls canUrls /api/newFeature/bad
node redis-operation.js removeServer canServers 192.168.97.97
node redis-operation.js addUrls prodUrls /api/newFeature/good,/api/newFeature2/good,/api/newFeature3/good
*/