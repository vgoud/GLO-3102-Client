/**
 * Created by Michel on 08/11/2014.
 */

window.UB.Views.ParametersButtonView = Backbone.View.extend({

    el: ".parameters-button-container",

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});
