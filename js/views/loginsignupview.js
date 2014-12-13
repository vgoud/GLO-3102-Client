/**
 * Created by Vincent on 2014-11-18.
 */

window.UB.Views.LoginSignupView = Backbone.View.extend({

    id: "login-signup-container",

    events: {
        "click #tab-item-login"  : "displayLoginForm",
        "click #tab-item-signup" : "displaySignupForm",
        "click #login-submit"    : "onLoginSubmitClick",
        "click #signup-submit"   : "onSignupSubmitClick",
        "keydown"                : "onKeydown"
    },

    initialize: function () {
        _.bindAll(this,
            "render",
            "onLoginSubmitClick",
            "submitLogin",
            "onKeydown"
        );
    },

    render: function() {
        this.$el.html(this.template(this.model.toJSON()));

        this.$loginSignupMessageAlert = this.$("#login-signup-message");

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

    onKeydown: function (e) {
        var $event = $( e );
        if (e.which == 13 && e.target.id.indexOf("login") > -1) {
            this.onLoginSubmitClick();
        } else if (e.which == 13 && e.target.id.indexOf("signup") > -1) {
            this.onSignupSubmitClick();
        }
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

        UB.session.login({
                email: this.$("#login-username").val(),
                password: this.$("#login-password").val()
            }, {
                success: function (data) {
                    self.trigger("loginSucceeded", {
                        user: data
                    });
                },
                error: function () {
                    self.$("#login-error").addClass("error");
                }
            }
        );
    },

    onLoginSubmitClick: function () {
        this.$("#login-error").removeClass("error");

        if (this.loginParsleyFormInstance.validate()) {
            this.submitLogin();
        }
    },

    submitSignup: function () {
        var self = this;

        UB.session.signup({
                name: this.$("#signup-name").val(),
                email: this.$("#signup-email").val(),
                password: this.$("#signup-password").val()
            }, {
                success: function (data) {
                    self.trigger("signupSucceeded", {
                        user: data
                    });
                },
                error: function () {
                    self.$("#signup-error").addClass("error");
                }
            }
        );
    },

    onSignupSubmitClick: function () {
        this.$("#submit-error").removeClass("error");

        if (this.signupParsleyFormInstance.validate()) {
            this.submitSignup();
        }
    },

    showMessage: function (e) {
        if (this.$loginSignupMessageAlert) {
            this.$loginSignupMessageAlert.find("p").text(e.msg.text);
            this.$loginSignupMessageAlert.removeClass("uk-hidden");

            switch (e.msg.code) {
                case  "error" :
                    this.$loginSignupMessageAlert.removeClass("uk-alert-success uk-alert-warning");
                    this.$loginSignupMessageAlert.addClass("uk-alert-danger");
                    break;
                case "success" :
                    this.$loginSignupMessageAlert.removeClass("uk-alert-danger uk-alert-warning");
                    this.$loginSignupMessageAlert.addClass("uk-alert-success");
                    break;
                case "warning" :
                    this.$loginSignupMessageAlert.removeClass("uk-alert-success uk-alert-danger");
                    this.$loginSignupMessageAlert.addClass("uk-alert-warning");
                    break;
                default:
                    this.$loginSignupMessageAlert.removeClass("uk-alert-success uk-alert-warning");
                    this.$loginSignupMessageAlert.addClass("uk-alert-danger");
            }
        }
    }

});
