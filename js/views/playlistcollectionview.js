window.UB.Views.PlaylistCollectionView = Backbone.View.extend({

    id: "sidebar-left-content-wrapper",

    events: {
        "click #btn-playlist-delete"  : "deletePlaylist",
        "click #btn-playlist-edit"    : "editPlaylist",
        "click #btn-create-playlist"  : "createPlaylist",
        "click #btn-toggle-sidebar"   : "toggleSidebar"
    },

    initialize: function () {
        _.bindAll(this,
            "render",
            "triggerSidebarToggled"
        );

        this.listenTo(this.collection, "change add sync remove", this.render);

    },

    render: function () {
        this.$el.html(this.template({
            playlists: this.collection.toJSON()
            //playlists: filterPlaylists(this.collection.toJSON())
        }));

        this.$input = this.$("#new-playlist-name");
        this.$sidebar = $("#sidebar-left");
        this.$sidebar.get(0).addEventListener("transitionend", this.triggerSidebarToggled);

        return this;
    },

    createPlaylist: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.$input.val() !== "") {
            var newPlaylist = this.collection.create({
                name: this.$input.val(),
                owner: _.omit(UB.session.user, "following")
            }, {
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

    triggerSidebarToggled: function(e) {
        // Trigger event only for one property,
        // otherwise it would fire for all the properties transitioned.
        if (e.propertyName == "visibility") {
            this.trigger("sidebarToggled");
        }
    },

    toggleSidebar: function () {
        this.$sidebar.toggleClass("sidebar-visible");
        document.activeElement.blur();
    }

});

// Va devoir trouver une façon de savoir le email de l'utilisateur courant pour filtrer les playlists
// et uniquement récupérer celles qui lui appartient.
filterPlaylists = function (playlists) {
    return _.filter(playlists, function (playlist) {
        return playlist.owner.email === "micou@gmail.com";
    });
}