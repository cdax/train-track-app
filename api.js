var 
	request 	= require('request'),
	url 		= require('url'),
	Promise		= require('q'),
	_			= require('underscore'),
	cache		= require('./cache'),
	config  	= require('./config'),
	types		= require('./types');

var endpoints = {
	
	//Stations
	//Get the result of all the stations with their station code and name.
	'stations': {
		blacklisted: true,
		cache: {
			ttl: 21600000,
			response: true
		},
		params: {}
	},

	//Trains
	//Get trains between two given stations.
	'trains': {
		blacklisted: true,
		cache: {
			ttl: 43200000,
			response: true
		},
		params: {
			'stnfrom': {
				blacklisted: false,
				required: true,
				type: types.stationCode
			},
			'stnto': {
				blacklisted: false,
				required: true,
				type: types.stationCode
			}
		}
	},

	//Route
	//Get route(s) of given train number. List of all available routes will be returned.
	'route': {
		blacklisted: false,
		cache: {
			ttl: 1000,
			response: false
		},
		params: {
			'trainno': {
				blacklisted: false,
				required: true,
				type: types.trainNumber
			}
		}
	},

	//Full Route
	//Get full route of given train number. 
	//List of stations in route of train will be displayed, showing all passing stations also.
	'fullroute': {
		blacklisted: false,
		cache: {
			ttl: 1000,
			response: false
		},
		params: {
			'trainno': {
				blacklisted: false,
				required: true,
				type: types.trainNumber
			}
		}
	},

	//Fare
	//Get fare for the journey from source station to destination station.
	'fare': {
		blacklisted: false,
		cache: {
			ttl: 1000,
			response: false
		},
		params: {
			'trainno': {
				blacklisted: false,
				required: true,
				type: types.trainNumber
			},
			'stnfrom': {
				blacklisted: false,
				required: true,
				type: types.stationCode
			},
			'stnto': {
				blacklisted: false,
				required: true,
				type: types.stationCode
			},
			'age': {
				blacklisted: false,
				required: true,
				type: types.age
			},
			'quota': {
				blacklisted: false,
				required: true,
				type: types.quota
			},
			'date': {
				blacklisted: false,
				required: true,
				type: types.date
			},
			'class': {
				blacklisted: false,
				required: false,
				type: types.class
			}
		}
	},

	//PNR Status
	//Get details of given PNR number.
	'pnr': {
		blacklisted: false,
		cache: {
			ttl: 1000,
			response: false
		},
		params: {
			'pnr': {
				blacklisted: false,
				required: true,
				type: types.pnr
			}
		}
	},

	//Live Status
	//Get live running status of the given train.  
	'live': {
		blacklisted: false,
		cache: {
			ttl: 1000,
			response: false
		},
		params: {
			'trainno': {
				blacklisted: false,
				required: true,
				type: types.trainNumber
			},
			'stnfrom': {
				blacklisted: false,
				required: true,
				type: types.stationCode
			},
			'date': {
				blacklisted: false,
				required: true,
				type: types.date
			}
		}
	},

	//Seat Availability
	//Get seats availability in given train between given pair of stations in given quota, class and date.
	'seats': {
		blacklisted: false,
		cache: {
			ttl: 1000,
			response: false
		},
		params: {
			'trainno': {
				blacklisted: false,
				required: true,
				type: types.trainNumber
			},
			'stnfrom': {
				blacklisted: false,
				required: true,
				type: types.stationCode
			},
			'stnto': {
				blacklisted: false,
				required: true,
				type: types.stationCode
			},
			'quota': {
				blacklisted: false,
				required: true,
				type: types.quota
			},
			'class': {
				blacklisted: false,
				required: true,
				type: types.class
			},
			'date': {
				blacklisted: false,
				required: true,
				type: types.date
			}
		}
	},

	//Coach Composition
	//Get coach Composition of a given train.
	'coaches': {
		blacklisted: false,
		cache: {
			ttl: 1000,
			response: false
		},
		params: {
			'trainno': {
				blacklisted: false,
				required: true,
				type: types.trainNumber
			}
		}
	},

	//Cancelled Trains
	//Get a list of all cancelled trains.
	'cancelled': {
		blacklisted: false,
		cache: {
			ttl: 1000,
			response: false
		},
		params: {
			'date': {
				blacklisted: false,
				required: true,
				type: types.dateCode
			}
		}
	},

	//Diverted Trains
	//Get a list of all diverted trains.
	'diverted': {
		blacklisted: false,
		cache: {
			ttl: 1000,
			response: false
		},
		params: {
			'date': {
				blacklisted: false,
				required: true,
				type: types.dateCode
			}
		}
	},

	//Rescheduled Trains
	//Get a list of all rescheduled trains.
	'rescheduled': {
		blacklisted: false,
		cache: {
			ttl: 1000,
			response: false
		},
		params: {
			'date': {
				blacklisted: false,
				required: true,
				type: types.dateCode
			}
		}
	},

	//Trains at Station
	//Get list of trains at given station withing in given hours.
	'trainsatstation': {
		blacklisted: false,
		cache: {
			ttl: 1000,
			response: false
		},
		params: {
			'stnfrom': {
				blacklisted: false,
				required: true,
				type: types.stationCode
			},
			'hr': {
				blacklisted: false,
				required: true,
				type: types.hour
			},
			'stnto': {
				blacklisted: false,
				required: false,
				type: types.stationCode
			}
		}
	}
};

//sanitize the API call
var sanitize = function(endpoint, params) {

	params = params || {};

	//keep only known and whitelisted parameters
	params = _.pick(params, _.keys(endpoints[endpoint].params));
	_.each(params, function(val, param) {
		if(endpoints[endpoint].params[param].blacklisted)
			delete params[param];
	});

	//check whether any required parameters are missing (required > blacklisted)
	_.each(endpoints[endpoint].params, function(val, param) {
		if(params[param] === undefined && val.required)
			throw new Error('API: Malformed call to "/' + endpoint + '"');
	});

	//check whether parameter values are valid
	_.each(params, function(val, param) {
		if(!endpoints[endpoint].params[param].type.isValid(val))
			throw new Error('API: Malformed call to "/' + endpoint + '"');
	});

	return params;
};

//make the API call
var get = function(endpoint, params) {
    
    //Let the Promise chain commence!
    return Promise.try(function(endpoint, params) {
        
        endpoint = endpoint || ''; 
        params = params || {};
        //check whether the endpoint is valid
        if(!_.has(endpoints, endpoint))
            throw new Error('API: Cannot call "/' + endpoint + '"');
        //keep only known and whitelisted parameters
        params = _.pick(params, _.keys(endpoints[endpoint].params));
        _.each(params, function(val, param) {
            if(endpoints[endpoint].params[param].blacklisted)
                delete params[param];
        });
        //check whether any required parameters are missing (required > blacklisted)
        _.each(endpoints[endpoint].params, function(val, param) {
            if(params[param] === undefined && val.required)
                throw new Error('API: Malformed call to "/' + endpoint + '"');
        });
        //check whether parameter values are valid
        _.each(params, function(val, param) {
            if(!endpoints[endpoint].params[param].type.isValid(val))
                throw new Error('API: Malformed call to "/' + endpoint + '"');
        });    
        //Construct the cache key
        var paramPairs = _.pairs(params).map(function(args) {
            return args[0] + '=' + args[1];
        });
        var cacheKey = endpoint + '?key=' + config.api.key + (paramPairs.length > 0 ? ('&' + paramPairs.sort().join('&')) : ''); 
        //Pass the cache key for lookup
        return cacheKey;
            
	}, endpoint, params)
    .then(cache.get)
    .spread(function(key, value) {
        
            //Cache lookup failed
            if(value == null) {
                //Make call to API and cache the returned value
                //Construct API call URL
                console.log('Calling API...');
                var callURL = url.resolve(config.api.host, key);
                console.log(callURL);
                return [true, key, Promise.nfcall(request.get, callURL)];
            }
            //Cache lookup succeeded
            else {
                console.log('Serving from cache...');
                return [false, key, [null, value]];
            }
    }).spread(function(doCache, key, response) {
        var body = response[1];
        if(doCache) {
            //cache the value
            var endpoint = key.substring(0, key.indexOf('?') == -1 ? key.length : key.indexOf('?'));
            return cache.set(key, body);
        } else {
            return [key, body, null];
        }
    }).spread(function(key, body, response) {
        console.log(body);
        return body;
    });
    //Check whether response is in cache
    //If response is in cache, serve from cache
    //If response is not in cache, check whether there are more than 5 requests in the API call history
    //If there are less than 5 calls in the API call history, make an API call
    //After making the API call, cache the request in the API call history, and the response (if required)
    //Return the response
};

module.exports = get;