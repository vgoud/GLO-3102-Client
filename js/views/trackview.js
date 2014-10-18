/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.TrackView = Backbone.View.extend({

    tagName: "tr",

    initialize: function () {
        this.listenTo(this.model, "change", this.render);

        // Format time in milliseconds to be human readable,
        // in a new attribute trackDuration.
        var duration = UB.Utils.convertMsToTime(this.model.get("trackTimeMillis"));
        this.model.set("trackDuration", duration.minutes + ":" + duration.seconds);
    },

    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});