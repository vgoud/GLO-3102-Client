/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.ArtistView = Backbone.View.extend({

    tagName: "span",

    initialize: function () {
        this.listenTo(this.collection, "change add sync", this.render);
    },

    render: function() {
        $(this.el).html(this.template(this.collection.models[0].toJSON()));
        return this;
    }
});