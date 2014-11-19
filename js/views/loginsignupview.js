/**
 * Created by Vincent on 2014-11-18.
 */

window.UB.Views.LoginSignupView = Backbone.View.extend({

    id: "login-signup-container",

    events: {
        "click #tab-item-login"  : "displayLoginForm",
        "click #tab-item-signup" : "displaySignupForm",
        "click #login-submit"    : "onLoginSubmitClick",
        "click #signup-submit"   : "onSignupSubmitClick"
    },

    initialize: function () {
        _.bindAll(this,
            "render",
            "onLoginSubmitClick",
            "submitLogin"
        );
    },

    render: function() {
        this.$el.html(this.template());

        this.loginParsleyFormInstance = this.$('#tab-login-form').parsley({
            errorClass: "uk-form-danger",
            successClass: "uk-form-success"
        });

        this.signupParsleyFormInstance = this.$('#tab-signup-form').parsley({
            errorClass: "uk-form-danger",
            successClass: "uk-form-success"
        });

        return this;
    },

    displayLoginForm: function () {
        this.$("ul li").toggleClass("uk-active");
        this.$("#tab-login-form, #tab-signup-form").toggleClass("active");
    },

    displaySignupForm: function () {
        this.$("ul li").toggleClass("uk-active");
        this.$("#tab-login-form, #tab-signup-form").toggleClass("active");
    },

    submitLogin: function () {
        var self = this;

        $.ajax({
            url: UB.urlBase + "login",
            type: "POST",
            contentType: "application/x-www-form-urlencoded",
            data: {
                email: this.$("#login-username").val(),
                password: this.$("#login-password").val()
            }
        }).done(function (data) {
            // Create session with returned logged-in user info and token
            // and redirect to home.
            self.trigger("loginSucceeded", {
                user: data
            });
        }).fail(function (jqXHR, textStatus) {
            self.$("#login-error").addClass("error");
        });
    },

    onLoginSubmitClick: function () {
        this.$("#login-error").removeClass("error");

        if (this.loginParsleyFormInstance.validate()) {
            this.submitLogin();
        };
    },

    submitSignup: function () {
        var self = this;

        $.ajax({
            url: UB.urlBase + "signup",
            type: "POST",
            contentType: "application/x-www-form-urlencoded",
            data: {
                name: this.$("#signup-name").val(),
                email: this.$("#signup-email").val(),
                password: this.$("#signup-password").val()
            }
        }).done(function (data) {
            // Redirect to login?.
            self.trigger("signupSucceeded", {
                user: data
            });
        }).fail(function (jqXHR, textStatus) {
            self.$("#signup-error").addClass("error");
        });
    },

    onSignupSubmitClick: function () {
        this.$("#submit-error").removeClass("error");

        if (this.signupParsleyFormInstance.validate()) {
            this.submitSignup();
        };
    }

});
