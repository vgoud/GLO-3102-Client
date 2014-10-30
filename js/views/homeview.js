/**
 * Created by Charles on 2014-10-30.
 */


window.UB.Views.HomeView = Backbone.View.extend({

    initialize: function () {
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});