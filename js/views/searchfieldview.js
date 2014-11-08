/**
 * Created by Michel on 08/11/2014.
 */

window.UB.Views.SearchFieldView = Backbone.View.extend({

    el: ".search-field-container",

    render: function() {
        this.$el.html(this.template());
        return this;
    }
});