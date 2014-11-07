/**
 * Created by Michel on 2014-11-06.
 */

window.UB.Models.RenamePlaylistModel = Backbone.Model.extend({
    defaults: {
        name: "",
        owner: "bidon@bidon.com"
    },

    initialize: function(id) {
        this.on("sync", function(model) {
            model.set("id", id);
        })
    },

    parse: function (data) {
        return data;
    },

    validate: function (attrs, options) {
        // Remove leading and trailing spaces before validation.
        attrs.name = attrs.name.replace(/^\s+(.*)\s+$/i, "$1");

        if (! attrs.name) {
            return {
                type: "nameEmpty",
                desc: "The name of the playlist cannot be empty."
            };
        }
    }
});