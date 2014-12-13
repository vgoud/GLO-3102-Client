/**
 * Created by Sebastien on 12/11/2014.
 */

window.UB.Models.LocalAlbumModel = Backbone.Model.extend( {

    defaults: {
        collectionId: "",
        collectionName: "",
        artworkUrl100: ""
    },

    attributeId: "collectionId",

    parse: function (data) {

        var albumInfo = data;

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

        return data;
    }
});