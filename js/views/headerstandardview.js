/**
 * Created by Michel on 08/11/2014.
 */

window.UB.Views.HeaderStandardView = Backbone.View.extend({

    el: "#standard-view-container",

    events: {
        "click .btn-logout" : "onButtonLogoutClick"
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    },

    onButtonLogoutClick: function () {
        this.trigger("logout");
    }
});