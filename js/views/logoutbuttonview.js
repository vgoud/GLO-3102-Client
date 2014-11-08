/**
 * Created by Michel on 08/11/2014.
 */

window.UB.Views.LogoutButtonView = Backbone.View.extend({

    el: ".logout-button-container",

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});
