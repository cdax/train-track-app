/*global App, Backbone*/

App.Models = App.Models || {};

(function () {
    'use strict';

    App.Models.StationInfo = Backbone.Model.extend({

        urlRoot: '/sinfo',

        initialize: function() {
        },

        defaults: {
        },

        validate: function(attrs, options) {
        },

        parse: function(response, options)  {
            
            var mil = '', hr = 0, mi = 0, arrInt = 0, depInt = 0;
            
            //Convert stationname from UPPER CASE to Title Case
            response.result.stationname = response.result.stationname.toLowerCase().replace(/[A-Za-z0-9]+/g, function(fragment) {
                return fragment.charAt(0).toUpperCase() + fragment.substr(1).toLowerCase();
            });
            
            _.each(response.result.trains, function(train) {
                
                //Convert trainname from UPPER CASE to Title Case
                train.trainname = train.trainname.toLowerCase().replace(/[A-Za-z0-9]+/g, function(fragment) {
                    return fragment.charAt(0).toUpperCase() + fragment.substr(1).toLowerCase();
                });
                
                //Convert delayarr and delaydep from HH:MI to HHh MIm
                if(train.delayarr !== null && train.delayarr !== "RT") {
                    mil = train.delayarr.replace(/[^0-9]/, '');
                    mil = ('0000' + mil).substr(mil.length, mil.length + 4);
                    hr = ((mil[0] - '0') * 10 + (mil[1] - '0'));
                    mi = ((mil[2] - '0') * 10 + (mil[3] - '0'));
                    train.delayarr = (hr > 0 ? (hr + 'h ') : '') + (mi > 0 ? (mi + 'm') : '') + (hr + mi == 0 ? 'RT': '');
                }
                if(train.delaydep !== null && train.delaydep !== "RT") {
                    mil = train.delaydep.replace(/[^0-9]/, '');
                    mil = ('0000' + mil).substr(mil.length, mil.length + 4);
                    hr = ((mil[0] - '0') * 10 + (mil[1] - '0'));
                    mi = ((mil[2] - '0') * 10 + (mil[3] - '0'));
                    train.delaydep = (hr > 0 ? (hr + 'h ') : '') + (mi > 0 ? (mi + 'm') : '') + (hr + mi == 0 ? 'RT': '');
                }
                    
                if(train.exparr !== null && train.exparr.trim() !== '' && train.exparr.trim() !== 'SRC') {
                    mil = train.exparr.replace(/[^0-9]/, '');
                    mil = ('0000' + mil).substr(mil.length, mil.length + 4);
                    hr = ((mil[0] - '0') * 10 + (mil[1] - '0'));
                    arrInt = hr * 60 + (mil[2] - '0') * 10 + (mil[3] - '0');
                    train.exparr_civ = (hr == 0 ? '12' : (hr > 12 ? (hr - 12) : hr).toString()) + ':' + mil.substr(2) + ' ' + (hr >= 12 ? 'PM' : 'AM');
                } else {
                    train.exparr_civ = train.exparr;
                }
                if(train.expdep !== null && train.expdep.trim() !== '' && train.expdep.trim() !== 'DSTN') {
                    mil = train.expdep.replace(/[^0-9]/, '');
                    mil = ('0000' + mil).substr(mil.length, mil.length + 4);
                    hr = ((mil[0] - '0') * 10 + (mil[1] - '0'));
                    depInt = hr * 60 + (mil[2] - '0') * 10 + (mil[3] - '0');
                    train.expdep_civ = (hr == 0 ? '12' : (hr > 12 ? (hr - 12) : hr).toString()) + ':' + mil.substr(2) + ' ' + (hr >= 12 ? 'PM' : 'AM');
                } else {
                    train.expdep_civ = train.expdep;
                }
            });
            
            console.log(response);
            return response;
        }
    });

})();
