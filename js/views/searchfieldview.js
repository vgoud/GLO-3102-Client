/**
 * Created by Michel on 08/11/2014.
 */

window.UB.Views.SearchFieldView = Backbone.View.extend({

    el: ".search-field-container",

    events: {
        "submit"                 : "onSubmit"
    },

    render: function() {
        this.$el.html(this.template());

        this.searchParsleyFormInstance = this.$('.uk-search').parsley({
            errorClass: "uk-form-danger",
            successClass: "uk-form-success"
        });

        this.$(".parsley-errors-list").hide();

        return this;
    },

    submit: function (e) {
        var $target = $(e.target );

        this.trigger("searchSucceeded", {
            searchValue: $target.find(".uk-search-field").val(),
            searchType: $target.find(".search-option-navbar option:selected").val()
        });
    },

    onSubmit: function (e) {
        e.preventDefault();

        this.$("#submit-error").removeClass("error");

        var goodDatas = false;

        _.each(this.searchParsleyFormInstance, function(elem, key) {
            if (elem.validate()) {
                goodDatas = true;
            }
        });

        if (goodDatas) {
            this.submit(e);
        };
    }
});