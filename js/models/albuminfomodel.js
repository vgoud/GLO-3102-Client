/**
 * Created by Vincent on 2014-10-26.
 */

window.UB.Models.AlbumInfoModel = Backbone.Model.extend({
    defaults: {
        artworkUrl60: "",
        artworkUrl100: "",
        artworkUrl200: "",
        artworkUrl400: "",
        collectionName: "n/d",
        trackCount: "n/d",
        copyright: "n/d",
        releaseDate: "n/d",
        artistViewUrl: "",
        collectionViewUrl: "",
        collectionPrice: "n/d",
        primaryGenreName: "n/d",
        artistId: "",
        artistName:""
    },

    initialize: function() {
        this.on("sync", function(model) {
            // Sets the id to be the collection Id after a fetch.
            model.set("id", model.get("collectionId"));
        })
    },

    parse: function(data) {

        var albumInfo = data.results[0];

        var extension =
            albumInfo.artworkUrl100.substr(
                albumInfo.artworkUrl100.lastIndexOf("."),
                albumInfo.artworkUrl100.length);
        var albumInfoWithSize =
            albumInfo.artworkUrl100.substr(
                0,
                albumInfo.artworkUrl100.lastIndexOf("."));
        albumInfo.artworkUrl200 =
            albumInfoWithSize.substr(
                0,
                albumInfoWithSize.lastIndexOf(".")) + ".200x200-75" + extension;
        albumInfo.artworkUrl400 =
            albumInfoWithSize.substr(
                0,
                albumInfoWithSize.lastIndexOf(".")) + ".400x400-75" + extension;

        return albumInfo;
    }
});