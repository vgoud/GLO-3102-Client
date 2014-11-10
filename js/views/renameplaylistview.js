/**
 * Created by Michel on 07/11/2014.
 */

window.UB.Views.RenamePlaylistView = Backbone.View.extend({

    events: {
        "click #btn-rename-playlist"  : "renamePlaylist",
        "click #btn-cancel"           : "cancel"
    },

    initialize: function () {
        _.bindAll(this, "render");

        this.listenTo(this.model, "invalid", this.onInvalid);
        this.listenTo(this.model, "change", this.render);
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        this.$modal = $.UIkit.modal("#rename-playlist-modal");
        this.$input = this.$("#renamed-playlist-name");
        return this;
    },

    renamePlaylist: function (e) {
        var newName = this.$input.val();
        this.model.fetch({
            success: function(playlistModel) {
                if (playlistModel.set({name: newName})) {
                    playlistModel.save();
                };
            }
        });
        this.close();
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
                this.$input
                    .addClass("uk-form-danger")
                    .attr("placeholder", error.desc);
                break;
            default :
                console.log("Unknown error occurred when renaming the playlist.");
        }
    }
});