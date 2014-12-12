/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.SearchResultArtistView = Backbone.View.extend({

    tagName: "tr",

    events: {
        "click .ajout-artist-playlist": "addArtist"
    },

    initialize: function (options) {
        this.listenTo(this.model, "change", this.render);
        this.options = options || {};
    },

    render: function () {
        var pColl = this.options.playlistCollection.getPlaylistsFromOwner(UB.session.user.id);

        $(this.el).html(this.template({artist: this.model.toJSON(), pColl: pColl}));
        return this;
    },

    addArtist: function (e) {
        var playlistId = $(e.currentTarget).data("playlist-id");
        var playlist = UB.Collections.allPlaylists.get(playlistId);

        var $artistId = $(e.currentTarget).data("artist-id");
        var albums = new UB.Collections.AlbumsCollection({id: $artistId});
        albums.url = UB.urlBase + "artists/" + $artistId + "/albums";
        albums.fetch({
            success: function () {
                _.forEach(albums.models, function (albums) {
                    var $trackCollectionId = albums.attributes.collectionId;
                    var tracks = new UB.Collections.TrackCollection({id: $trackCollectionId});
                    tracks.url = UB.urlBase + "albums/" + $trackCollectionId + "/tracks";
                    tracks.fetch({
                        success: function () {
                            _.forEach(tracks.models, function (track) {
                                playlist.addTrackToPlaylist(track.toJSON());
                            });
                        }
                    });
                });
                playlist.save();
                this.$(".uk-close").click();
            }
        });
    }
});