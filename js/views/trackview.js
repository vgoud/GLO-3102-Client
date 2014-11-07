/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.TrackView = Backbone.View.extend({

    tagName: "tr",

    initialize: function () {
        this.listenTo(this.model, "change", this.render);
    },

    render: function() {
        $(this.el).html(this.template(this.model.toJSON()));
        return this;
    }
});