/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
    'use strict';

    App.Models.PnrResponse = Backbone.Model.extend({

        urlRoot: '/pnrstatus',

        initialize: function() {
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            if(response.result) {
                _.extend(response, response.result);
                delete response.result;
                console.log(response);
            }
            return response;
        }
    });

})();
