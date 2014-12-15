/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
    'use strict';

    App.Views.TrainInfo = Backbone.View.extend({

        template: _.template(
            //TODO: Change header font-size by screen-size, using media queries
            //TODO: Add a sub-view for Live Status
            //TODO: Add links to the top for easy nav
            //TODO: Add above links and Train name / no to a sticky top nav
            '<div class="view-content-wrapper">' +
                '<div class="train-info-header">' +
                    '<h1><span class="train-info-header-trainno"><%= route.result.trainno %></span>&nbsp;' + 
                    '<span class="train-info-header-name"><%= route.result.name %></span></h1>' +
                '<br />' +
                '<h4>' + 
                    '<%= route.result.route[0].stn[0].name %>&nbsp;<span class="train-info-station-code"><%= route.result.route[0].stn[0].code %></span> <i class="fa fa-long-arrow-right"></i> ' + 
                    '<span class="train-info-station-code"><%= route.result.route[0].stn[route.result.route[0].stn.length - 1].code %></span>&nbsp;<%= route.result.route[0].stn[route.result.route[0].stn.length - 1].name %>' + 
                    '' +
                '</h4>' +
                '<br />' +
            '</div>' +
                '<div id="fare" class="panel panel-default">' + 
                    '<div class="panel-body panel-body-w-border">' +
                        '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6">' + 
                            '<h4>Fare</h4>' + 
                        '</div>' +
                        '<div class="col-xs-6 col-sm-6 col-md-6 col-lg-6 text-right">' + 
                            '<div class="view-fare-fare">' +
                                '<h4 class="pull-right"><i class="fa fa-rupee"></i>&nbsp;1,340.00</h4>' +
                                //TODO: Show travel time and seat availability
                            '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="panel-body">' +
                        '<div class="row">' + 
                            '<div class="col-xs-12 col-sm-9 col-md-9 col-lg-9">' +
                                '<form role="form">' +
                                    '<div class="row">' + 
                                        '<div class="form-group col-xs-12 col-sm-6 col-md-6 col-lg-6">' +
                                                '<label for="srcFareSelect" class="control-label text-left">From</label>' +
                                                '<select id="srcFareSelect" class="form-control">' +
                                                    '<% _.each(route.result.route[0].stn, function(station, index) { %>' +
                                                        '<% if(index != route.result.route[0].stn.length - 1) { %>' +
                                                            '<option value="<%= station.code %>" ' +
                                                               '<% if(index == 0) { %>' + 
                                                                    'selected' + 
                                                                '<% } %>' + 
                                                            '>' + 
                                                                '<%= station.name %>&nbsp;' + 
                                                            '</option>' +
                                                        '<% } %>' +
                                                    '<% }); %>' +
                                                '</select>' +
                                          '</div>' +
                                          '<div class="form-group col-xs-12 col-sm-6 col-md-6 col-lg-6">' +
                                                '<label for="destFareSelect" class="control-label text-left">To</label>' +
                                                '<select id="destFareSelect" class="form-control">' +
                                                    '<% _.each(route.result.route[0].stn, function(station, index) { %>' +
                                                        '<% if(index != 0) { %>' +
                                                            '<option value="<%= station.code %>" ' +
                                                               '<% if(index == route.result.route[0].stn.length - 1) { %>' + 
                                                                    'selected' + 
                                                                '<% } %>' + 
                                                            '>' + 
                                                                '<%= station.name %>&nbsp;' + 
                                                            '</option>' +
                                                        '<% } %>' +
                                                    '<% }); %>' +
                                                '</select>' +
                                          '</div>' +
                                    '</div>' + 
                                    '<div class="row">' +
                                        '<div class="form-group col-xs-12 col-sm-6 col-md-6 col-lg-6">' +
                                            '<label for="clsFareSelect" class="control-label text-left">Class of Travel</label>' +
                                            '<select id="clsFareSelect" class="form-control">' +
                                                '<% _.each(route.result.route[0].cls, function(cl, index) { %>' +
                                                    '<option value="<%= cl[0] %>"' +
                                                        '<% if(index == 0) { %>' + 
                                                            'selected' + 
                                                        '<% } %>' + 
                                                    '>' +
                                                        '<%= cl[1] %>' +
                                                    '</option>' +
                                                '<% }); %>' +
                                            '</select>' +
                                        '</div>' +
                                        '<div class="form-group col-xs-12 col-sm-6 col-md-6 col-lg-6">' +
                                            '<label for="quotaFareSelect" class="control-label text-left">Quota</label>' +
                                            '<select id="quotaFareSelect" class="form-control">' +
                                                '<% _.each(fare.quotas, function(quota, index) { %>' +
                                                    '<option value="<%= quota[0] %>"' +
                                                        '<% if(index == 0) { %>' + 
                                                            'selected' + 
                                                        '<% } %>' + 
                                                    '>' +
                                                        '<%= quota[1] %>' +
                                                    '</option>' +
                                                '<% }); %>' +
                                            '</select>' +
                                        '</div>' +
                                    '</div>' +
                                    '<div class="row">' +
                                        '<div class="form-group col-xs-6 col-sm-3 col-md-3 col-lg-3">' +
                                            '<label for="adultsFareSelect" class="control-label text-left">Adults</label>' +
                                            '<select id="adultsFareSelect" class="form-control">' +
                                                '<option value="0">0</option>' +
                                                '<option value="1" selected>1</option>' +
                                                '<option value="2">2</option>' +
                                                '<option value="3">3</option>' +
                                                '<option value="4">4</option>' +
                                                '<option value="5">5</option>' +
                                            '</select>' +
                                        '</div>' +
                                        '<div class="form-group col-xs-6 col-sm-3 col-md-3 col-lg-3">' +
                                            '<label for="childrenFareSelect" class="control-label text-left">Children</label>' +
                                            '<select id="childrenFareSelect" class="form-control">' +
                                                '<option value="0" selected>0</option>' +
                                                '<option value="1">1</option>' +
                                                '<option value="2">2</option>' +
                                                '<option value="3">3</option>' +
                                                '<option value="4">4</option>' +
                                                '<option value="5">5</option>' +
                                            '</select>' +
                                        '</div>' +
                                        '<div class="form-group col-xs-6 col-sm-3 col-md-3 col-lg-3">' +
                                            '<label for="seniorMalesFareSelect" class="control-label text-left">(M) Senior Citizens</label>' +
                                            '<select id="seniorMalesFareSelect" class="form-control">' +
                                                '<option value="0" selected>0</option>' +
                                                '<option value="1">1</option>' +
                                                '<option value="2">2</option>' +
                                                '<option value="3">3</option>' +
                                                '<option value="4">4</option>' +
                                                '<option value="5">5</option>' +
                                            '</select>' +
                                        '</div>' +
                                        '<div class="form-group col-xs-6 col-sm-3 col-md-3 col-lg-3">' +
                                            '<label for="seniorFemalesFareSelect" class="control-label text-left">(F) Senior Citizens</label>' +
                                            '<select id="seniorFemalesFareSelect" class="form-control">' +
                                                '<option value="0" selected>0</option>' +
                                                '<option value="1">1</option>' +
                                                '<option value="2">2</option>' +
                                                '<option value="3">3</option>' +
                                                '<option value="4">4</option>' +
                                                '<option value="5">5</option>' +
                                            '</select>' +
                                        '</div>' +
                                    '</div>' +
                                '</form>' +
                            '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div id="coaches" class="panel panel-default">' + 
                    '<div class="panel-body">' +
                        '<h4>Coaches</h4>' +
                        '<div>' + 
                            '<% _.each(coaches.result.coaches, function(coach) { %>' +
                                '<span class="train-info-coach">' + 
                                    '<%= coach.prsid %>' + 
                                '</span><i class="fa fa-caret-left"></i>' +
                            '<% }); %>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
                '<div id="route" class="panel panel-default">' + 
                    '<div class="panel-body">' +
                        '<h4>Route&nbsp;<small><a class="pull-right" href="#"><i class="fa fa-filter"></i>&nbsp;<%= route.result.route[0].stn.length %> stops</a></small></h4>' +
                    '</div>' +
                    '<table class="table table-striped">' + 
                        '<tr class="thead">' + 
                            '<th>Station</th>' + 
                            '<th class="text-center hidden-xs">Day</th>' + 
                            '<th class="text-center"><span class="hidden-xs">Arrival</span><span class="visible-xs-block">Arr</span></th>' + 
                            '<th class="text-center"><span class="hidden-xs">Departure</span><span class="visible-xs-block">Dep</span></th>' + 
                            '<th class="text-center">Halt</th>' + 
                        '</tr>' +
                        '<% _.each(fullroute.result.route, function(station) { %>' +
                            '<tr' +
                                '<% if(station.stop === "Y") { %>' +
                                    ' class="train-info-stn-stop"' +
                                '<% } %>' +
                            '>' + 
                                '<td class="train-info-stn-name"><a href="#s/<%= station.code %>"><span class="hidden-xs">' + 
                                    '<% if(station.stop === "Y") { %>' +
                                        '<strong>' +
                                    '<% } %>' +
                                    '<%= station.name %>&nbsp;' +
                                    '<% if(station.stop === "Y") { %>' +
                                        '</strong>' +
                                    '<% } %></span><span class="train-info-station-code"><%= station.code %>' +
                                '</span></a></td>' + 
                                '<td class="text-center hidden-xs"><%= station.day %></td>' +
                                '<td class="text-center"><span class="hidden-xs"><%= station.arr_civ %></span><span class="visible-xs-block"><%= station.arr %></span></td>' +
                                '<td class="text-center"><span class="hidden-xs"><%= station.dep_civ %></span><span class="visible-xs-block"><%= station.dep %></span></td>' +
                                '<td class="text-center">' + 
                                    '<% if(station.stop === "Y" && station.arr !== "" && station.dep !== "") { %>' +
                                        '<%= station.halt %><span class="hidden-xs">&nbsp;min</span><span class="visible-xs-inline">\'</span>' + 
                                    '<% } %>' +
                                '</td>' +
                            '</tr>' +
                        '<% }); %>' +
                    '</table>' +
                '</div>' +
            '</div>'
        ),

        tagName: 'div',

        id: '',

        className: '',

        events: {},

        initialize: function () {
            this.listenTo(this.model, 'change', this.render);
            this.pristine = true;
        },

        render: function () {
            this.$el.html(this.template(this.model.toJSON()));
            if(this.pristine) {
                console.log('Spying...');
                $('body').scrollspy({ target: '.train-info-header' , offset: 200});
                this.pristine = false;
            }
        }

    });

})();
