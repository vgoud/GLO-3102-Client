/**
 * Created by Michel on 03/11/2014.
 */

window.UB.Collections.PlaylistCollection = Backbone.Collection.extend({
    model: UB.Models.PlaylistModel,


    parse: function (data) {
        console.log("Parsing playlist collection data from server, data received :");
        console.log(data);

        var playlist = data.results;
        return playlist;
    }
});