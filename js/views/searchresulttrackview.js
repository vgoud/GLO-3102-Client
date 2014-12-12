/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.SearchResultTrackView = Backbone.View.extend({

    tagName: "tr",

    events: {
        "click .ajout-track-playlist": "addTrack"
    },

    initialize: function (options) {
        this.listenTo(this.model, "change", this.render);
        this.options = options || {};
    },

    render: function () {
        var pColl = this.options.playlistCollection.getPlaylistsFromOwner(UB.session.user.id);

        $(this.el).html(this.template({track: this.model.toJSON(), pColl: pColl}));
        return this;
    },

    addTrack: function (e) {

        var playlistId = $(e.currentTarget).data("playlist-id");
        var playlist = UB.Collections.allPlaylists.get(playlistId);
        var track = this.model.attributes;

        playlist.addTrackToPlaylist(track);
        playlist.save();
    }
});