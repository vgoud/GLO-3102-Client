/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Models.TrackModel = Backbone.Model.extend({
    defaults: {
        trackNumber: "n/d",
        trackTimeMillis: "n/d",
        previewUrl: "",
        trackId: ""
    },

    idAttribute: "trackId"

//    initialize: function() {
//        this.on("sync", function(model) {
//            // Sets the id to be the trackId after a fetch.
//            model.set("id", model.get("trackId"));
//        })
//    }
});