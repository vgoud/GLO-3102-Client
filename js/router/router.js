/**
 * Created by Charles on 2014-10-30.
 */

window.UB.Routers.Router = Backbone.Router.extend({

    routes: {
        "":                 "home",
        "albums/:id":        "album",
        "artists/:id":       "artist",
        "playlists/:id":     "playlist"
    },

    urlBase: "http://localhost:3000/unsecure/",

    initialize: function () {
        _.bindAll(this, "playSong", "togglePlayPause", "stopSong");

        this.globalView = new UB.Views.GlobalView();
        this.globalView.render();
        this.header = new UB.Views.HeaderView();
        this.header.render();
        this.$content = $("#content"); // container principal ds Index.Html
        this.$player = $("#player-container");
        this.playerView = new UB.Views.PlayerView({model: new UB.Models.PlayerModel()});
        this.$player.html(this.playerView.render().el);

        // This handler needs to be attached only once.
        this.playerView.listenTo(this.globalView, "togglePlayPause", this.togglePlayPause);
    },

    home: function () {
        this.$content.html(new UB.Views.HomeView().render().el);
    },

    // Display the album's page.
    album: function (id) {
        var album = new UB.Models.AlbumInfoModel({id: id});
        var tracks = new UB.Collections.TrackCollection();

        var self = this;

        tracks.url = function () {
            return self.urlBase + "albums/" + id + "/tracks";
        };
        album.urlRoot = function () {
            return self.urlBase + "albums";
        };

        // TODO Handle errors.
        album.fetch({
            success: function (data) {
                tracks.fetch({
                    success: function (dataTrack) {
                        self.$content.html(new UB.Views.AlbumInfoView({model: data}).render().el);
                        var trackCollectionView = new UB.Views.TrackCollectionView({collection: dataTrack});
                        self.$content.append(trackCollectionView.render().el);

                        // Attach handlers to the tracks' and player's events.
                        self.playerView.listenTo(trackCollectionView, "playbackButtonClicked", self.togglePlayPause);
                        trackCollectionView.listenTo(self.playerView, "playbackResumed", trackCollectionView.setPlayState);
                        trackCollectionView.listenTo(self.playerView, "playbackStopped", trackCollectionView.setStopState);
                        trackCollectionView.listenTo(self.playerView, "playbackEnded", trackCollectionView.setStopState);
                    }
                });
            }
        });
    },

    playSong: function () {
        this.playerView.play();
    },

    togglePlayPause: function (e) {
        this.playerView.togglePlayPause(e);
    },

    // Stop the actually playing song.
    stopSong: function () {
        this.playerView.stop();
    },

    artist: function (id) {
        var artist = new UB.Models.ArtistModel({id: id});
        var self = this;
        artist.urlRoot = "http://localhost:3000/unsecure/artists";
        artist.fetch({
            success: function (data) {
                self.$content.html((new UB.Views.ArtistView({model: data})).render().el);
            }
        });

    },

    //TODO
    playlist: function (id) {
        var employee = new UB.Employee({id: id});
        var self = this;
        employee.fetch({
            success: function (data) {
                console.log(data);
                // Note that we could also 'recycle' the same instance of EmployeeFullView
                // instead of creating new instances
                self.$content.html(new UB.EmployeeView({model: data}).render().el);
            }
        });

    }

});

