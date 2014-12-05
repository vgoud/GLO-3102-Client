/**
 * Created by Charles on 2014-10-30.
 */


window.UB.Views.HomeView = Backbone.View.extend({


    initialize: function () {
        this.listenTo(this.collection, 'add', this.render);
    },

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});