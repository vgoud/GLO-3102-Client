/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.AlbumsView = Backbone.View.extend({

    tagName: "div",
    className: "uk-grid uk-grid-small",

    initialize: function () {
        this.listenTo(this.collection, "change add sync", this.render);
    },

    render: function() {
        $(this.el).html(this.template({
            albums: this.collection.toJSON()
        }));
        return this;
    }
});