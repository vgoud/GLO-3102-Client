/**
 * Created by Michel on 03/11/2014.
 */

window.UB.Models.PlaylistModel = Backbone.Model.extend({
    defaults: {
        name: "n/d",
        tracks: [],
        owner: {
            id: "vince82",
            email: "vince@bidon.com",
            name: "owner"
        }
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

        if(!this.isPresent(track)){
            this.attributes.tracks.push(track);
        }
        return this;
    },

    isPresent: function(track){
        var bool = false;
        var tracks = this.get("tracks");

        for(var i = 0; i < tracks.length; i++){
            if(tracks[i].trackId === track.trackId){
                bool = true;
                console.log("\""+track.trackName+"\""+"already in the playlist");
            }
        }
        return bool;
    }

});