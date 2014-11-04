/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Models.ArtistModel = Backbone.Model.extend({
    defaults: {
        artistName: "n/d",
        primaryGenreName: "n/d",
        artistLinkUrl: "n/d"
    },

    initialize: function() {
        this.on("sync", function(model) {
            // Sets the id to be the collection Id after a fetch.
            model.set("id", model.get("collectionId"));
        })
    },

    parse: function(data) {
        return data.results[0];
    }

});