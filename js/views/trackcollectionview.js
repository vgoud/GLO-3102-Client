/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.TrackCollectionView = Backbone.View.extend({

    tagName: "div",

    id: "album-tracks",

    className: "uk-panel uk-panel-box",

    events: {
        "click .ub-button-play" : "togglePlayVolumeIcons"
    },

    initialize: function() {
        this.listenTo(this.collection, "change add sync", this.render);
    },

    render: function () {
        this.$el.html(this.template());
        _.each(this.collection.models, function(track) {
            this.$("tbody").append(
                new UB.Views.TrackView({model: track}).render().el);
        });

        return this;
    },

    animationPlayButtonClasses: "animated infinite pulse",

    togglePlayVolumeIcons: function(e) {
        var target = $( e.target );
        if (target.hasClass("ub-active")) {
            target.removeClass("ub-active " + this.animationPlayButtonClasses);
            this.stopSong(e);
        }
        else {
            // We can only have one song playing at once.
            var $playingSongButton = $(".ub-button-play.ub-active");
            if ($playingSongButton) {
                $playingSongButton.removeClass("ub-active " + this.animationPlayButtonClasses);
            }
            // We remove the track number and replace it by an icon of volume.
            target.addClass("ub-active " + this.animationPlayButtonClasses);
            this.loadSong(e);
        }
    },

    loadSong: function(e) {
        this.trigger("loadSong", {
            songPreviewUrl: $(e.target).data("track-preview-url")
        });
    },

    stopSong: function(e) {
        this.trigger("stopSong", {
            songPreviewUrl: $(e.target).data("track-preview-url")
        });
    }

});