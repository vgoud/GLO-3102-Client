/**
 * Created by Vincent on 2014-10-15.
 */

window.UBeat.Views.TrackCollectionView = Backbone.View.extend({

    tagName: "table",

    className: "uk-table uk-table-hover",

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
                new UBeat.Views.TrackView({model: track}).render().el);
        });

        return this;
    },

    animationPlayButtonClasses: "animated infinite pulse",

    togglePlayVolumeIcons: function(e) {
        var target = $( e.target );
        if (target.hasClass("ub-active")) {
            target.removeClass("ub-active " + this.animationPlayButtonClasses);
    //            stopSong();
        }
        else {
            // We can only have one song playing at once.
            var $playingSongButton = $(".ub-button-play.ub-active");
            if ($playingSongButton) {
                $playingSongButton.removeClass("ub-active " + this.animationPlayButtonClasses);
            }
            // We remove the track number and replace it by an icon of volume.
            target.addClass("ub-active " + this.animationPlayButtonClasses);
    //            playSong();
        }
    },

    playSong: function() {
        return;
    },

    stopSong: function() {
        return;
    }

});