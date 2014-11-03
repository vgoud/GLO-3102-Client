/**
 * Created by Michel on 03/11/2014.
 */

window.UB.Views.PlaylistView = Backbone.View.extend({

    tagName: "ul",
    className: "uk list uk-list-line",

    initialize: function () {
        this.listenTo(this.collection, "change add sync", this.render);
    },

    //Il va y avoir du traitement à faire pour aller chercher uniquement les playlists de l'utilisateur courant.
    render: function() {
        $(this.el).html(this.template({
            playlists: this.collection.toJSON()
        }));
        return this;
    }
});