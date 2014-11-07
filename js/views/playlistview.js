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
        console.log(this.model);

        this.$el.html(this.template({
            trackList : this.model.toJSON().tracks
        }));


        return this;
    }
});