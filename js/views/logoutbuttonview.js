/**
 * Created by Michel on 08/11/2014.
 */

window.UB.Views.LogoutButtonView = Backbone.View.extend({

    el: ".logout-button-container",

    events: {
        "click .btn-logout" : "onButtonLogoutClick"
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },

    onButtonLogoutClick: function () {
        this.trigger("logout");
    }
});
