/**
 * Created by Michel on 2014-11-06.
 */


//Besoin de l'id de la playlist à enregistrer quelque part ici ou ailleurs..
window.UB.Models.RenamePlaylistModel = Backbone.Model.extend({
    defaults: {
        name: "",
        owner: "bidon@bidon.com"
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