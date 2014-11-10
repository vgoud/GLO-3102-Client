/**
 * Created by Michel on 08/11/2014.
 */
window.UB.Views.HeaderTabletView = Backbone.View.extend({

    el: "#tablet-view-container",

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});
