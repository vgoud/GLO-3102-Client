/**
 * Created by Michel on 03/11/2014.
 */

window.UB.Collections.PlaylistCollection = Backbone.Collection.extend({

    model: UB.Models.PlaylistModel

    , parse: function (data) {
        console.log("Parsing playlist collection data from server, data received :");
        console.log(data);

        return data;
    }

    , comparator: function (playlist) {
        return playlist.get("owner").id;
    }

    // Returns an object whose keys are the owners' ids and values are the list of playlists
    // from those owners.
    , groupPlaylistsByOwner: function () {
        return _.groupBy(this.models, this.comparator);
    }

    // Gets all playlists from a specified owner.
    , getPlaylistFromOwner: function (ownerId) {
        return _.filter(this.models, function (playlist) {
            return playlist.get("owner").id == ownerId;
        })
    }

    // Partitions playlists around the specified owner id.
    , partitionPlaylists: function (ownerId) {
        var partitioned = _.partition(this.models, function (playlist) {
            return playlist.get("owner").id == ownerId;
        });

        var obj = {};
        obj[ownerId] = partitioned[0];
        obj.others = partitioned[1];

        return obj;
    }

});