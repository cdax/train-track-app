var express = require('express');
var logger = require('morgan');
var api = require('./api');
var _ = require('underscore');
var Promise = require('q');
var app = module.exports = express();

app.use(logger('dev'));

app.get('/stations', function(req, res) {
    api('stations', req.query).then(function(body) {
        
        //If a 'code' query was passed in
        if(req.query.code !== undefined) {
           res.send(_.find(JSON.parse(body), function(station) {
                return (station.code === req.query.code);
            }));
        } else {
            res.send(body);
        }
    }).catch(function(err) {
        console.log(err.stack);
    });
});

app.get('/stations/:code', function(req, res) {
    api('stations', req.query).then(function(body) {
        res.send(_.find(JSON.parse(body), function(station) {
            return (station.code === req.params.code);
        }));
    }).catch(function(err) {
        console.log(err.stack);
    });
});

app.get('/trains', function(req, res) {
    api('trains', req.query).then(function(body) {
        res.send(body);
    }).catch(function(err) {
        console.log(err.stack);
    });
});

app.get('/pnrstatus/:pnr', function(req, res) {
    api('pnr', {
        pnr: req.params.pnr
    }).then(function(body) {
        var bodyJSON = JSON.parse(body);
        if(bodyJSON.status === 'OK' && bodyJSON.result) {
            return [bodyJSON, api('stations')];
        } else {
            return [bodyJSON, null];
        }
    }).spread(function(bodyJSON, stationsStr) {
        console.log(bodyJSON, stationsStr);
        if(stationsStr) {
            var stations = JSON.parse(stationsStr);
            bodyJSON.result.brdgName = _.find(stations, function(station) {
                return (station.code === bodyJSON.result.brdg);
            }).name;
            bodyJSON.result.toName = _.find(stations, function(station) {
                return (station.code === bodyJSON.result.to);
            }).name;
        }
        res.send(JSON.stringify(bodyJSON));
        
    }).catch(function(err) {
        console.log(err.stack);
    });
});

app.get('/tinfo/:trainno', function(req, res) {
    Promise.all([
        api('route', {trainno: req.params.trainno}),
        api('fullroute', {trainno: req.params.trainno}),
        api('coaches', {trainno: req.params.trainno})
    ]).spread(function(route, fullroute, coaches) {
        
        res.send(JSON.stringify({
            //TODO: Move the JSON formatting bit to pre-cache to save on processing time once the response is cached
            route: JSON.parse(route),
            fullroute: JSON.parse(fullroute.replace(/'code':([A-Za-z0-9]{1,4})/g, '"code": "$1"').replace(/'/g, '"')),
            coaches: JSON.parse(coaches.replace(/'/g, '"'))
        }));
    }).catch(function(err) {
        console.log(err.stack);
    });
});

app.get('/sinfo/:stncode', function(req, res) {
    api('trainsatstation', {stnfrom: req.params.stncode, hr: 24}).then(function(body) {
        res.send(JSON.parse(body));
    }).catch(function(err) {
        console.log(err.stack);
    });
});

app.use(express.static(__dirname + '/app'));

/*app.get('/:endpoint', function(req, res) {
	console.log(req.params, req.query);
	api(req.params.endpoint, req.query).then(function(body) {
        res.send(body);
    }).catch(function(err) {
        console.log(err.stack);
    }).done();
});*/

if(!module.parent) {
	app.listen(4000);
	console.log('Express server listening on port 4000...');
}