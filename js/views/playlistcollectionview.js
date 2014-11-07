window.UB.Views.PlaylistCollectionView = Backbone.View.extend({

    events:{
        "click #btn-create-playlist": "buttonCreatePlaylist"
    },

    render: function() {
        return this;
    },
    buttonCreatePlaylist: function (event) {
        console.log("NewPlaylist button has been used.");
        var newPlaylist = this.collection.create({
            name: $('#new-playlist-name').val()
        }, {
            type: 'POST'
        });
        if (!newPlaylist) {
            console.log("There was an error during the playlist creation");
        }
    }
});