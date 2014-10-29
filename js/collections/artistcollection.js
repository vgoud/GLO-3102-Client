/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Collections.ArtistCollection = Backbone.Collection.extend({

    model: UB.Models.ArtistModel,

    parse: function (data) {
        console.log("Parsing artist collection data from server, data received :");
        console.log(data);

        var artist = data.results;
        return artist;
    }

});