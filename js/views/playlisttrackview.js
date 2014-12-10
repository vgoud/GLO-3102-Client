window.UB.Views.PlaylistTrackView = Backbone.View.extend({

    tagName: "tr",

    initialize: function (options) {
        this.listenTo(this.model, "change", this.render);
        this.options = options || {};
    },

    render: function() {
        $(this.el).html(this.template({track: this.model.toJSON(), ownerId: this.options.ownerId, userId: UB.session.user.id}));
        return this;
    }
});
