/**
 * Created by Vincent on 2014-12-04.
 */

window.UB.Views.UserView = Backbone.View.extend({

    initialize: function () {
        _.bindAll (this, "render");
        this.listenTo(this.model, "change add sync", this.render);
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});