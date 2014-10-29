/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Collections.TrackCollection = Backbone.Collection.extend({

    model: UB.Models.TrackModel,

    parse: function (data) {
        console.log("Parsing track collection data from server, data received :");
        console.log(data);

        return data.results;
    }

});