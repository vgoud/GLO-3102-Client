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
        _.bindAll(this,
            "loadSong",
            "playSong",
            "togglePlayPause",
            "stopSong",
            "setArtist",
            "setAlbums",
            "setTopAlbum"
        );

        this.globalView = new UB.Views.GlobalView();
        this.globalView.render();
        this.header = new UB.Views.HeaderView();
        this.header.render();
        this.$content = $("#content"); // container principal ds Index.Html
        this.$player = $("#player-container");
        this.playerView = new UB.Views.PlayerView({model: new UB.Models.PlayerModel()});
        this.$player.html(this.playerView.render().el);
    },

    home: function () {
        this.$content.html(new UB.Views.HomeView().render().el);
    },

    // Display the album's page.
    album: function (id) {
        var album = new UB.Models.AlbumInfoModel({id: id});
        var tracks = new UB.Collections.TrackCollection({id: id});

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

                        // Attach handlers to the tracks' events.
                        self.playerView.listenTo(trackCollectionView, "loadSong", self.loadSong);
                        self.playerView.listenTo(trackCollectionView, "playSong", self.playSong);
                        self.playerView.listenTo(trackCollectionView, "stopSong", self.stopSong);
                        self.playerView.listenTo(self.globalView, "togglePlayPause", self.togglePlayPause);
                        trackCollectionView.listenTo(self.playerView, "togglePlayState", trackCollectionView.togglePlayState);
                        trackCollectionView.listenTo(self.playerView, "toggleStopState", trackCollectionView.toggleStopState);
                    }
                });
            }
        });
    },

    // Load and play the song.
    loadSong: function (e) {
        // By setting the url of the audio in the model,
        // the <audio> element is automatically re-rendered.
        this._currentTrack = e.trackId;
        this.playerView.model.set({
            previewUrl: e.trackPreviewUrl,
            trackId: e.trackId
        });
        console.log("router: Call playerView.play().");
        this.playerView.play();
    },

    playSong: function () {
        console.log("router: Call playerView.play().");
        this.playerView.play();
    },

    togglePlayPause: function (e) {
        console.log("router: Call playerView.togglePlayPause().");
        this.playerView.togglePlayPause(e);
    },

    // Stop the actually playing song.
    stopSong: function (e) {
        console.log("router: Call playerView.stop().");
        this.playerView.stop();
    },

   setTopAlbum: function(albumId) {
        UB.Collections.trackCollection = new UB.Collections.TrackCollection();
        UB.Collections.trackCollection.url = UB.artistAlbumUrlBefore + albumId + UB.artistAlbumUrlAfter;
        UB.Collections.trackCollection.fetch({
            success: function (coll) {
                console.log("Random track collection fetched sucessfully.");
                UB.Views.randomTrackCollectionView = new UB.Views.RandomTrackCollectionView({
                    collection: UB.Collections.trackCollection
                });
                $("#album-content").html(UB.Views.randomTrackCollectionView.render().el);
            },
            error: function (coll) {
                console.log("Random track collection cannot fetch data.");
            }
        });
    },

    setAlbums: function() {
        UB.Collections.albumsCollection = new UB.Collections.AlbumsCollection();
        UB.Collections.albumsCollection.url = UB.artistAlbumsUrl;

        var self = this;
        UB.Collections.albumsCollection.fetch({
            success: function (coll) {
                console.log("Album collection fetched sucessfully.");
                UB.Views.albumsView = new UB.Views.AlbumsView({
                    collection: UB.Collections.albumsCollection
                });
                $("#artist-top-bar").html(UB.Views.albumsView.render().el);

                var albums = UB.Collections.albumsCollection;
                if (albums.models.length > 0) {
                    var randomAlbum = albums.models[Math.floor(Math.random() * albums.models.length)];
                    self.setTopAlbum(randomAlbum.attributes.collectionId);
                }
            },
            error: function (coll) {
                console.log("Album collection cannot fetch data.");
            }
        });
    },

    setArtist: function(id) {
        UB.Collections.artistCollection = new UB.Collections.ArtistCollection();
        UB.Collections.artistCollection.url = this.urlBase + "artists/" + id;

        var self = this;
        UB.Collections.artistCollection.fetch({
            success: function (coll) {
                console.log("Artist collection fetched sucessfully.");
                UB.Views.artistView = new UB.Views.ArtistView({
                    collection: UB.Collections.artistCollection
                });
                $("#content").html(UB.Views.artistView.render().el);
                self.setAlbums();
            },
            error: function (coll) {
                console.log("Artist collection cannot fetch data.");
            }
        });
    },

    artist: function (id) {
        /*var artist = new UB.Models.ArtistModel({id: id});
        var self = this;
        artist.urlRoot = "http://localhost:3000/unsecure/artists";
        artist.fetch({
            success: function (data) {
                self.$content.html((new UB.Views.ArtistView({model: data})).render().el);
            }
        });*/

        this.setArtist(id);

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

