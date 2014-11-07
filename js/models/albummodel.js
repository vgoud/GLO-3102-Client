/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Models.AlbumModel = Backbone.Model.extend({
    defaults: {
        collectionId: "",
        collectionName: "",
        artworkUrl100: ""
    },

    attributeId: "collectionId",

    parse: function (data) {
        return data;
    }
});