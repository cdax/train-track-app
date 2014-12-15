/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
    'use strict';

    App.Models.PnrForm = Backbone.Model.extend({

        url: '',

        initialize: function() {
        },

        defaults: {
            pnr: ''
        },

        validate: function(attrs, options) {
            
            var errors = [];
            
            if(!/^\d{10}$/.test(attrs.pnr.trim()))
                errors.push({ 
                    attr: 'pnr',
                    message: 'Please enter a valid 10-digit PNR'
                });
            
            if(errors.length > 0)
                return errors;
        },

        parse: function(response, options)  {
            return response;
        }
    });

})();
