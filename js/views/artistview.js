/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.ArtistView = Backbone.View.extend({

    tagName: "span",

    initialize: function () {
        _.bindAll (this, "render");
        this.listenTo(this.model, "change add sync", this.render);
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});