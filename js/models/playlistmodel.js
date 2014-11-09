/**
 * Created by Michel on 03/11/2014.
 */

window.UB.Models.PlaylistModel = Backbone.Model.extend({
    defaults: {
        name: "n/d",
        tracks: [],
        owner: {
            email: "n/d",
            name: "n/d",
            id: "n/d"
        }
        //id: "n/d" // en commentaire sinon CreatePlaylist car post playlist n'utilise pas d'id!
    },

    attributeId: "id",

    urlRoot: UB.urlBase + "playlists",

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
    },

    addTrackToPlaylist: function(track) {
        console.log("adding a track to a playlist");
        this.attributes.tracks.push(track);
        return this;
    }

});