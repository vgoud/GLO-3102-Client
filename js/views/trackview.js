/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.TrackView = Backbone.View.extend({

    tagName: "tr",

    events: {
        "click .ajout-track-playlist" : "ajoutTrack"
    },

    initialize: function (options) {
        this.listenTo(this.model, "change", this.render);
        this.options = options || {};
    },

    render: function() {
        var pColl = this.options.playlistCollection;

        $(this.el).html(this.template({track:this.model.toJSON(), pColl :pColl.models}));
        return this;
    },

    ajoutTrack: function(e){

        var url = $(e.currentTarget).data('playlisturl') + "/tracks";

        $.post(url,
            this.model.toJSON(),
            function(data,status){
                alert("Data: " + data + "\nStatus: " + status);
            });
    }
});