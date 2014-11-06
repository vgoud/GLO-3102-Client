/**
 * Created by Charles on 2014-10-30.
 */

window.UB.Routers.Router = Backbone.Router.extend({

    routes: {
        "":                 "home",
        "albums/:id":        "album",
        "artists/:id":       "artist",
        "playlists/:id":     "playlist",
        "playlists":         "playlists"
    },

    initialize: function () {
        this.$routerContainer = $("#content"); // container principal ds Index.Html
        this.$player = $("#player-container");
        this.$playlists = $("#playlists_container");
        this.playerView = new UB.Views.PlayerView({model: new UB.Models.PlayerModel()});
    },

    home: function () {
        // Since the home view never changes, we instantiate it and render it only once
//        if (!UB.Index) {
//            UB.homelView = new directory.HomeView();
//            UB.homelView.render();
//        } else {
//            console.log('reusing home view');
//            UB.homelView.delegateEvents(); // delegate events when the view is recycled
//        }
//        this.$content.html(UB.homelView.el);
//        UB.shellView.selectMenuItem('home-menu');

        this.$routerContainer.html(new UB.Views.HomeView().render().el);
        this.$player.html(this.playerView.render().el);
    },

    // Display the album's page.
    album: function (id) {
        var album = new UB.Models.AlbumInfoModel({id: id});
        var tracks = new UB.Collections.TrackCollection({id: id});
        var self = this;
        tracks.url = "http://localhost:3000/unsecure/albums/"+id+"/tracks";
        album.urlRoot = "http://localhost:3000/unsecure/albums";

        // TODO Handle errors.
        album.fetch({
            success: function (data) {
                tracks.fetch({
                    success: function (dataTrack) {
                        self.$routerContainer.html(new UB.Views.AlbumInfoView({model: data}).render().el);
                        var trackCollectionView = new UB.Views.TrackCollectionView({collection: dataTrack});
                        self.$routerContainer.append(trackCollectionView.render().el);

                        // Attach handlers to the tracks' events.
                        self.playerView.listenTo(trackCollectionView, "loadSong", self.loadSong);
                        self.playerView.listenTo(trackCollectionView, "stopSong", self.stopSong);
                    }
                });
            }
        });
    },

    // Load and play the song.
    loadSong: function (e) {
        // By setting the url of the audio in the model,
        // the <audio> element is automatically re-rendered.
        this.model.set("previewUrl", e.songPreviewUrl);
        this.play();
    },

    // Stop the actually playing song.
    stopSong: function (e) {
        this.stop();
    },

    artist: function (id) {
        var artist = new UB.Models.ArtistModel({id: id});
        var self = this;
        artist.urlRoot = "http://localhost:3000/unsecure/artists";
        artist.fetch({
            success: function (data) {
                self.$routerContainer.html((new UB.Views.ArtistView({model: data})).render().el);
            }
        });

    },

    //TODO
    playlist: function (id) {
        var playlist = new UB.Models.PlaylistModel({id: id});
        var self = this;
        playlist.url = "http://localhost:3000/unsecure/playlists/"+id;

        playlist.fetch({
            success: function (data) {

                self.$routerContainer.html((new UB.Views.PlaylistView({model: data})).render().el);
            }
        });
    },

    playlists: function () {
        var playlistCollection = new UB.Collections.PlaylistCollection();
        var self = this;
        playlistCollection.url = "http://localhost:3000/unsecure/playlists";

        playlistCollection.fetch({
            success: function (data) {
                self.$playlists.html((new UB.Views.PlaylistCollectionView({collection: data})).render().el);
            }
        });
    }

});

