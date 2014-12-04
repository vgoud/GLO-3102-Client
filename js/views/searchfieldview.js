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

    submit: function () {
        var self = this;
        self.trigger("searchSucceeded", {
            searchValue: this.$("#search-field-navbar").val(),
            searchType: this.$("#search-option-navbar").val()
        });
    },

    onSubmit: function () {
        this.$("#submit-error").removeClass("error");

        var goodDatas = false;

        _.each(this.searchParsleyFormInstance, function(elem, key) {
            if (elem.validate()) {
                goodDatas = true;
            }
        });

        if (goodDatas) {
            this.submit();
        };
    }
});