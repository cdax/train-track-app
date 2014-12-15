/*global App, Backbone*/

App.Collections = App.Collections || {};

(function () {
    'use strict';

    App.Collections.Station = Backbone.Collection.extend({
        
        url: '/stations',

        model: App.Models.Station

    });

})();
