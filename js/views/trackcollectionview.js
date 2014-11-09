/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.TrackCollectionView = Backbone.View.extend({

    tagName: "div",

    id: "album-tracks",

    className: "uk-panel uk-panel-box",

    events: {
        "click .ub-button-play"            : "onPlaybackButtonClick",
        "click #dropdown-play"             : "onDropdownPlaybackButtonClick",
        "click #dropdown-add-to-playlist"  : "addAllTracksToPlaylist"
    },

    initialize: function (options) {
        this.listenTo(this.collection, "change add sync", this.render);
        this.options = options || {};
    },

    render: function () {
        var pColl = this.options.playlistCollection;

        this.$el.html(this.template());
        _.each(this.collection.models, function (track) {
            this.$("tbody").append(
                new UB.Views.TrackView({model: track, playlistCollection: pColl}).render().el);
        });

        return this;
    },

    animationPlayButtonClasses: "animated infinite pulse",

    onPlaybackButtonClick: function (e) {
        this.triggerPlaybackButtonClicked(e);

        // Remove focus from the button, otherwise the keypress
        // events are not catched by the global view.
        this.blurActiveElement();
    },

    findPlaybackButtonFromTrackId: function (trackId) {
        return this.$(".ub-button-play[data-track-id='" + trackId + "']");
    },

    onDropdownPlaybackButtonClick: function (e) {
        // Route click to playback button by triggering a click.
        this.findPlaybackButtonFromTrackId($( e.target).data("track-id")).click();
    },

    addAllTracksToPlaylist: function (event) {
        console.log("addalltracks has been prssed");
        console.log($(event.currentTarget.data("track-collection-id")));
        console.log($(event.currentTarget.data("playlist-id")));
        var playlist = new UB.Models.PlaylistModel({id: "5456b513dcbb62c41e07bd78"}); //hard coded id.
        playlist.urlRoot = UB.PlaylistUrl;

        playlist.fetch({
            success: function (playlistModel) {
                var trackId = $(event.currentTarget).data("track-id");
                var tracks = new UB.Collections.TrackCollection({id: trackId});
                tracks.url = UB.albumTracksUrl;
                tracks.fetch({
                    success: function () {
                        console.log("tracks fetched:")
                        console.log(tracks);
                        _.forEach(tracks.models, function (track) {
                            playlistModel.addTrackToPlaylist(track.toJSON());
                        });

                        playlist.save();
                    }
                });
            }
        });
    },

    blurActiveElement: function () {
        // Remove focus from the active element, for example when
        // playback button is clicked.
        document.activeElement.blur();
    },

    toggleActiveState: function ($target) {
        if (this._$currentTrack && (! this._$currentTrack.is($target))) {
            this._$currentTrack.removeClass("ub-active " + this.animationPlayButtonClasses);
        }
        $target.toggleClass("ub-active " + this.animationPlayButtonClasses);
        this._$currentTrack = $target;
    },

    getTrackModelFromClickEvent: function (e) {
        var $target = $(e.target);
        var trackId = $target.data("track-id");
        // The model's id is set to the track id when fetched.
        return this.collection.get(trackId);
    },

    triggerPlaybackButtonClicked: function (e) {
        var trackModel = this.getTrackModelFromClickEvent(e);
        this.trigger("playbackButtonClicked", {
            model: trackModel
        });
    },

    setPlayState: function (e) {
        if (e && e.model) {
            var $target = this.$(".ub-button-play[data-track-id='" + e.model.id + "']");
            this.toggleActiveState($target);
        } else {
            this.toggleActiveState(this._$currentTrack);
        }
    },

    setStopState: function (e) {
        if (this._$currentTrack) {
            this._$currentTrack.removeClass("ub-active " + this.animationPlayButtonClasses);
        }
    }

});