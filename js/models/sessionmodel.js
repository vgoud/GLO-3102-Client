/**
 * Created by Vincent on 2014-11-30.
 *
 * Source: https://github.com/alexanderscott/backbone-login
 */

UB.Models.SessionModel = Backbone.Model.extend({

    defaults: {
        loggedIn: false,
        userId: "",
        token: ""
    },

    cookieTokenKey: "ubeat-token",

    initialize: function(){
        // Singleton user object
        // Access or listen on this throughout any module with UB.session.user.
        this.user = new UB.Models.UserModel({});
    },

    // Fxn to update user attributes after if authentication is successful.
    updateSessionUser: function( userData ){
        this.user.set(_.pick(userData, _.keys(this.user.defaults)));
    },

    getCookie: function () {
        return $.cookie(this.cookieTokenKey);
    },

    setCookie: function(token) {
        $.cookie(this.cookieTokenKey, token);
    },

    deleteCookie: function () {
        $.cookie(this.cookieTokenKey, null);
    },

    checkAuth: function(callback, args) {
        var self = this;

        // Simple checkup of the session properties.
        if (this.get("loggedIn") || this.getCookie()) {
            if (! this.get("loggedIn")) {
                // User not logged in, but we have the token.
                // Validate token with server and get user information.
                $.ajax({
                    url: UB.urlBase + "tokenInfo",
                    type: 'GET',
                    beforeSend : function(xhr) {
                        // set header
                        xhr.setRequestHeader("Authorization", self.getCookie());
                    },
                    async: false
                }).done(function(data){
                    // Token is still valid.
                    self.updateSessionUser(data);
                    self.set({
                        userId: data.id,
                        loggedIn: true,
                        token: data.token
                    });

                    self.setCookie(data.token);

                    // Setup all future headers to include the token.
                    $.ajaxSetup({
                        headers: { "Authorization": data.token }
                    });

                    if(callback && 'success' in callback) callback.success(self.user);
                    return self.user;

                }).fail(function(){
                    // Token is invalid.
                    // User needs to authenticate.
                    if(callback && 'error' in callback) callback.error();
                    // Reset the session.
                    self.set(self.defaults);
                    return false;
                });
            }
            if('success' in callback) callback.success(args);
            return this.user;
        } else {
            if('error' in callback) callback.error(args);
            return false;
        }
    },

    /*
     * Abstracted fxn to make a POST request to the auth endpoint
     * This takes care of updating the user and session after receiving an API response.
     */
    postAuth: function(opts, callback, args){
        var self = this;
        var postData = _.omit(opts, 'method');

        var isLoginSignup = _.indexOf(['login', 'signup'], opts.method) !== -1;
        var type = "POST";
        if (! isLoginSignup) type = "GET"; // Method is logout.

        $.ajax({
            url: UB.urlBase + opts.method,
            contentType: "application/x-www-form-urlencoded",
            type: type,
            data: postData
        }).done(function(data){
                if(isLoginSignup){

                    self.updateSessionUser(data);
                    self.set({
                        userId: data.id,
                        loggedIn: ! (opts.method == "signup"),
                        token: data.token
                    });

                    if (! (opts.method == "signup")) {
                        self.setCookie(data.token);

                        // Setup all future headers to include the token.
                        $.ajaxSetup({
                            headers: { "Authorization": data.token }
                        });
                    }
                } else {
                    // Logout. Reset the session.
                    self.set(self.defaults);
                    self.deleteCookie();
                }

                if(callback && 'success' in callback) callback.success(data);
            }).fail(function(){
                if(callback && 'error' in callback) callback.error();
        });
    },

    login: function(opts, callback, args){
        this.postAuth(_.extend(opts, { method: 'login' }), callback);
    },

    logout: function(opts, callback, args){
        this.postAuth(_.extend(opts, { method: 'logout' }), callback);
    },

    signup: function(opts, callback, args){
        this.postAuth(_.extend(opts, { method: 'signup' }), callback);
    }

});