/**
 * Created by Vincent on 2014-09-25.
 */

$(document).ready(function () {


//    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NDNiZmJhNWQ1MDEyZmQ0MGRjMzlhMGMiLCJleHAiOjE0MTM0OTEyMzY0NDR9.w2msrDhI90_pmGO-_DfugqZNOP0en7EqADFhmIfVtZA";

//    $.ajaxSetup({
//        headers: { "Authorization": token }
//    });

//    if (!pageName) {
//        return;
//    }

    UB.albumUrl = "http://localhost:3000/unsecure/albums/718938040/tracks";
    UB.artistAlbumUrlBefore = "http://localhost:3000/unsecure/albums/";
    UB.artistAlbumUrlAfter = "/tracks";
    UB.artistUrl = "http://localhost:3000/unsecure/artists/5448636";
    UB.artistAlbumsUrl = "http://localhost:3000/unsecure/artists/5448636/albums";

    UB.albumInfoUrl = "http://localhost:3000/unsecure/albums/718938040";
    UB.albumTracksUrl = "http://localhost:3000/unsecure/albums/718938040/tracks";

    UB.Utils.templateLoader.load([
        "TrackView",
        "TrackCollectionView",
        "AlbumInfoView",
        "RandomTrackCollectionView",
        "ArtistView",
        "AlbumsView",
        "HomeView",
        "PlayerView",
        "GlobalView",
        "HeaderView"
    ], function () {
        if (pageName == "Artist") {
            var setTopAlbum = function(albumId) {
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
            };

            var setAlbums = function() {
                UB.Collections.albumsCollection = new UB.Collections.AlbumsCollection();
                UB.Collections.albumsCollection.url = UB.artistAlbumsUrl;
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
                            setTopAlbum(randomAlbum.attributes.collectionId);
                        }
                    },
                    error: function (coll) {
                        console.log("Album collection cannot fetch data.");
                    }
                });
            };

            var setArtist = function() {
                UB.Collections.artistCollection = new UB.Collections.ArtistCollection();
                UB.Collections.artistCollection.url = UB.artistUrl;
                UB.Collections.artistCollection.fetch({
                    success: function (coll) {
                        console.log("Artist collection fetched sucessfully.");
                        UB.Views.artistView = new UB.Views.ArtistView({
                            collection: UB.Collections.artistCollection
                        });
                        $("#artist-content").html(UB.Views.artistView.render().el);
                        setAlbums();
                    },
                    error: function (coll) {
                        console.log("Artist collection cannot fetch data.");
                    }
                });
            };
            setArtist();
        }
        else if (pageName == "Album") {
            UB.Models.albumInfoModel = new UB.Models.AlbumInfoModel();
            UB.Models.albumInfoModel.url = UB.albumInfoUrl;
            UB.Views.albumInfoView = new UB.Views.AlbumInfoView({
                model: UB.Models.albumInfoModel
            });

            UB.Models.albumInfoModel.fetch({
                success: function (model) {
                    console.log("Album info model fetched sucessfully.");
                    console.log(UB.Models.albumInfoModel.toJSON());
                    $("#album-info-top-container").html(UB.Views.albumInfoView.render().el);
                },
                error: function(model) {
                    console.log("Album info model cannot fetch data.");
                }
            });

            // Will become a member of the router eventually.
            UB.Collections.trackCollection = new UB.Collections.TrackCollection();
            // Hardcoded url to Transatlanticism album.
            UB.Collections.trackCollection.url = UB.albumTracksUrl;
            UB.Views.trackCollectionView = new UB.Views.TrackCollectionView({
                collection: UB.Collections.trackCollection
            });

            UB.Collections.trackCollection.fetch({
                success: function (coll) {
                    console.log("Track collection fetched sucessfully.");
                    $("#album-tracks-container").html(UB.Views.trackCollectionView.render().el);
                },
                error: function(coll) {
                    console.log("Track collection cannot fetch data.");
                }
            });


        }
        else {
            UB.Routers.router = new UB.Routers.Router();
            Backbone.history.start();
        }
    });

    // Prevent page from scrolling down when pressing spacebar.
    window.onkeydown = function(e) {
        return !(e.keyCode == 32);
    };

});