/**
 * Created by Vincent on 2014-10-30.
 */

window.UB.Views.PlayerView = Backbone.View.extend({

    tagName: "div",

    id: "player",

    className: "uk-flex-right",

    initialize: function (options) {
        _.bindAll(this, "render");

        this.listenTo(this.model, "change", this.render);

        // Define audio context.
        this._audioCtx =
            new (window.AudioContext || window.webkitAudioContext)();
        // Analyser node. Helpful to extract spectrum information.
        this._analyser = this._audioCtx.createAnalyser();
    },

    render: function() {
        console.log("playerview: render.");
        this.$el.html(this.template(this.model.toJSON()));
        // Get the DOM element. It's the <audio> element
        // that has an API.
        this.audio = this.$("audio").get(0);

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
        console.log("playerview: play.");
        this.audio.play();
    },

    stop: function () {
        this._isPlaying = false;
        console.log("playerview: stop.");
        this.audio.pause();
    },

    togglePlayPause: function (e) {
        if (e && e.keyCode == 32) {
            if (this._isPlaying) {
                this.stop();
                console.log("playerview: trigger toggleStopState.");
                this.trigger("toggleStopState", this.model.toJSON());
            } else {
                this.play();
                console.log("playerview: trigger togglePlayState.");
                this.trigger("togglePlayState", this.model.toJSON());
            }
        }
    }
});