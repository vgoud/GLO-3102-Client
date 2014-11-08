window.UB.Views.PlaylistCollectionView = Backbone.View.extend({

    el: "#playlists-container",

    events: {
        "click #btn-playlist-delete" : "deletePlaylist"
//        "click #btn-playlist-edit"   : "editPlaylist"
    },

    initialize: function () {
        _.bindAll(this, "render");

        this.listenTo(this.collection, "change add sync remove", this.render);
    },

    render: function () {
        this.$el.html(this.template({
            playlists: this.collection.toJSON()
            //playlists: filterPlaylists(this.collection.toJSON())
        }));
        return this;
    },

    createNewPlaylist: function (e) {
        var newPlaylist = this.collection.create(
            e.attributes, {
            type: 'POST'
        });
        if (!newPlaylist) {
            console.log("There was an error during the playlist creation");
        }
    },

    deletePlaylist: function (e) {
        // TODO Ask confirmation.
        if (e) {
            $target = $( e.currentTarget );
            var playlistId = $target.data("playlist-id");
            var model = this.collection.get(playlistId);
            // TODO error management.
            model.destroy();
        }
    },

    editPlaylist: function (e) {
        if (e) {
            $target = $(e.target );
            var playlistId = $target.data("playlist-id");
            var model = this.collectionl.get(playlistId);

        }
    }

});

// Va devoir trouver une façon de savoir le email de l'utilisateur courant pour filtrer les playlists
// et uniquement récupérer celles qui lui appartient.
filterPlaylists = function (playlists) {
    return _.filter(playlists, function (playlist) {
        return playlist.owner.email === "micou@gmail.com";
    });
}