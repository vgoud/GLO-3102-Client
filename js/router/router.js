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

    initialize: function () {
        this.$routerContainer = $("#content"); // container principal ds Index.Html
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
    },

    album: function (id) {
        var album = new UB.Models.AlbumInfoModel({id: id});
        var tracks = new UB.Collections.TrackCollection({id: id});
        var self = this;
        tracks.url = "http://localhost:3000/unsecure/albums/"+id+"/tracks";
        album.urlRoot = "http://localhost:3000/unsecure/albums";

        album.fetch({
            success: function (data) {
                tracks.fetch({
                    success: function (dataTrack) {

                        self.$routerContainer.html(new UB.Views.AlbumInfoView({model: data}).render().el);
                        self.$routerContainer.append(new UB.Views.TrackCollectionView({collection: dataTrack}).render().el);
                    }
                });
            }
        });

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

