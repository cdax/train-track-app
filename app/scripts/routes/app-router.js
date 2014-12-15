/*global App, Backbone*/

App.Routers = App.Routers || {};

(function () {
    'use strict';

    App.Routers.AppRouter = Backbone.Router.extend({
        
        routes: {
            '': 'find',
            'f': 'find',
            'p': 'pnr',
            't/:trainNo': 'trainInfo',
            's/:stnCode': 'stationInfo'
        },
        
        start: function() {
            Backbone.history.start();
        },
        
        find: function() {
            //Avoid if this is the currently displayed view
            //Also, close the app drawer sidebar when a link is clicked.
            $('.view').hide({
                duration: 400
            });
            $('.view-find-trains').show({
                duration: 400
            });
            
            App.EventAggregator.trigger('domchange:title', 'Find Trains');
        },
        
        pnr: function() {
            
            $('.view').hide({
                duration: 400
            });
            $('.view-pnr-check').show({
                duration: 400
            });
            $('.view-pnr-response').show({
                duration: 400
            });
            
            App.EventAggregator.trigger('domchange:title', 'Check PNR Status');
             
            var 
                pnrForm = new App.Views.PnrForm({model: new App.Models.PnrForm(), el: $('.pnr-form-placeholder')});
                pnrForm.render();

            var 
                pnrResponseData = new App.Models.PnrResponse(),
                pnrResponse = new App.Views.PnrResponse({model: pnrResponseData, el: $('.pnr-response-placeholder')});

            App.EventAggregator.on('pnrForm:submit', function(pnr) {
                pnrResponseData.set({'id': pnr}, {silent: true});
                pnrResponseData.fetch();
            });

            App.EventAggregator.on('pnrResponse:sync', function() {
                pnrForm.stopWait();
            });
        },
        
        trainInfo: function(trainNo) {
            
            $('.view').hide({
                duration: 400
            });
            $('.view-train-info').show({
                duration: 400
            });
            
            App.EventAggregator.trigger('domchange:title', 'Train Information');
            
            var trainInfoData = new App.Models.TrainInfo({id: trainNo}),
                trainInfoView = new App.Views.TrainInfo({model: trainInfoData, el: $('.train-info-placeholder')});
            
            trainInfoData.fetch();
        },
        
        stationInfo: function(stnCode) {
            
            $('.view').hide({
                duration: 400
            });
            $('.view-station-info').show({
                duration: 400
            });
            
            App.EventAggregator.trigger('domchange:title', 'Station Information');
            
            var stationInfoData = new App.Models.StationInfo({id: stnCode}),
                stationInfoView = new App.Views.StationInfo({model: stationInfoData, el: $('.station-info-placeholder')});
            
            stationInfoData.fetch();
        }
    });

})();
