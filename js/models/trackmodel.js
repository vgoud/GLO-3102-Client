/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Models.TrackModel = Backbone.Model.extend({
    defaults: {
        trackNumber: "n/d",
        trackTimeMillis: "n/d",
        previewUrl: "",
        trackId: "",
        trackName: "",
        artistName: "",
        trackNumber: "",
        artistId: ""
    },

    idAttribute: "trackId",

    parse: function (data) {
        // We do not want those attributes in the model.
        delete data.wrapperType;
        delete data.kind;
        delete data.radioStationUrl;

        return data;
    }

});