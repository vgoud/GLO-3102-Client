/**
 * Created by Michel on 08/11/2014.
 */

window.UB.Views.HeaderMobileView = Backbone.View.extend({

    el: "#mobile-view-container",

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});
