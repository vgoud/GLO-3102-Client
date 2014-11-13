/**
 * Created by Charles on 2014-10-30.
 */

window.UB.Routers.Router = Backbone.Router.extend({

    routes: {
        "home": "home",
        "albums/:id": "album",
        "artists/:id": "artist",
        "playlists/:id": "playlist"
    },

    urlBase: UB.urlBase,

    initialize: function () {
        _.bindAll(this,
            "playSong",
            "togglePlayPause",
            "stopSong");

        this.globalView = new UB.Views.GlobalView();
        this.globalView.render();
        this.initializeHeader();
        this.$content = $("#content");
        this.$player = $("#player-container");
//        this.$playlists = $("#playlists-container");
        this.$playlists = $("#sidebar-left-content");
        this.playerView = new UB.Views.PlayerView({model: new UB.Models.PlayerModel()});
        this.$player.html(this.playerView.render().el);

        // This handler needs to be attached only once.
        this.playerView.listenTo(this.globalView, "togglePlayPause", this.togglePlayPause);

        this.initializeUserPlaylist();
        this.home();
    },

    home: function () {
        this.$content.html(new UB.Views.HomeView().render().el);
    },

    keepOffCanvasOpen: function () {
        jQuery.UIkit.offcanvas.show();
    },

    initializeUserPlaylist: function () {
        var self = this;
        UB.Collections.userPlaylists = new UB.Collections.PlaylistCollection();
        UB.Collections.userPlaylists.url = this.urlBase + "playlists";

        UB.Collections.userPlaylists.fetch({
            async: false,
            success: function (data) {
                console.log("User playlists received.");
                console.log(data);
                self.playlistCollectionView =
                    new UB.Views.PlaylistCollectionView({
                        collection: data
                    });

                self.$playlists.html(self.playlistCollectionView.render().el);
            }
        });

        this.listenTo(self.playlistCollectionView, "playlistDeleted", this.onPlaylistDeleted);
    },

    onPlaylistDeleted: function (e) {
         if (this.playlistView && e && e.playlistId == this.playlistView.model.id) {
             this.navigate("#home", {trigger: true});
         }
    },

    // Display the album's page.
    album: function (id) {
        var album = new UB.Models.AlbumInfoModel({id: id});
        var tracks = new UB.Collections.TrackCollection();

        var playlistCollection = UB.Collections.userPlaylists;

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
                        self.$content.html(new UB.Views.AlbumInfoView({model: data, playlistCollection: playlistCollection}).render().el);


                        if (self.trackCollectionView) {
                            self.playerView.stopListening(self.trackCollectionView, "playbackButtonClicked");
                        }
                        self.trackCollectionView = new UB.Views.TrackCollectionView({collection: dataTrack, playlistCollection: playlistCollection});
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
        var playlist = UB.Collections.userPlaylists.get(id);

        if (playlist) {
            var self = this;

            // Map tracks data to a new array of models.
            var models =
                _.map(playlist.get("tracks"), function (trackData) {
                    var track = new UB.Models.TrackModel(trackData);
                    // We artificially set the urlRoot to facilitate ajax calls
                    // when removing track from playlist.
                    track.urlRoot = function () {
                        return playlist.urlRoot + "/" + playlist.id + "/tracks";
                    };

                    return track;
                });

            // Stop listening to old object before instantiating a new one.
            if (self.playlistView) {
                self.playerView.stopListening(self.playlistView, "playbackButtonClicked");
            }

            var playlistTrackCollection = new UB.Collections.PlaylistTrackCollection();
            playlistTrackCollection.add(models);
            self.playlistView =
                new UB.Views.PlaylistView({
                    model: playlist,
                    collection: playlistTrackCollection
                });
            self.playerView.listenTo(self.playlistView, "playbackButtonClicked", self.togglePlayPause);
            self.playlistView.listenTo(self.playerView, "playbackResumed", self.playlistView.setPlayState);
            self.playlistView.listenTo(self.playerView, "playbackStopped", self.playlistView.setStopState);
            self.playlistView.listenTo(self.playerView, "playbackEnded", self.playlistView.setStopState);

            self.$content.html(self.playlistView.render().el);
        } else {
            this.navigate("#home", {trigger: true});
        }
    },

    initializeHeader: function () {
        this.initializeHeaderViews();
        this.initializeSearchFieldView();
        this.initializeButtons();
    },

    initializeHeaderViews: function () {
        this.headercommonview = new UB.Views.HeaderCommonView();
        this.headercommonview.render();
        this.headerstandardview = new UB.Views.HeaderStandardView();
        this.headerstandardview.render();
        this.headertabletview = new UB.Views.HeaderTabletView();
        this.headertabletview.render();
        this.headermobileview = new UB.Views.HeaderMobileView();
        this.headermobileview.render();
    },

    initializeSearchFieldView: function () {
        this.searchfieldview = new UB.Views.SearchFieldView();
        this.searchfieldview.render();
    },

    initializeButtons: function () {
        this.homebuttonview = new UB.Views.HomeButtonView();
        this.homebuttonview.render();
        this.parameterbuttonview = new UB.Views.ParametersButtonView();
        this.parameterbuttonview.render();
        this.logoutbuttonview = new UB.Views.LogoutButtonView();
        this.logoutbuttonview.render();
    }

});

