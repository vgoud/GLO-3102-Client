/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.TrackCollectionView = Backbone.View.extend({

    tagName: "div",

    id: "album-tracks",

    className: "uk-panel uk-panel-box",

    events: {
        "click .ub-button-play": "togglePlayVolumeIcons"
    },

    initialize: function () {
        this.listenTo(this.collection, "change add sync", this.render);
    },

    render: function () {
        this.$el.html(this.template());
        _.each(this.collection.models, function (track) {
            this.$("tbody").append(
                new UB.Views.TrackView({model: track}).render().el);
        });

        return this;
    },

    animationPlayButtonClasses: "animated infinite pulse",

    togglePlayVolumeIcons: function (e) {
        console.log("trackcollview: togglePlayVolumeIcons.");
        var target = $(e.target);

        if (target.hasClass("ub-active")) {
            target.removeClass("ub-active " + this.animationPlayButtonClasses);
            this.publishStopSong(e);
        }
        else {
            if (this._$currentTrack && this._$currentTrack.is(target)) {
                // We remove the track number and replace it by an icon of volume.
                target.addClass("ub-active " + this.animationPlayButtonClasses);
                this.publishPlaySong(e);
            } else {
                this._$currentTrack = target;
                // We can only have one song playing at once.
                var $playingSongButton = $(".ub-button-play.ub-active");
                if ($playingSongButton) {
                    $playingSongButton.removeClass("ub-active " + this.animationPlayButtonClasses);
                }
                // We remove the track number and replace it by an icon of volume.
                target.addClass("ub-active " + this.animationPlayButtonClasses);
                this.publishLoadSong(e);
            }
        }
    },

    publishLoadSong: function (e) {
        console.log("trackcollview: trigger loadSong.");
        this.trigger("loadSong", {
            event: e,
            trackPreviewUrl: $(e.target).data("track-preview-url"),
            trackId: $(e.target).data("track-id")
        });
    },

    publishPlaySong: function (e) {
        console.log("trackcollview: trigger playSong.");
        this.trigger("playSong", {
            event: e,
            trackPreviewUrl: $(e.target).data("track-preview-url"),
            trackId: $(e.target).data("track-id")
        });
    },

    publishStopSong: function (e) {
        console.log("trackcollview: trigger stopSong.");
        this.trigger("stopSong", {
            event: e,
            trackPreviewUrl: $(e.target).data("track-preview-url"),
            trackId: $(e.target).data("track-id")
        });
    },

    togglePlayState: function () {
        console.log("trackcollview: togglePlayState.");
        if (!this._$currentTrack.hasClass("ub-active")) {
            // We remove the track number and replace it by an icon of volume.
            this._$currentTrack.addClass("ub-active " + this.animationPlayButtonClasses);
        }
    },

    toggleStopState: function () {
        console.log("trackcollview: toggleStopState.");
        this._$currentTrack.removeClass("ub-active " + this.animationPlayButtonClasses);
    }

});