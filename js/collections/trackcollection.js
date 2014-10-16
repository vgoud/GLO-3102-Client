/**
 * Created by Vincent on 2014-10-15.
 */

window.UBeat.Collections.TrackCollection = Backbone.Collection.extend({

    model: UBeat.Models.TrackModel,

    parse: function (data) {
        console.log("Parsing track collection data from server, data received :");
        console.log(data);
        // Remove the first item, which is the album.
        var tracks = data.results;
        tracks.shift();
        return tracks;
    }

});