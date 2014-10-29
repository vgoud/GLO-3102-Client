/**
 * Created by Vincent on 2014-10-26.
 */

window.UB.Views.AlbumInfoView = Backbone.View.extend({

    tagName: "div",

    id: "album-info-top",

    className: "uk-grid uk-grid-small",

    initialize: function () {
        this.listenTo(this.model, "all", this.render);
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});