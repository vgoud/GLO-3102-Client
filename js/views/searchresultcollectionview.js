/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.SearchResultCollectionView = Backbone.View.extend({

    tagName: "tr",

    events: {
        "click .ajout-album-playlist": "addAlbum"
    },

    initialize: function (options) {
        this.listenTo(this.model, "change", this.render);
        this.options = options || {};
    },

    render: function () {
        var pColl = this.options.playlistCollection;

        $(this.el).html(this.template({album: this.model.toJSON(), pColl: pColl.models}));
        return this;
    },

    addAlbum: function (e) {
        var playlistId = $(e.currentTarget).data("playlist-id");
        var playlist = UB.Collections.userPlaylists.get(playlistId);

        var $trackCollectionId = $(e.currentTarget).data("collection-id");
        var tracks = new UB.Collections.TrackCollection({id: $trackCollectionId});
        tracks.url = UB.urlBase + "albums/" + $trackCollectionId + "/tracks";
        tracks.fetch({
            success: function () {
                _.forEach(tracks.models, function (track) {
                    playlist.addTrackToPlaylist(track.toJSON());
                });
                playlist.save();
                this.$(".uk-close").click();
            }
        });
    }
});