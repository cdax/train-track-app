/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
    'use strict';

    App.Views.StationForm = Backbone.View.extend({

        template: _.template(
                '<input value="<%= ttString %>" type="text" class="typeahead form-control" >'
        ),

        tagName: 'form',

        events: {
            'blur input': 'validate',
            'focus input': 'clearStyles',
            'typeahead:autocompleted': 'validate',
            'typeahead:selected': 'validate',
            submit: 'validate'
        },

        initialize: function (options) {
            //this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.html(this.template(this.model.attributes));
        },
        
        clearStyles: function(e) {
            this.$el.removeClass('has-success');
            this.$el.removeClass('has-error');
        },
        
        validate: function(e) {
            var inp = this.$el.find('.typeahead.tt-input').typeahead('val').trim().toUpperCase();
            
            if(inp === '') {
                this.$el.removeClass('has-success');
                this.$el.removeClass('has-error');
            } else if(_.find(this.collection.models, function(model) {
                //Also match name and code
                return model.get('ttString').trim().toUpperCase() === inp;
            }) === undefined) {
                console.log('ERROR');
                this.$el.removeClass('has-success');
                this.$el.addClass('has-error');
            } else {
                console.log('SUCCESS');
                this.$el.removeClass('has-error');
                this.$el.addClass('has-success');
            }
        }

    });

})();
