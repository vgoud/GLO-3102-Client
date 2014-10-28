/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Models.AlbumModel = Backbone.Model.extend({
    defaults: {
        collectionId: "n/d",
        collectionName: "n/d",
        artworkUrl100: "n/d"
    },

    initialize: function() {
        this.on("sync", function(model) {
            // Sets the id to be the trackId after a fetch.
            model.set("id", model.get("collectionId"));
        })
    }
});