/**
 * Created by Vincent on 2014-11-30.
 *
 * Source: https://github.com/alexanderscott/backbone-login
 */

UB.Models.UserModel = Backbone.Model.extend({

    initialize: function(){
//        _.bindAll(this);
    },

    defaults: {
        id: 0,
        name: "",
        email: "",
        following: []
    }

});