/**
 * Created by Michel on 03/11/2014.
 */

window.UB.Views.PlaylistView = Backbone.View.extend({

    tagName: "ul",
    className: "uk list uk-list-line",

    initialize: function () {
        this.listenTo(this.model, "change add sync", this.render);
    },

    //Il va y avoir du traitement à faire pour aller chercher uniquement les playlists de l'utilisateur courant.
    render: function() {
/*
        $(this.el).html(this.template({
            playlist: this.model.toJSON()
        }));
*/
        var tracklist = this.model.attributes.tracks;


        this.$el.html(this.template());
        _.each(tracklist, function(track) {
            console.log(track.trackName);
            /*
            this.$("tbody").append(
                new UB.Views.TrackView({model: track}).render().el);*/
        });

        return this;

    }
});