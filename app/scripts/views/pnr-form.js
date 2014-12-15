/*global App, Backbone, JST*/

App.Views = App.Views || {};

(function () {
    'use strict';

    App.Views.PnrForm = Backbone.View.extend({

        template: _.template(
            '<form role="form">' + 
                '<div class="form-group pnr-form-group">' +
                    '<label for="pnrInput" class="control-label">Your 10-digit PNR</label>' + 
                    '<input type="text" class="form-control" id="pnrInput" value="<%= pnr %>">' +
                '</div>' +
                '<button type="button" class="btn btn-success">Check Status</button>' + 
            '</form>'
        ),

        tagName: 'div',

        id: 'pnrForm',

        className: '',

        events: {
            'submit': 'submit',
            'click button': 'submit'
        },

        initialize: function () {
            this.listenTo(this.model, 'invalid', this.raiseValidationErrors);
        },

        render: function () {
            this.$el.html(this.template(this.model.attributes));
            return this;
        },
        
        submit: function(e) {
            e.preventDefault();
            
            this.model.set('pnr', this.$el.find('#pnrInput').val());
            
            if(!this.model.isValid()) {
                return;
            } else {
                this.undoValidationErrors();
            }
            
            this.beginWait();
            App.EventAggregator.trigger('pnrForm:submit', this.model.get('pnr'));
        },
        
        beginWait: function() {
            this.$el.find('button').html('Checking <i class="fa fa-circle-o-notch fa-spin"></i>');
        },
        
        stopWait: function() {
            this.$el.find('button').text('Check Status');
        },
        
        undoValidationErrors: function() {
            
            //PNR Validation Errors
            this.$el.find('.pnr-form-group').removeClass('has-error');
            this.$el.find('.pnr-form-group label').text('Your 10-digit PNR');
        },
        
        raiseValidationErrors: function(e) {
            var el = this.$el;
            e.validationError.forEach(function(error) {
                switch(error.attr) {
                    
                    case 'pnr':
                        el.find('.pnr-form-group').addClass('has-error');
                        el.find('.pnr-form-group label').text(error.message);
                        break;
                }
            });
        }

    });

})();
