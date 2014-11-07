window.UB.Views.PlaylistCollectionView = Backbone.View.extend({

    events:{
        "click #btn-create-playlist": "buttonCreatePlaylist"
    },

    initialize: function() {
        this.listenTo(this.collection, "change add sync", this.render);
    },

    render: function () {
        this.$el.html(this.template());
        _.each(this.collection.models, function(playlist) {
            this.$("ul".append(
                new UB.Views.TrackView({collection: playlist}).render().el))
        });

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