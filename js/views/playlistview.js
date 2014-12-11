/**
 * Created by Michel on 03/11/2014.
 */

window.UB.Views.PlaylistView = Backbone.View.extend({

    tagName: "ul",
    className: "uk list uk-list-line",

    events: {
        "click .ub-button-play"                : "onPlaybackButtonClicked",
        "click #dropdown-play"                 : "onDropdownPlaybackButtonClicked",
        "click #dropdown-remove-from-playlist" : "onDropdownRemoveFromPlaylistButtonClick"
    },

    initialize: function () {
        this.listenTo(this.model, "change add sync", this.render);
        this.listenTo(this.collection, "change add remove sync", this.render);
    },

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));
        var self = this;
        _.each(this.collection.models, function (track) {
            self.$("tbody").append(
                new UB.Views.PlaylistTrackView({model: track, ownerId: self.model.attributes.owner.id}).render().el);
        });

        return this;
    },

    animationPlayButtonClasses: "animated infinite pulse",

    onPlaybackButtonClicked: function (e) {
        this.triggerPlaybackButtonClicked(e);

        // Remove focus from the button, otherwise the keypress
        // events are not catched by the global view.
        this.blurActiveElement();
    },

    findPlaybackButtonFromTrackId: function (trackId) {
        return this.$(".ub-button-play[data-track-id='" + trackId + "']");
    },

    onDropdownPlaybackButtonClicked: function (e) {
        // Route click to playback button by triggering a click.
        this.findPlaybackButtonFromTrackId($( e.target ).data("track-id")).click();
    },

    blurActiveElement: function () {
        // Remove focus from the active element, for example when
        // playback button is clicked.
        document.activeElement.blur();
    },

    onDropdownRemoveFromPlaylistButtonClick: function (e) {
        var trackId = $( e.target ).data("track-id");
        this.collection.get(trackId).destroy();
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