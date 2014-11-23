/**
 * Created by Vincent on 2014-11-01.
 */

window.UB.Views.GlobalView = Backbone.View.extend({

    el: "body",

    render: function() {
        this.$el.html(this.template());
        return this;
    }

});