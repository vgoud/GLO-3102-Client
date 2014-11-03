/**
 * Created by Vincent on 2014-10-30.
 */

window.UB.Views.PlayerView = Backbone.View.extend({

    tagName: "div",

    id: "player",

    className: "uk-container uk-container-center uk-width-1-1 uk-vertical-align-middle uk-vertical-align",

    initialize: function (options) {
        _.bindAll(this, "render", "onEnded");

        this.listenTo(this.model, "change", this.render);

        // Define audio context.
        this._audioCtx =
            new (window.AudioContext || window.webkitAudioContext)();
        // Analyser node. Helpful to extract spectrum information.
        this._analyser = this._audioCtx.createAnalyser();
    },

    render: function () {
        console.log("playerview: render.");

        this.$el.html(this.template(this.model.toJSON()));
        // Get the DOM element. It's the <audio> element
        // that has an API.
        this.audio = this.$("audio").get(0);
        this.$("audio").on("ended", this.onEnded);

        // Create audio source from the <audio> element in the template.
        this._source = this._audioCtx.createMediaElementSource(this.audio);
        // Connect audio source to the analyzer and the analyzer to the destination.
        // This is an audio graph according to the Web Audio API.
        // The audio content is routed from the <audio> element to the audio graph.
        this._source.connect(this._analyser);
        this._analyser.connect(this._audioCtx.destination);

        return this;
    },

    play: function () {
        this._isPlaying = true;
        this.audio.play();
        this.trigger("playbackResumed", {model: this.model});
    },

    stop: function () {
        this._isPlaying = false;
        this.audio.pause();
        this.trigger("playbackStopped", {model: this.model});
    },

    togglePlayPause: function (e) {
        if (this._isPlaying) {
            if (e && e.model && this.model.id === e.model.id) {
                // It's the same track. Playback is stopped.
                this.stop();
            } else {
                if (e && e.model) {
                    // It's a new track. New track is played.
                    this.model.set(e.model.toJSON());
                    this.play();
                } else {
                    // No model is passed with the event,
                    // probably spacebar have been pressed.
                    // Playback is stopped.
                    this.stop();
                }
            }
        } else {
            if (e && e.model) {
                this.model.set(e.model.toJSON());
            }
            this.play();
        }
    },

    onEnded: function () {
        this._isPlaying = false;
        this.trigger("playbackEnded", {
            model: this.model.toJSON()
        });
    }
});