/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Collections.SearchResultCollection = Backbone.Collection.extend({

    model: UB.Models.SearchResultModel,

    parse: function (data) {
        if (data.results) {
            return data.results;
        }
        else {
            return data;
        }
    }

});