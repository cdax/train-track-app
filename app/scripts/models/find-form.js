/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
    'use strict';

    App.Models.FindForm = Backbone.Model.extend({

        url: '',

        initialize: function() {
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            return response;
        }
    });

})();
