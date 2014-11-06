window.UB.Views.PlaylistCollectionView = Backbone.View.extend({

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
    }

});