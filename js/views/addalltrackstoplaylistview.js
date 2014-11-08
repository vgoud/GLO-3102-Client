/**
 * Created by Michel on 08/11/2014.
 */

window.UB.Views.AddAllTracksToPlaylistView = Backbone.View.extend({

    initialize: function () {
        _.bindAll(this, "render");

        this.listenTo(this.collection, "change add sync remove", this.render);
    },

    render: function () {
        this.$el.html(this.template({
            playlists: this.collection.toJSON()
        }));
        return this;
    }
});