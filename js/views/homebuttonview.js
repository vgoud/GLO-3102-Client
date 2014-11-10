/**
 * Created by Michel on 08/11/2014.
 */

window.UB.Views.HomeButtonView = Backbone.View.extend({

    el: ".home-button-container",

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});
