/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.AlbumsView = Backbone.View.extend({

    tagName: "div",
    className: "uk-container uk-container-center",

    initialize: function () {
        _.bindAll(this, "render");

        this.listenTo(this.collection, "change add sync", this.render);
    },

    render: function() {
        this.$el.html(this.template({
            albums: this.collection.toJSON()
        }));
        this.$('.text_here').ThreeDots({
            max_rows:1
        });
        return this;
    }
});