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
        e.preventDefault();

        var newName = this.$input.val();

        if (this.model.set({name: newName})) {
            this.model.save();
        }
    },

    close: function () {
        // The call to .hide() doesn't work for an obscure reason.
        this.$(".uk-close").click();
//        if ( this.$modal.isActive() ) {
//            this.$modal.hide();
//        }
    },

    cancel: function (e) {
        e.preventDefault();
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