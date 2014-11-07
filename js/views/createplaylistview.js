/**
 * Created by Vincent on 2014-11-06.
 */

window.UB.Views.CreatePlaylistView = Backbone.View.extend({

    events: {
        "click #btn-create-playlist"  : "createPlaylist",
        "click #btn-cancel"           : "cancel"
    },

    initialize: function () {
        this.listenTo(this.model, "invalid", this.onInvalid);
    },

    render: function() {
        this.$el.html(this.template());
        this.$modal = $.UIkit.modal("#new-playlist-modal");
        return this;
    },

    createPlaylist: function (e) {
        if (this.model.save({name: this.$("#new-playlist-name").val()})) {

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
                this.$("#new-playlist-name")
                    .addClass("uk-form-danger")
                    .attr("placeholder", error.desc);
                break;
            case "ownerEmpty":
                console.log("Playlist doesn't have an owner.");
                break;
            default :
                console.log("Unknown error occurred when validating the new playlist.");
        }
    }
});