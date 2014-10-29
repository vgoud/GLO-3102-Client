/**
 * Created by Vincent on 2014-10-26.
 */

window.UB.Models.AlbumInfoModel = Backbone.Model.extend({
    defaults: {
        artworkUrl60: "",
        artworkUrl100: "",
        collectionName: "n/d",
        trackCount: "n/d",
        copyright: "n/d",
        releaseDate: "n/d",
        artistViewUrl: "",
        collectionViewUrl: "",
        collectionPrice: "n/d",
        primaryGenreName: "n/d"
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