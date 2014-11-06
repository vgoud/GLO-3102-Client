window.UB.Views.PlaylistCollectionView = Backbone.View.extend({

/*
    initialize: function() {
        this.listenTo(this.collection.models, "change add sync", this.render);
    },

*/

    render: function() {
/*
        _.each(this.collection.models, function(playlist) {
            this.$("ul").append(
                new UB.Views.PlaylistCollectionView({model: playlist}).render().el)
        });*/
        return this;
    }

});