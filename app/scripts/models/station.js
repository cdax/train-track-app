/*global App, Backbone*/
/*
 * The 'Station' model
 * 
 * Attributes:
 *  code: Station code
 *  name: Station name
 *
 **/

App.Models = App.Models || {};

(function () {
    'use strict';

    App.Models.Station = Backbone.Model.extend({

        urlRoot: '/stations',

        initialize: function() {
        },

        defaults: {
            code: '',
            name: '',
            ttString: ''
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            
            //Concatenate 'code' and 'name' to serve the typeAhead
            response.ttString = response.name + ' (' + response.code + ')';
            
            return response;
        }
    });

})();
