/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
    'use strict';

    App.Models.TrainInfo = Backbone.Model.extend({

        urlRoot: '/tinfo',

        initialize: function() {
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            
            var mil = '', hr = 0, arrInt = 0, depInt = 0;
            var classHash = {
                '1A': 'First AC (1A)',
                '2A': '2 Tier AC (2A)',
                '3A': '3 Tier AC (3A)',
                'CC': 'Chair Car (CC)',
                'FC': 'First Class (FC)',
                'SL': 'Sleeper (SL)',
                '2S': '2nd Sitting (2S)',
                '3E': '3 Tier Economy (3E)',
                'GN': 'General (GN)'
            };
            
            //Add quotas
            response.fare = {};
            response.fare.quotas = [
                ['GN', 'General (GN)'],
                ['CK', 'Tatkal Quota (CK)'],
                ['LD', 'Ladies Quota (LD)'],
                ['DF', 'Defence Quota (DF)'],
                ['FT', 'Foreign Tourist (FT)'],
                ['DP', 'Duty Pass Quota (DP)'],
                ['HP', 'Handicapped Quota (HP)'],
                ['PH', 'Parliament House Quota (PH)'],
                ['SS', 'Lower Berth Quota (SS)'],
                ['YU', 'Yuva Quota (YU)']
            ];
            
            //TODO: Expand cmprsd trn nms by doing a dictionary lookup
            
            //Convert concatenated class string to class array
            response.route.result.route[0].cls = response.route.result.route[0].cls.split(' ');
            response.route.result.route[0].cls = _.filter(response.route.result.route[0].cls, function(cl) {
                return !_(classHash[cl]).isUndefined();
            });
            response.route.result.route[0].cls = _.map(response.route.result.route[0].cls, function(cl) {
                return [cl, classHash[cl]];
            });
            
            _.each(response.fullroute.result.route, function(station, index) {
                
                //Convert station names from UPPER CASE to Title Case
                station.name = station.name.toLowerCase().replace(/[A-Za-z0-9]+/g, function(fragment) {
                    return fragment.charAt(0).toUpperCase() + fragment.substr(1).toLowerCase();
                });
                response.fullroute.result.route[index].name = station.name;
                
                //Convert military time to civilian time
                if(station.arr !== null && station.arr.trim() !== '') {
                    mil = station.arr.replace(/[^0-9]/, '');
                    mil = ('0000' + mil).substr(mil.length, mil.length + 4);
                    hr = ((mil[0] - '0') * 10 + (mil[1] - '0'));
                    arrInt = hr * 60 + (mil[2] - '0') * 10 + (mil[3] - '0');
                    station.arr_civ = (hr == 0 ? '12' : (hr > 12 ? (hr - 12) : hr).toString()) + ':' + mil.substr(2) + ' ' + (hr >= 12 ? 'PM' : 'AM');
                } else {
                    station.arr_civ = station.arr;
                }
                if(station.dep !== null && station.dep.trim() !== '') {
                    mil = station.dep.replace(/[^0-9]/, '');
                    mil = ('0000' + mil).substr(mil.length, mil.length + 4);
                    hr = ((mil[0] - '0') * 10 + (mil[1] - '0'));
                    depInt = hr * 60 + (mil[2] - '0') * 10 + (mil[3] - '0');
                    station.dep_civ = (hr == 0 ? '12' : (hr > 12 ? (hr - 12) : hr).toString()) + ':' + mil.substr(2) + ' ' + (hr >= 12 ? 'PM' : 'AM');
                } else {
                    station.dep_civ = station.dep;
                }
                
                //Calculate halt durations
                station.halt = (depInt >= arrInt ? (depInt - arrInt) : (24 * 60 - arrInt + depInt));
            });
            console.log(response);
            return response;
        }
    });

})();
