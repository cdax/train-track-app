/*global App, $*/


window.App = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
        
    EventAggregator: _.extend({}, Backbone.Events),
    
    init: function () {
        'use strict';
        
        App.EventAggregator.on('domchange:title', this.onDomChangeTitle, this);
    
        var router = new App.Routers.AppRouter();
        router.start();
    
        console.log('Hello from Backbone!');
    },
    
    onDomChangeTitle: function(title) {
        $(document).attr('title', title);
    }
};

$(document).ready(function () {
    'use strict';
    App.init();
    
    //From and To should be tied to the from and to input fields
    var stations = new App.Collections.Station();
    
    stations.on('reset', function() {
        
        var stationsEngine = new Bloodhound({
            //TODO: figure out a way to ignore brackets ()
            datumTokenizer: Bloodhound.tokenizers.obj.whitespace('ttString'),
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: $.map(stations.models, function(station) {
                return station.attributes;
            })
        });
        stationsEngine.initialize();
        
        var srcStation = new App.Models.Station(), 
            destStation = new App.Models.Station(),
            srcStationForm = new App.Views.StationForm({model: srcStation, collection: stations}), 
            destStationForm = new App.Views.StationForm({model: destStation, collection: stations});
        
        //srcStationForm.collection = stations;
        
        srcStationForm.render(); destStationForm.render();
        
        $('#depDateInput').datepicker();
        
        //$('.dep-date-form').append(picker.el);
        
        $('.src-station').append(srcStationForm.el);
        $('.dest-station').append(destStationForm.el);
        
        $('.typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        }, {
            name: 'stations',
            displayKey: 'ttString',
            source: stationsEngine.ttAdapter(),
            templates: {
                suggestion: _.template('<span class="badge pull-right"><%= code %></span> <%= name %>')
            }
        });
        
        console.log('fetched');
    });
    
    stations.fetch({reset: true});
    
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
});