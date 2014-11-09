/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.TrackCollectionView = Backbone.View.extend({

    tagName: "div",

    id: "album-tracks",

    className: "uk-panel uk-panel-box",

    events: {
        "click .ub-button-play"            : "onPlaybackButtonClick",
        "click #dropdown-play"             : "onDropdownPlaybackButtonClick"
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