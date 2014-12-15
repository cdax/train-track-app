/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
    'use strict';

    App.Views.PnrResponse = Backbone.View.extend({

        template: _.template(
                '<div class="text-center pnr-slip-header">HAVE A HAPPY JOURNEY</div>' +
                '<div class="pnr-slip-body">' +
                    '<div class="text-center">' +
                        '<a href="#t/<%= trainno %>"><strong><%= name %> (<%= trainno %>)</strong></a>' +
                    '</div>' + 
                    '<div class="row">' +
                        '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 text-center">' +
                            'BOARDING FROM<br /><strong><%= brdgName %></strong>' +
                        '</div>' +
                        '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 text-center">' +
                            'DESTINATION<br /><strong><%= toName %></strong>' +
                        '</div>' +
                    '</div>' + 
                    '<div class="row">' +
                        '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 text-center">' +
                            'BOARDING ON<br /><strong><%= journey %></strong>' +
                        '</div>' +
                        '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 text-center">' +
                            'CLASS<br /><strong><%= cls %></strong>' +
                        '</div>' +
                    '</div>' +
                    '<div class="text-center"><strong>--- PASSENGERS ---</strong></div>' +
                    '<table class="table table-striped text-center">' +
                        '<tr>' +
                            '<td></td>' +
                            '<td><strong>CURRENT STATUS</strong></td>' + 
                            '<td><strong>BOOKING STATUS</strong></td>' + 
                            '<td><strong>COACH</strong></td>' + 
                        '</tr>' +
                            '<% _.each(passengers, function(passenger, index) { %>' +
                                '<tr>' + 
                                    '<td>#<%= index %></td>' +
                                    '<td><strong><%= passenger.currentstatus %></strong></td>' +
                                    '<td><%= passenger.bookingstatus %></td>' +
                                    '<td><%= passenger.coach %></td>' +
                                '</tr>' + 
                            '<% }); %>' +
                    '</table>' + 
                    '<hr>' +
                    '<div class="text-center">(<%= chart %>)</div>' +
                '</div>'
        ),

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.listenTo(this.model, 'sync', this.raiseSyncEvent);
        },
        
        raiseSyncEvent: function() {
            App.EventAggregator.trigger('pnrResponse:sync');
        },

        render: function () {
            console.log(this.model.attributes);
            this.$el.show();
            this.$el.html(this.template(this.model.attributes));
        }

    });

})();
