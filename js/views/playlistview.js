/**
 * Created by Michel on 03/11/2014.
 */

window.UB.Views.PlaylistView = Backbone.View.extend({

    tagName: "ul",
    className: "uk list uk-list-line",

    initialize: function () {
        this.listenTo(this.model, "change add sync", this.render);

    },

    render: function () {
        var tracks = this.model.attributes.tracks;

        this.$el.html(this.template());
        _.each(tracks, function (track) {
            this.$("tbody").append(
                new UB.Views.PlaylistTrackView({model: track}).render().el);
        });

        return this;
    }
});