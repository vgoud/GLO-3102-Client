/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Models.TrackModel = Backbone.Model.extend({
    defaults: {
        trackNumber: "n/d",
        trackTimeMillis: "n/d",
        previewUrl: "",
        trackId: "",
        trackName: ""
    },

    idAttribute: "trackId"

});