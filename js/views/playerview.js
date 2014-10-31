/**
 * Created by Vincent on 2014-10-30.
 */

window.UB.Views.PlayerView = Backbone.View.extend({

    tagName: "div",

    id: "player",

    className: "uk-flex-right",

    events: {
        "keypress" : "togglePlayPause"
    },

    initialize: function (options) {
        this.listenTo(this.model, "change", this.render);

        // Define audio context.
        this._audioCtx =
            new (window.AudioContext || window.webkitAudioContext)();
        // Analyser node. Helpful to extract spectrum information.
        this._analyser = this._audioCtx.createAnalyser();
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.$audio = this.$("audio").get(0);

        // Create audio source from the <audio> element in the template.
        this._source = this._audioCtx.createMediaElementSource(this.$("audio").get(0));
        // Connect audio source to the analyzer and the destination.
        this._source.connect(this._analyser);
        this._analyser.connect(this._audioCtx.destination);
        this.play();

        return this;
    },

    play: function () {
        this._isPlaying = true;
        this.$audio.play();
    },

    stop: function () {
        this.$audio.pause();
    },

    togglePlayPause: function (e) {
        if (e && e.keyCode == 32) {
            if (this._isPlaying) {
                this.stop();
            } else {
                this.play();
            }
            this._isPlaying = !this._isPlaying;
        }
    }
});