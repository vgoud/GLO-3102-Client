/**
 * Created by Vincent on 2014-11-06.
 */

window.UB.Models.CreatePlaylistModel = Backbone.Model.extend({
    defaults: {
        name: "",
        owner: {
            id: "vince82",
            email: "vince@bidon.com",
            name: "owner"
        }
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
        } else if (! attrs.owner) {
            return {
                type: "ownerEmpty",
                desc: "The owner of the playlist must be specified."
            };
        }
    }
});