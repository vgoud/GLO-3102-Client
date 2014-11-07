/**
 * Created by Charles on 2014-10-30.
 */

window.UB.Routers.Router = Backbone.Router.extend({

    routes: {
        ""               : "home",
        "albums/:id"     : "album",
        "artists/:id"    : "artist",
        //"playlists/:id"  : "playlist",
        "playlists"      : "playlists" //ver la methode
    },

    urlBase: "http://localhost:3000/unsecure/",

    initialize: function () {
        _.bindAll(this,
            "playSong",
            "togglePlayPause",
            "stopSong");

        this.globalView = new UB.Views.GlobalView();
        this.globalView.render();
        this.header = new UB.Views.HeaderView();
        this.header.render();
        this.$content = $("#content"); // container principal ds Index.Html
        this.$player = $("#player-container");
        this.$playlists = $("#playlists-container");
        this.playerView = new UB.Views.PlayerView({model: new UB.Models.PlayerModel()});
        this.$player.html(this.playerView.render().el);
        this.initializePlaylist();

        // This handler needs to be attached only once.
        this.playerView.listenTo(this.globalView, "togglePlayPause", this.togglePlayPause);
    },

    home: function () {
        this.$content.html(new UB.Views.HomeView().render().el);
        var self = this;
        // For test purposes. Can be integrated elsewhere.
        var newPlaylistModel = new UB.Models.CreatePlaylistModel();
        newPlaylistModel.urlRoot = function () {
            return self.urlBase + "playlists";
        };
        this.createPlaylistTestView = new UB.Views.CreatePlaylistView({
            model: newPlaylistModel});
        this.$content.append(this.createPlaylistTestView.render().el);
    },

    initializePlaylist: function () {
        var self = this;
        var playlists = new UB.Collections.PlaylistCollection();
        playlists.url = "http://localhost:3000/unsecure/playlists";

        playlists.fetch({
           success: function (data) {
               self.playlistcollectionView = new UB.Views.PlaylistCollectionView({collection: data});
           }
        });
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

    // Display the artist's page
    artist: function (id) {
        var artist = new UB.Models.ArtistModel({id: id});
        var artistAlbums = new UB.Collections.ArtistAlbumCollection();
        var self = this;

        artist.urlRoot = function () {
            return self.urlBase + "artists";
        };

        artistAlbums.url = function () {
            return self.urlBase + "artists/" + id + "/albums";
        };

        artist.fetch({
            success: function (data) {
                artistAlbums.fetch({
                    success: function (dataAlbums) {
                        console.log("Artist fetched successfully.");
                        self.$content.html((new UB.Views.ArtistView({model: data})).render().el);
                        var artistAlbumsView = new UB.Views.AlbumsView({collection: dataAlbums});
                        self.$content.append(artistAlbumsView.render().el);
                    },
                    error: function (callback) {
                        console.log("ARTIST ALBUMS could not be fetched.");
                    }
                });
            },
            error: function (callback) {
                console.log("ARTIST could not be fetched.");
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

//TODO
    playlist: function (id) {
        var playlist = new UB.Models.PlaylistModel({id: id});
        var self = this;
        playlist.url = "http://ubeat.herokuapp.com/unsecure/playlists/"+id;

        playlist.fetch({
            success: function (data) {

                self.$content.html((new UB.Views.PlaylistView({model: data})).render().el);
            }
        });
    },

    playlists: function () {

        var playlistCollection = new UB.Collections.PlaylistCollection();
        var self = this;
        playlistCollection.url = "http://ubeat.herokuapp.com/unsecure/playlists";

        playlistCollection.fetch({
            success: function (data) {

                self.$playlists.html((new UB.Views.PlaylistCollectionView({collection: data})).render().el);
            }
        });
    }

});

