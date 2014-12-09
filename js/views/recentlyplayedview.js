/**
 * Created by Charles on 2014-10-30.
 */


window.UB.Views.RecentlyPlayedView = Backbone.View.extend({

    collection: UB.Collections.RecentlyPlayedCollection,
    tagName: "div",
    className: "uk-container uk-container-center",

    initialize: function () {
        this.listenTo(this.collection, "change add sync", this.render);
    },

    render: function() {
        this.$el.html(this.template({
            albums: this.collection.toJSON()
        }));
        return this;
    }
});