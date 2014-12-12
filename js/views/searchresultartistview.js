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
        var pColl = UB.Collections.allPlaylists.getPlaylistsFromOwner(UB.session.user.id);

        $(this.el).html(this.template({artist: this.model.toJSON(), pColl: pColl}));
        return this;
    },

    addArtist: function (e) {
        var playlistId = $(e.currentTarget).data("playlist-id");
        var playlist = UB.Collections.allPlaylists.get(playlistId);

        var artistId = $(e.currentTarget).data("artist-id");
        var albums = new UB.Collections.AlbumsCollection({id: artistId});
        albums.url = UB.urlBase + "artists/" + artistId + "/albums";

        var deferreds = [];
        var trackModels = [];
        var deferredTrackAdds = [];

        albums.fetch({
            success: function (albumsColl) {
                _.forEach(albumsColl.models, function (album) {
                    var trackCollectionId = album.get("collectionId");
                    var tracks = new UB.Collections.TrackCollection({id: trackCollectionId});
                    tracks.url = UB.urlBase + "albums/" + trackCollectionId + "/tracks";

                    // Accumulate each deferred object returned by the fetch function.
                    deferreds.push(
                        tracks.fetch({
                            success: function (tracksColl) {
                                trackModels.push(tracksColl.models);
                            }
                    }));
                });

                $.when.apply($, deferreds).done( function() {
                    // Save the playlist only when ALL the fetches are done.
                    _.forEach(_.flatten(trackModels), function (track) {
                        deferredTrackAdds.push(
                            $.ajax({
                                  type: "POST"
                                , url: UB.urlBase + "playlists/" + playlistId +  "/tracks"
                                , contentType: "application/json"
                                , data: JSON.stringify(track.toJSON())
                            })
                        );
                    });

                    $.when.apply($, deferredTrackAdds).done(function () {
                            playlist.fetch();
                        }
                    );
                });

                this.$(".uk-close").click();
            }
        });
    }
});