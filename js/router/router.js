/**
 * Created by Charles on 2014-10-30.
 */

window.UB.Routers.Router = Backbone.Router.extend({

    routes: {
        "": "home",
        "albums/:id": "album",
        "artists/:id": "artist",
        "playlists/:id": "playlist",
        "playlists": "playlists" //ver la methode
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
        this.initializeUserPlaylist();
        this.initializeNewPlaylistModal();
        //this.initializeRenamePlaylistModal();

        // This handler needs to be attached only once.
        this.playerView.listenTo(this.globalView, "togglePlayPause", this.togglePlayPause);
    },

    home: function () {
        this.$content.html(new UB.Views.HomeView().render().el);
    },

    initializeNewPlaylistModal: function () {
        var self = this;
        var newPlaylistModel = new UB.Models.CreatePlaylistModel();
        newPlaylistModel.urlRoot = function () {
            return self.urlBase + "playlists";
        };
        this.createPlaylistModalView = new UB.Views.CreatePlaylistView({
            model: newPlaylistModel});
        $("#global-container").append(this.createPlaylistModalView.render().el);
    },

    initializeRenamePlaylistModal: function (id) {
        var self = this;
        var renamePlaylistModel = new UB.Models.RenamePlaylistModel({id: id});
        renamePlaylistModel.urlRoot = function () {
            return self.urlBase + "playlists/" + id;
        };
        this.renamePlaylistModalView = new UB.Views.RenamePlaylistView({
            model: renamePlaylistModel});
        $("#playlists-container").append(this.renamePlaylistModalView.render().el);
    },

    initializeUserPlaylist: function () {
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
        self.newPlaylistModal();

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


                        if (self.trackCollectionView) {
                            self.playerView.stopListening(self.trackCollectionView, "playbackButtonClicked");
                        }
                        self.trackCollectionView = new UB.Views.TrackCollectionView({collection: dataTrack});
                        self.$content.append(self.trackCollectionView.render().el);

                        // Attach handlers to the tracks' and player's events.
                        self.playerView.listenTo(self.trackCollectionView, "playbackButtonClicked", self.togglePlayPause);
                        self.trackCollectionView.listenTo(self.playerView, "playbackResumed", self.trackCollectionView.setPlayState);
                        self.trackCollectionView.listenTo(self.playerView, "playbackStopped", self.trackCollectionView.setStopState);
                        self.trackCollectionView.listenTo(self.playerView, "playbackEnded", self.trackCollectionView.setStopState);
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
        self.newPlaylistModal();

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

    playlist: function (id) {
        var playlist = new UB.Models.PlaylistModel({id: id});
        var self = this;
        playlist.urlRoot = this.urlBase + "playlists";

        playlist.fetch({
            success: function (playlistModel) {
                // Map tracks data to a new array of models.
                var models =
                    _.map(playlistModel.get("tracks"), function (trackData) {
                        return new UB.Models.TrackModel(trackData);
                    });

                // Stop listening to old object before instantiating a new one.
                if (self.playlistView) {
                    self.playerView.stopListening(self.playlistView, "playbackButtonClicked");
                }

                var playlistTrackCollection = new UB.Collections.PlaylistTrackCollection(models);
                self.playlistView =
                    new UB.Views.PlaylistView({
                        model: playlistModel,
                        collection: playlistTrackCollection
                    });
                self.playerView.listenTo(self.playlistView, "playbackButtonClicked", self.togglePlayPause);
                self.playlistView.listenTo(self.playerView, "playbackResumed", self.playlistView.setPlayState);
                self.playlistView.listenTo(self.playerView, "playbackStopped", self.playlistView.setStopState);
                self.playlistView.listenTo(self.playerView, "playbackEnded", self.playlistView.setStopState);

                self.$content.html(self.playlistView.render().el);
            }
        });
    },

    playlists: function () {

        var playlistCollection = new UB.Collections.PlaylistCollection();
        var self = this;
        playlistCollection.url = this.urlBase + "playlists";

        playlistCollection.fetch({
            success: function (data) {
                self.$playlists.html((
                    new UB.Views.PlaylistCollectionView({
                        collection: data
                    })).render().el);
            }
        });
    }

});

