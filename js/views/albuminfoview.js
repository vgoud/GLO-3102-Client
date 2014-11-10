/**
 * Created by Vincent on 2014-10-26.
 */

window.UB.Views.AlbumInfoView = Backbone.View.extend({
    events: {
        "click .btn-add-all-tracks": "addAllTracksToPlaylist",
        "click #btn-cancel": "cancel"
    },

    tagName: "div",

    id: "album-info-top",

    className: "uk-grid uk-grid-small",

    initialize: function (options) {
        this.listenTo(this.model, "all", this.render);
        this.options = options || {};
    },

    close: function () {
        // The call to .hide() doesn't work for an obscure reason.
        this.$(".uk-close").click();
    },

    cancel: function () {
        this.close();
    },

    render: function () {
        var pColl = this.options.playlistCollection;
        $(this.el).html(this.template({album: this.model.toJSON(), pColl: pColl.models}));
        return this;
    },

    addAllTracksToPlaylist: function (event) {
        var playlistId = $(event.currentTarget).data("playlist-id");
        var playlist = UB.Collections.userPlaylists.get(playlistId);

        var $trackCollectionId = $(event.currentTarget).data("collection-id");
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