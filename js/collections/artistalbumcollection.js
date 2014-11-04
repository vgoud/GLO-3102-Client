/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Collections.ArtistAlbumCollection = Backbone.Collection.extend({

    model: UB.Models.AlbumModel,

    parse: function (data) {
        console.log("Parsing artist albums collection data from server, data received :");
        console.log(data);

        var artistAlbums = data.results;
        _.each(artistAlbums, function(album) {

            var extension = album.artworkUrl100.substr(album.artworkUrl100.lastIndexOf("."), album.artworkUrl100.length);
            var albumWithSize = album.artworkUrl100.substr(0, album.artworkUrl100.lastIndexOf("."));
            album.artworkUrl200 = albumWithSize.substr(0, albumWithSize.lastIndexOf(".")) + ".200x200-75" + extension;
            album.artworkUrl400 = albumWithSize.substr(0, albumWithSize.lastIndexOf(".")) + ".400x400-75" + extension;
        });
        return artistAlbums;
    }

});