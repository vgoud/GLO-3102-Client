/**
 * Created by Vincent on 2014-12-04.
 */

window.UB.Views.UserView = Backbone.View.extend({

    events: {
        "click #btn-follow-user"   : "followUser",
        "click #btn-unfollow-user" : "unfollowUser"
    }

    , initialize: function () {
        _.bindAll (this, "render");
        this.listenTo(this.model, "change add sync", this.render);
        this.listenTo(UB.session.user, "change add sync", this.render);
        this.listenTo(UB.Collections.allPlaylists, "change add sync remove", this.render);
    }

    , render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }

    , followUser: function (e) {
        e.preventDefault();

        this.trigger("followUser", {
            toFollow: this.model.toJSON()
        });
    }

    , unfollowUser: function (e) {
        e.preventDefault();

        this.trigger("unfollowUser", {
            toUnfollow: this.model.toJSON()
        });
    }
});