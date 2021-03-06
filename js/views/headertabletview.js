/**
 * Created by Michel on 08/11/2014.
 */
window.UB.Views.HeaderTabletView = Backbone.View.extend({

    el: "#tablet-view-container",

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
