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
//        e.preventDefault();
        var $target = $( e.target );
        if(e.keyCode == 32 && ! $target.is("input")) {
            e.preventDefault();
            e.stopPropagation();
            this.trigger("togglePlayPause", e);
        } else if (e.keyCode == 32 && $target.is("input")) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
});