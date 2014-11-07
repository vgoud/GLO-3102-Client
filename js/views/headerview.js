/**
 * Created by Vincent on 2014-11-01.
 */

window.UB.Views.HeaderView = Backbone.View.extend({

    el: "#header-container",

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});