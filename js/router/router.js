/**
 * Created by Charles on 2014-10-30.
 */

window.UB.Routers.Router = Backbone.Router.extend({

    routes: {
        "" : "index",
        "home": "home",
        "loginsignup" : "loginSignup",
        "albums/:id": "album",
        "artists/:id": "artist",
        "playlists/:id": "playlist",
        "search/:id": "displaySearchResultBase",
        "search/:mode/:id": "displaySearchResultMode",
        "search/:id/limit/:num": "displaySearchResultBaseLimit",
        "search/:mode/:id/limit/:num": "displaySearchResultModeLimit",
        "users/:id" : "user"
    },

    urlBase: UB.urlBase,

    cookieTokenKey: "ubeat-token",

    // Function executed before each route is triggered.
    before: function (route) {
        if (route.indexOf("loginsignup") == -1) {

            // Not trying to navigate to login / signup.
            // Check if user is authenticated.
            // If so, proceed with the original routing.
            if (UB.session.checkAuth({})) {
                // User is logged in. Proceed with routing.
                this.renderGlobalView();
                return true;
            } else {
                // Navigate to login/signup page.
                this.navigate("loginsignup", {trigger: true});
                // Do not continue current routing.
                return false;
            }
        }

        // Otherwise, just proceed with actual routing.
        return true;
    },

    initialize: function () {
        _.bindAll(this,
            "togglePlayPause"
        );

        this.globalView = new UB.Views.GlobalView();
        this.globalView.render();

        // This handler needs to be attached only once.
        var self = this;
        $(document).on("keydown", function (e) {
            e = e || window.event;
            var $target = $(e.target );
            var charCode = e.keyCode || e.which;
            // Check if target is an input;
            // if not, call togglePlayPause.
            if (charCode == 32 && ! $target.is("input")) {
                // Prevent page from scrolling down when pressing spacebar.
                e.preventDefault();
                self.togglePlayPause(e)
            }
        });
    },

    redirectToLoginSignup: function () {
        if (Backbone.history.fragment == "loginsignup") {
            // Reload the page.
            Backbone.history.loadUrl();
        } else {
            this.navigate("#loginsignup", {trigger: true});
        }
    },

    loginSignup: function () {
        this.isGlobalViewRendered = false;
        
        this.loginSignupView = new UB.Views.LoginSignupView({
            model: UB.session.user
        });
        $("#global-container").html(this.loginSignupView.render().el);

        this.listenTo(this.loginSignupView, "loginSucceeded", this.onLoginSucceeded);
        this.listenTo(this.loginSignupView, "signupSucceeded", this.onSignupSucceeded);
    },

    onLoginSucceeded: function (e) {
        // Redirect to home.
        this.navigate("#home", {trigger: true});
    },

    onSignupSucceeded: function (e) {
        // Redirect to login.
        this.redirectToLoginSignup(e);
    },

    logout: function () {
        var self = this;
        UB.session.logout({}, {
            success: function () {
                // Logged out successfully.
                self.trigger("loggedOut");
                self.redirectToLoginSignup();
            }
        });
    },

    index: function () {
        this.navigate("#home", {trigger: true});
    },

    renderGlobalView: function () {
        if (! this.isGlobalViewRendered) {
            // We re-render the global view because the content was
            // overwritten by the login view.
            this.globalView.render();

            this.initializeHeader();
            this.$content = $("#content");
            this.$playlists = $("#sidebar-left-content");
            this.playerView = new UB.Views.PlayerView({model: new UB.Models.PlayerModel()});
            this.playerView.render();
            this.initializeUserPlaylist();

            this.isGlobalViewRendered = true;
        }

    },

    home: function () {
        this.renderGlobalView();
        this.$content.html(new UB.Views.HomeView().render().el);
    },

    initializeUserPlaylist: function () {
        var self = this;
        UB.Collections.allPlaylists = new UB.Collections.PlaylistCollection();
        UB.Collections.allPlaylists.url = this.urlBase + "playlists";

        UB.Collections.allPlaylists.fetch({
            async: false,
            success: function (data) {
                console.log("User playlists received.");
                console.log(data);
                self.playlistCollectionView =
                    new UB.Views.PlaylistCollectionView({
                        collection: data
                    });

                self.$playlists.html(self.playlistCollectionView.render().el);

                self.playerView.listenTo(self.playlistCollectionView, "sidebarToggled", self.playerView.toggleTitleAnimation);
            },
            error: function (model, res) {
                if (res.status == 401) {
                    self.redirectToLoginSignup();
                }
            }
        });

        this.listenTo(self.playlistCollectionView, "playlistDeleted", this.onPlaylistDeleted);
    },

    onPlaylistDeleted: function (e) {
         if (this.playlistView && e && e.playlistId == this.playlistView.model.id) {
             this.navigate("#home", {trigger: true});
         }
    },

    displayAlbum: function (id) {
        var album = new UB.Models.AlbumInfoModel({id: id});
        var tracks = new UB.Collections.TrackCollection();

        var playlistCollection = UB.Collections.allPlaylists;

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
                    },
                    error: function (model, res) {
                        if (res.status == 401) {
                            self.redirectToLoginSignup();
                        }
                    }
                });
            },
            error: function (model, res) {
                if (res.status == 401) {
                    self.redirectToLoginSignup();
                }
            }
        });
    },

    // Display the album's page.
    album: function (id) {
//        this.renderGlobalView();
        this.displayAlbum(id);
    },

    // Display the artist's page
    displayArtist: function (id) {
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

                        UB.mspHelpers.getMSPArtistPicture(artist);
                        UB.mspHelpers.getMSPArtistInfos(artist);
                    },
                    error: function (model, res) {
                        if (res.status == 401) {
                            self.redirectToLoginSignup();
                        }
                    }
                });
            },
            error: function (model, res) {
                if (res.status == 401) {
                    self.redirectToLoginSignup();
                }
            }
        });
    },

    artist: function (id) {
//        this.renderGlobalView();
        this.displayArtist(id);
    },

    togglePlayPause: function (e) {
        console.log("PLAY");
        console.log(e);
        if (this.playerView) {
            this.playerView.togglePlayPause(e);
        }
    },

    displayPlaylist: function (id) {
        if (! UB.Collections.allPlaylists) {
            this.initializeUserPlaylist();
        }
        var playlist = UB.Collections.allPlaylists.get(id);

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

    playlist: function (id) {
//        this.renderGlobalView();
        this.displayPlaylist(id);
    },

    initializeHeader: function () {
        this.initializeHeaderViews();
        this.initializeSearchFieldView();
        this.initializeButtons();

        this.listenTo(this.headerstandardview, "logout", this.logout);
        this.listenTo(this.logoutbuttonview, "logout", this.logout);
        this.listenTo(this.headertabletview, "logout", this.logout);
    },

    initializeHeaderViews: function () {
        this.headercommonview = new UB.Views.HeaderCommonView();
        this.headercommonview.render();
        this.headerstandardview = new UB.Views.HeaderStandardView({
            model: UB.session.user
        });
        this.headerstandardview.render();
        this.headertabletview = new UB.Views.HeaderTabletView({
            model: UB.session.user
        });
        this.headertabletview.render();
        this.headermobileview = new UB.Views.HeaderMobileView();
        this.headermobileview.render();
    },

    initializeSearchFieldView: function () {
        this.searchfieldview = new UB.Views.SearchFieldView();
        this.searchfieldview.render();

        this.listenTo(this.searchfieldview, "searchSucceeded", this.onSearch);
    },

    displaySearchResult: function (searchString, mode, url, limit) {
        var searchResult = new UB.Collections.SearchResultCollection();

        var playlistCollection = UB.Collections.allPlaylists;
        var self = this;

        searchResult.url = function () {
            return url;
        };

        searchResult.fetch({
            success: function (data) {

                if (self.searchResultView) {
                    self.playerView.stopListening(self.searchResultView, "playbackButtonClicked");
                }
                self.searchResultView = new UB.Views.SearchResultsView({collection: data, playlistCollection: playlistCollection,
                    searchString: searchString, mode: mode, limit: limit});
                self.$content.html(self.searchResultView.render().el);

                // Attach handlers to the tracks' and player's events.
                self.playerView.listenTo(self.searchResultView, "playbackButtonClicked", self.togglePlayPause);
                self.listenTo(self.searchResultView, "searchMore", self.onSearchLimit);
                self.searchResultView.listenTo(self.playerView, "playbackResumed", self.searchResultView.setPlayState);
                self.searchResultView.listenTo(self.playerView, "playbackStopped", self.searchResultView.setStopState);
                self.searchResultView.listenTo(self.playerView, "playbackEnded", self.searchResultView.setStopState);
            },
            error: function (model, res) {
                if (res.status == 401) {
                    self.redirectToLoginSignup();
                }
            }
        });
    },

    displaySearchResultBase: function (searchString) {
        var url = UB.urlBase + "search?q=" + searchString;
        this.displaySearchResult(searchString, "all", url, 10);
    },

    displaySearchResultMode: function (mode, searchString) {
        var url = UB.urlBase + "search/" + mode + "?q=" + searchString;
        this.displaySearchResult(searchString, mode, url, 10);
    },

    displaySearchResultBaseLimit: function (searchString, limit) {
        var url = UB.urlBase + "search?q=" + searchString + "&limit=" + limit;
        this.displaySearchResult(searchString, "all", url, parseInt(limit));
    },

    displaySearchResultModeLimit: function (mode, searchString, limit) {
        var url = UB.urlBase + "search/" + mode + "?q=" + searchString + "&limit=" + limit;
        this.displaySearchResult(searchString, mode, url, parseInt(limit));
    },

    onSearch: function (e) {
        this.navigate("#search/" + e.searchType + e.searchValue, {trigger: true});
    },

    onSearchLimit: function (e) {
        if (e.searchType == "all/") {
            e.searchType = "";
        }
        this.navigate("#search/" + e.searchType + e.searchValue + "/limit/" + e.searchLimit, {trigger: true});
    },

    initializeButtons: function () {
        this.homebuttonview = new UB.Views.HomeButtonView();
        this.homebuttonview.render();
        this.parameterbuttonview = new UB.Views.ParametersButtonView();
        this.parameterbuttonview.render();
        this.logoutbuttonview = new UB.Views.LogoutButtonView({
            model: UB.session.user
        });
        this.logoutbuttonview.render();
    },

    user: function (id) {
        var self = this;
        var user = new UB.Models.UserModel({
            id: id
        });
        user.urlRoot = function () {
            return UB.urlBase + "users"
        };
        user.fetch({
            success: function (user) {
                var userView = new UB.Views.UserView({
                    model: user
                });
                self.$content.html(userView.render().el);
            },
            error: function () {
                console.log("cannot fetch user.");
            }
        })
    }

});

