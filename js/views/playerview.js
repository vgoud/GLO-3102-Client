/**
 * Created by Vincent on 2014-10-30.
 */

window.UB.Views.PlayerView = Backbone.View.extend({

    tagName: "div",

    id: "player",

    className: "uk-container uk-container-center uk-width-1-1 uk-height-1-1",

    events: {
        "click #audio-player-progress": "onProgressBarClick",
        "click #playButton": "onPlayClicked",
        "click #pauseButton": "onPauseClicked"
    },

    initialize: function (options) {
        _.bindAll(this,
            "render",
            "onEnded",
            "onTimeUpdate",
            "setCurrentTime",
            "seek",
            "draw",
            "visualize"
        );

        this.listenTo(this.model, "change", this.render);

        // Define audio context.
        this._audioCtx =
            new (window.AudioContext || window.webkitAudioContext)();
        // Analyser node. Helpful to extract spectrum information.
        this._analyser = this._audioCtx.createAnalyser();

        this.progressBarMinWidth = 3;

        this.fps = 30;
        this.now = 0;
        this.then = Date.now();
        this.interval = 1000/this.fps;
        this.delta;
    },

    render: function () {

        // Render template.
        this.$el.html(this.template(this.model.toJSON()));

        // Progress bar jQuery variables.
        this.$progress = this.$("#audio-player-progress");
        this.$progressBar = this.$("#audio-player-progress-bar");
        this.$progressBar.width(this.progressBarMinWidth + "%");

        // Get the DOM audio element. It's the <audio> element
        // that has an API.
        this.audio = this.$("audio").get(0);
        // jQuery object.
        this.$audio = $(this.audio);
        // Events binding.
        this.$audio.on("ended", this.onEnded);
        this.$audio.on("timeupdate", this.onTimeUpdate);

        // Create audio source from the <audio> element in the template.
        this._source = this._audioCtx.createMediaElementSource(this.audio);
        // Connect audio source to the analyzer and the analyzer to the destination.
        // This is an audio graph according to the Web Audio API.
        // The audio content is routed from the <audio> element to the audio graph.
        this._source.connect(this._analyser);
        this._analyser.connect(this._audioCtx.destination);

        this.$canvas = this.$("#visualizer-canvas");
        this._canvasCtx = this.$canvas.get(0).getContext("2d");

        this.visualize();

        return this;
    },

    // Current time is rounded down so time progress second by second.
    getCurrentTimeInPercentage: function () {
        return ~~((Math.floor(this.audio.currentTime) / this.audio.duration) * 100);
    },

    setCurrentTime: function (time) {
        if (this.audio.readyState !== HTMLMediaElement.HAVE_NOTHING) {
            this.audio.currentTime = time;
        }
    },

    seek: function (percent) {
        var time = ~~((percent) * this.audio.duration);
        this.setCurrentTime(time);
    },

    onProgressBarClick: function (e) {
        var x = e.pageX - this.$progress.offset().left;
        this.seek(x / this.$progress.width());
    },

    onTimeUpdate: function () {
        var percent = this.getCurrentTimeInPercentage();
        var newWidth = percent + this.progressBarMinWidth;
        this.$progressBar.width(newWidth + "%");
    },

    play: function () {
        if (this.audio.src != this.audio.baseURI) {
            this._isPlaying = true;
            this.audio.play();
            this.trigger("playbackResumed", {model: this.model});
            $("#playButton")[0].style.display = "none";
            $("#pauseButton")[0].style.display = "inline";
        }
    },

    stop: function () {
        this._isPlaying = false;
        this.audio.pause();
        this.trigger("playbackStopped", {model: this.model});
        $("#playButton")[0].style.display = "inline";
        $("#pauseButton")[0].style.display = "none";
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
        this.$progressBar.width(this.progressBarMinWidth + "%");
        this.trigger("playbackEnded", {
            model: this.model.toJSON()
        });
        $("#playButton")[0].style.display = "inline";
        $("#pauseButton")[0].style.display = "none";
    },

    onPlayClicked: function () {
        this.play();
    },

    onPauseClicked: function () {
        if (this._isPlaying) {
            this.stop();
        }
    },

    draw: function () {
        var drawVisual = requestAnimationFrame(this.draw);

        this.now = Date.now();
        this.delta = this.now - this.then;

        if (this.delta > this.interval) {
            // update time stuffs

            // Just `then = now` is not enough.
            // Lets say we set fps at 10 which means
            // each frame must take 100ms
            // Now frame executes in 16ms (60fps) so
            // the loop iterates 7 times (16*7 = 112ms) until
            // delta > interval === true
            // Eventually this lowers down the FPS as
            // 112*10 = 1120ms (NOT 1000ms).
            // So we have to get rid of that extra 12ms
            // by subtracting delta (112) % interval (100).
            // Hope that makes sense.

            this.then = this.now - (this.delta % this.interval);

            var WIDTH = this.$canvas.width();
            var HEIGHT = this.$canvas.height();

            var bufferLength = this._analyser.frequencyBinCount;
            var dataArray = new Uint8Array(bufferLength);

            this._analyser.getByteFrequencyData(dataArray);

            this._canvasCtx.fillStyle = '#555555';
            this._canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

            var barWidth = (WIDTH / bufferLength) * 2.5;
            var barHeight;
            var x = 0;

            for (var i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i];

//            this._canvasCtx.fillStyle = 'rgb(' + (barHeight + 100) + ',66,00)';
                this._canvasCtx.fillStyle = '#ff6600';
                this._canvasCtx.fillRect(
                    x,
                        HEIGHT - barHeight / 2,
                    barWidth,
                        barHeight / 2
                );

                x += barWidth + 1;
            }
        }
    },

    visualize: function () {
        var WIDTH = this.$canvas.width();
        var HEIGHT = this.$canvas.height();

        this._analyser.fftSize = 256;

        this._canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        this.draw();
    }

});