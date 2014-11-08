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
        },
        id: "n/d"
    },

    urlRoot: UB.urlBase + "playlists"

});