window.UB.Views.PlaylistCollectionView = Backbone.View.extend({
    el: "#playlists-container",
    events:{
        "click #btn-create-playlist": "buttonCreatePlaylist"
    },
    initialize: function() {
       _.bindAll(this, "render");

        this.listenTo(this.collection, "change add sync", this.render);
    },

    render: function() {
        this.$el.html(this.template({
            playlists: this.collection.toJSON()
            //playlists: filterPlaylists(this.collection.toJSON())
        }));
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

// Va devoir trouver une façon de savoir le email de l'utilisateur courant pour filtrer les playlists
// et uniquement récupérer celles qui lui appartient.
    filterPlaylists = function(playlists) {
        return _.filter(playlists, function(playlist) {
            return playlist.owner.email === "micou@gmail.com";
        });
    }