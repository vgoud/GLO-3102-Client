/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.SearchResultUserView = Backbone.View.extend({

    tagName: "tr",

    events: {
        "click .follow-user": "follow"
    },


    initialize: function (options) {
        this.listenTo(this.model, "change", this.render);
        this.options = options || {};
    },

    render: function () {
        $(this.el).html(this.template({user: this.model.toJSON()}));
        return this;
    },

    follow: function (e) {
        // TODO Follow user
        console.log("TODO!! Follow user: ");
        console.log(this.model)
    }
});