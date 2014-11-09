/**
 * Created by Vincent on 2014-11-06.
 */

window.UB.Views.CreatePlaylistView = Backbone.View.extend({

    id: "new-playlist-modal",

    className: "uk-modal",

    events: {
        "click #btn-create-playlist"  : "createPlaylist",
        "click #btn-cancel"           : "cancel",
        "keyup"                       : "onKeyEvent",
        "keydown"                     : "onKeyEvent",
        "keypress"                    : "onKeyEvent"
    },

    initialize: function () {
        _.bindAll(this,
            "render",
            "createPlaylist",
            "onKeyEvent",
            "clear",
            "close",
            "cancel",
            "onInvalid",
            "show"
        );

        this.listenTo(this.model, "invalid", this.onInvalid);
    },

    render: function() {
        this.$el.html(this.template());
        this.$modal = $.UIkit.modal("#new-playlist-modal");
        this.$input = this.$("#new-playlist-name");
        this.$el.on("uk.modal.hide", this.clear);
        this.$el.on("uk.modal.show", this.show);
        return this;
    },

    createPlaylist: function (e) {
        e.preventDefault();
        if (this.model.set({name: this.$input.val()})) {
            this.trigger("newPlaylistCreated", {
                attributes: this.model.toJSON()
            });
            // Make success alert appears and form disappears.
            this.$(".uk-form").addClass("uk-hidden");
            this.$(".uk-alert").removeClass("uk-hidden");
//            document.activeElement.blur();
        };
    },

    onKeyEvent: function (e) {
        if (e && e.keyCode == "13") {
            e.preventDefault();
            e.stopPropagation();
            this.close();
        }
    },

    show: function () {
        this.$(".uk-form").removeClass("uk-hidden");
        this.$el.focus();
    },

    clear: function () {
        this.model.clear();
        this.$input.val("");
        this.$(".uk-alert").addClass("uk-hidden");
        this.trigger("onCreatePlaylistModalViewClose");
    },

    close: function () {
        // The call to .hide() doesn't work for an obscure reason.
//        this.$(".uk-close").click();

        this.clear();
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