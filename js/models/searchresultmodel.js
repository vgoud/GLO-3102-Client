/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Models.SearchResultModel = Backbone.Model.extend({
    idAttribute: "trackId",
    attributeId: "collectionId",

    parse: function (data) {
        return data;
    }
});