/**
 * Created by Vincent on 2014-12-04.
 */

window.UB.Views.UserView = Backbone.View.extend({

    events: {
        "click #btn-follow-user"      : "followUser",
        "click #btn-unfollow-user"    : "unfollowUser",
        "click .btn-playlist-delete"  : "deletePlaylist",
        "click .btn-playlist-edit"    : "editPlaylist",
        "keydown"                     : "onKeydown",
        "click .btn-rename-submit"    : "onBtnRenameClick",
        "click .btn-rename-cancel"    : "onBtnCancelClick"
    }

    , initialize: function () {
        _.bindAll (this, "render");
        this.listenTo(this.model, "change add sync", this.render);
        this.listenTo(UB.session.user, "change add sync", this.render);
        this.listenTo(UB.Collections.allPlaylists, "change add sync remove", this.render);
    }

    , render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }

    , onKeydown: function (e) {
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
        }
    }

    , onBtnRenameClick: function (e) {
        var $target = $( e.target );

        this.validateAndSubmit($target);
    }

    , onBtnCancelClick: function () {
        this.clearPlaylistModifications();
    }

    , getParsleyInstance: function () {
        var playlistId = this.currentEditedPlaylist.id;
        var $form = this.$(".playlist-row[data-playlist-id='" + playlistId + "'] form");

        var toValidate = $form.parsley({
            errorClass: "uk-form-danger",
            successClass: "uk-form-success"
        });

        this.currentEditedPlaylistParsleyInstance = toValidate;
        return toValidate;
    }

    , validateAndSubmit: function ($target) {
        // Check if form is valid before submission.
        var toValidate = this.getParsleyInstance($target);

        if (toValidate && toValidate.validate()) {
            this.submitPlaylistNameModification(toValidate.$element.find("input").val());
            this.clearPlaylistModifications();
        }
    }

    , submitPlaylistNameModification: function (newName) {
        if (this.currentEditedPlaylist) {
            this.currentEditedPlaylist.set({
                name: newName
            });
            this.currentEditedPlaylist.save();
        }

        this.currentEditedPlaylist = null;
    }

    , clearPlaylistModifications: function () {
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
    }

    , editPlaylist: function (e) {
        if (e) {
            // Clear all modifications so that we don't have multiple edits
            // at the same time.
            this.clearPlaylistModifications();

            var $target = $(e.currentTarget);
            var playlistId = $target.data("playlist-id");
            var playlist = UB.Collections.allPlaylists.get(playlistId);
            this.currentEditedPlaylist = playlist;

            var $parentContainer = this.$(".playlist-row[data-playlist-id='" + playlistId + "']");
            $parentContainer.addClass("dirty");
            $parentContainer.find(".playlist-link").addClass("uk-hidden");
            $parentContainer.find(".rename-playlist-input")
                .removeClass("uk-hidden")
                .val(playlist.get("name"));
            $parentContainer.find(".edit-buttons-group").removeClass("uk-hidden");

            $parentContainer.find("input").focus();
        }
    }

    , followUser: function (e) {
        e.preventDefault();

        this.trigger("followUser", {
            toFollow: this.model.toJSON()
        });
    }

    , unfollowUser: function (e) {
        e.preventDefault();

        this.trigger("unfollowUser", {
            toUnfollow: this.model.toJSON()
        });
    }
});