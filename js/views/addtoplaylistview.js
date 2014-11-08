/**
 * Created by Vincent on 2014-11-08.
 */

window.UB.Views.AddToPlaylistView = Backbone.View.extend({

    initialize: function () {
        this.listenTo(this.collection, "all", this.render);
    },

    render: function() {
        this.$el.html(this.template({
            playlists: this.collection.toJSON()
        }));
        return this;
    }
});