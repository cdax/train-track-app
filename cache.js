//cache.js
//Module for interacting with the Redis cache

var 
    redis       = require('redis'),
    Promise     = require('q'),
    config      = require('./config'),
    exports     = {};

var client = redis.createClient(
    config.redis.port, 
    config.redis.host, {
        retry_max_delay: 100,
        max_attempts: 10,
    });

//get(key, callback): Fetches a key's value from the cache
//returns a promise or a callback
var get = exports.get = function(key) {
    return [key, Promise.ninvoke(client, 'get', key)];
};

//set(key, value, ttl, callback): Sets a key's value in the cache, along with a ttl
//returns a promise or a callback
var set = exports.set = function(key, value, ttl) {
    if(ttl)
        return [key, value, Promise.ninvoke(client, 'set', key, value, 'PX', ttl)];
    else
        return [key, value, Promise.ninvoke(client, 'set', key, value)];
};
    
module.exports = exports;