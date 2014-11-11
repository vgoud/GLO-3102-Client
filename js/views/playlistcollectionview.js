window.UB.Views.PlaylistCollectionView = Backbone.View.extend({

    el: "#playlists-container",

    events: {
        "click #btn-playlist-delete"  : "deletePlaylist",
        "click #btn-playlist-edit"    : "editPlaylist",
        "click #btn-creat-playlist"   : "createPlaylist",
        "click #btn-toggle-sidebar"   : "toggleSidebar"
    },

    initialize: function () {
        _.bindAll(this, "render");

        this.listenTo(this.collection, "change add sync remove", this.render);
        this.on();
    },

    render: function () {
        this.$el.html(this.template({
            playlists: this.collection.toJSON()
            //playlists: filterPlaylists(this.collection.toJSON())
        }));
        this.$input = this.$("#new-playlist-name");
        return this;
    },

    createPlaylist: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.$input.val() !== "") {
            var newPlaylist = this.collection.create({
                name: this.$input.val() }, {
                type: 'POST'
            });
            if (!newPlaylist) {
                console.log("There was an error during the playlist creation");
            }
        }
    },

    deletePlaylist: function (e) {
        // TODO Ask confirmation.
        if (e) {
            e.preventDefault();
            e.stopPropagation();
            $target = $(e.currentTarget);
            var playlistId = $target.data("playlist-id");
            var model = this.collection.get(playlistId);

            this.trigger("playlistDeleted", {
                playlistId: playlistId
            });

            // TODO error management.
            model.destroy();
        }
    },

    setRenamePlaylistModal: function (model) {
        if (this.renamePlaylistModalView) {
            this.renamePlaylistModalView.remove();
        }

        this.renamePlaylistModalView = new UB.Views.RenamePlaylistView({
            model: model
        });
        $("#global-container").append(this.renamePlaylistModalView.render().el);
    },

    editPlaylist: function (e) {
        if (e) {
            $target = $(e.currentTarget);
            var playlistId = $target.data("playlist-id");
            var model = this.collection.get(playlistId);
            this.setRenamePlaylistModal(model);
//            this.$modal.show();
            this.$("#btn-hidden-open-modal").click();
        }
    },

    toggleSidebar: function (e) {
        $("#sidebar-left").toggleClass("sidebar-visible");
    }

});

// Va devoir trouver une façon de savoir le email de l'utilisateur courant pour filtrer les playlists
// et uniquement récupérer celles qui lui appartient.
filterPlaylists = function (playlists) {
    return _.filter(playlists, function (playlist) {
        return playlist.owner.email === "micou@gmail.com";
    });
}