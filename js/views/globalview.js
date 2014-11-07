/**
 * Created by Vincent on 2014-11-01.
 */

window.UB.Views.GlobalView = Backbone.View.extend({

    el: "body",

    events: {
        "keyup" : "togglePlayPause"
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    },

    togglePlayPause: function (e) {
        if(e && e.keyCode == 32) {
            e.preventDefault();
            this.trigger("togglePlayPause", e);
        }
    }
});