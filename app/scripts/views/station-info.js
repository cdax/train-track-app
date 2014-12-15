/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
    'use strict';

    App.Views.StationInfo = Backbone.View.extend({

        template: _.template(
            //TODO: Is it trains leaving or arriving in the next 24 hours?
            '<h1 class="station-info-header">' +
                '<span class="station-info-header-stncode"><%= result.station %></span>&nbsp;' + 
                '<span class="station-info-header-name"><%= result.stationname %></span>' + 
            '</h1>' +
            '<br />' +
            '<div class="panel panel-default">' + 
                '<div class="panel-body panel-body-w-border">' +
                    '<div class="col-xs-12 station-info-trains-header">' + 
                        '<h4 class="station-info-trains-title">Trains leaving in the next</h4>' + 
                        '<select class="station-info-trains-filter form-control">' +
                            '<option value="6">6 hours</option>' +
                            '<option value="12">12 hours</option>' +
                            '<option value="18">18 hours</option>' +
                            '<option value="24" selected>24 hours</option>' +
                        '</select>' +
                    '</div>' +
                '</div>' +
                '<table class="table table-striped">' + 
                    '<tr class="thead">' + 
                        '<th>Train</th>' +  
                        '<th class="text-center"><span class="hidden-xs">Arrival</span><span class="visible-xs-block">Arr</span></th>' + 
                        '<th class="text-center"><span class="hidden-xs">Departure</span><span class="visible-xs-block">Dep</span></th>' + 
                        '<th class="text-center">Platform</th>' + 
                    '</tr>' +
                    '<% _.each(result.trains, function(train) { %>' +
                        '<tr>' + 
                            '<td class="station-info-train-name"><a href="#t/<%= train.trainno %>"><span class="hidden-xs station-info-train-number"><%= train.trainno %>' +
                            '</span><span>' + 
                                '<%= train.trainname %>&nbsp;' +
                            '</span></a></td>' + 
                            '<td class="text-center' +
                                '<% if(train.exparr_civ === "SRC") { %>' +
                                    ' station-info-src-dest' +
                                '<% } %>">' +
                                '<span class="hidden-xs">' + 
                                    '<%= train.exparr_civ %>' + 
                                '</span>' + 
                                '<span class="visible-xs-block">' + 
                                    '<%= train.exparr %>' + 
                                '</span>' +
                                '<% if(train.delayarr !== "RT") { %>' +
                                    '<span class="station-info-delay">' +
                                        '<i class="fa fa-clock-o"></i>&nbsp;<%= train.delayarr %>' +
                                    '</span>' +
                                '<% } %>' +
                            '</td>' +
                            '<td class="text-center' +
                                '<% if(train.expdep_civ === "DSTN") { %>' +
                                    ' station-info-src-dest' +
                                '<% } %>">' +
                                '<span class="hidden-xs">' + 
                                    '<%= train.expdep_civ %>' + 
                                '</span>' + 
                                '<span class="visible-xs-block">' + 
                                    '<%= train.expdep %>' + 
                                '</span>' +
                                '<% if(train.delaydep !== "RT") { %>' +
                                    '<span class="station-info-delay">' +
                                        '<i class="fa fa-clock-o"></i>&nbsp;<%= train.delaydep %>' +
                                    '</span>' +
                                '<% } %>' +
                            '</td>' +
                            '<td class="text-center">' + 
                                '<% if(train.platform !== "" && train.platform !== "NA") { %>' +
                                    'P<%= train.platform %>' +
                                '<% } %>' +
                            '</td>' +
                        '</tr>' +
                    '<% }); %>' +
                '</table>' +
            '</div>'
        ),

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
        }

    });

})();
