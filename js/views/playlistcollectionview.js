window.UB.Views.PlaylistCollectionView = Backbone.View.extend({

    id: "sidebar-left-content-wrapper",

    events: {
        "click .btn-playlist-delete"  : "deletePlaylist",
        "click .btn-playlist-edit"    : "editPlaylist",
        "click #btn-create-playlist"  : "createPlaylist",
        "click #btn-toggle-sidebar"   : "toggleSidebar",
        "keydown"                     : "onKeydown",
        "click .btn-rename-submit"    : "onBtnRenameClick",
        "click .btn-rename-cancel"    : "onBtnCancelClick"
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

        this.$createPlaylistInput = this.$("#new-playlist-name");
        this.createPlaylistParsleyValidator = this.$("#create-playlist-form").parsley({
            errorClass: "uk-form-danger",
            successClass: "uk-form-success"
        });
        this.$sidebar = $("#sidebar-left");
        this.$sidebar.get(0).addEventListener("transitionend", this.triggerSidebarToggled);

        return this;
    },

    onKeydown: function (e) {
        var $target = $( e.target );

        if ($target.is("input[name='rename-input']")) {
            if (e.which == 13) {
                // Enter is pressed.
                // Check if form is valid before submission.
                this.validateAndSubmit($target);
                e.preventDefault();
            } else if (e.which == 27) {
                // Escape is pressed, cancel the modification.
                this.clearPlaylistModifications();
                e.preventDefault();
            }
        } else if ($target.is("input[name='new-playlist-name-input']") && e.which == 13) {
            this.createPlaylist(e);
        } else if ($target.is("input[name='new-playlist-name-input']") && e.which == 27) {
            this.clearCreatePlaylistForm();
        }
    },

    clearCreatePlaylistForm: function () {
        this.createPlaylistParsleyValidator.reset();
        this.$createPlaylistInput.val("");
    },

    createPlaylist: function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (this.createPlaylistParsleyValidator.validate()) {
            var newPlaylist = this.collection.create({
                name: this.$createPlaylistInput.val(),
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

    getParsleyInstance: function () {
        var playlistId = this.currentEditedPlaylist.id;
        var $form = this.$(".playlist-row[data-playlist-id='" + playlistId + "'] form");

        var toValidate = $form.parsley({
            errorClass: "uk-form-danger",
            successClass: "uk-form-success"
        });

        this.currentEditedPlaylistParsleyInstance = toValidate;
        return toValidate;
    },

    validateAndSubmit: function ($target) {
        // Check if form is valid before submission.
        var toValidate = this.getParsleyInstance($target);

        if (toValidate && toValidate.validate()) {
            this.submitPlaylistNameModification(toValidate.$element.find("input").val());
            this.clearPlaylistModifications();
        }
    },

    onBtnRenameClick: function (e) {
        var $target = $( e.target );

        this.validateAndSubmit($target);
    },

    onBtnCancelClick: function () {
        this.clearPlaylistModifications();
    },

    submitPlaylistNameModification: function (newName) {
        if (this.currentEditedPlaylist) {
            this.currentEditedPlaylist.set({
                name: newName
            });
            this.currentEditedPlaylist.save();
        }

        this.currentEditedPlaylist = null;
    },

    clearPlaylistModifications: function () {
        this.$(".playlist-link").removeClass("uk-hidden");
        this.$(".rename-playlist-input")
            .addClass("uk-hidden")
            .val("");
        this.$(".edit-buttons-group").addClass("uk-hidden");
        this.$(".playlist-row").removeClass("dirty");

        if (this.currentEditedPlaylistParsleyInstance) {
            this.currentEditedPlaylistParsleyInstance.destroy();
            this.currentEditedPlaylistParsleyInstance = null;
        }
    },

    editPlaylist: function (e) {
        if (e) {
            // Clear all modifications so that we don't have multiple edits
            // at the same time.
            this.clearPlaylistModifications();

            var $target = $(e.currentTarget);
            var playlistId = $target.data("playlist-id");
            var playlist = this.collection.get(playlistId);
            this.currentEditedPlaylist = playlist;

            var $parentContainer = this.$(".playlist-row[data-playlist-id='" + playlistId + "']");
            $parentContainer.addClass("dirty");
            $parentContainer.find(".playlist-link").addClass("uk-hidden");
            $parentContainer.find(".rename-playlist-input")
                .removeClass("uk-hidden")
                .val(playlist.get("name"));
            $parentContainer.find(".edit-buttons-group").removeClass("uk-hidden");
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