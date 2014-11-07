/**
 * Created by Michel on 07/11/2014.
 */

window.UB.Views.RenamePlaylistView = Backbone.View.extend({

    events: {
        "click #btn-rename-playlist"  : "renamePlaylist",
        "click #btn-cancel"           : "cancel"
    },

    initialize: function () {
        this.listenTo(this.model, "invalid", this.onInvalid);
    },

    render: function() {
        this.$el.html(this.template());
        this.$modal = $.UIkit.modal("#rename-playlist-modal");
        return this;
    },

    createPlaylist: function (e) {
        if (this.model.save({name: this.$("#renamed-playlist-name").val()})) {
            this.close();
        };
    },

    close: function () {
        // The call to .hide() doesn't work for an obscure reason.
        this.$(".uk-close").click();
    },

    cancel: function () {
        this.close();
    },

    onInvalid: function (model, error) {
        switch (error.type) {
            case "nameEmpty":
                this.$("#renamed-playlist-name")
                    .addClass("uk-form-danger")
                    .attr("placeholder", error.desc);
                break;
            default :
                console.log("Unknown error occurred when renaming the playlist.");
        }
    }
});