/**
 * Created by Vincent on 2014-10-15.
 */

window.UB.Views.SearchResultsView = window.UB.Views.TrackCollectionView.extend({

    tagName: "div",
    className: "uk-container uk-container-center",

    events: function(){
        return _.extend({}, window.UB.Views.TrackCollectionView.prototype.events,{
            "click #load-more-button"             : "loadMore"
        });
    },

    initialize: function (options) {
        window.UB.Views.TrackCollectionView.prototype.initialize.apply(this, [options]);
        //_.bindAll(this, "render");
    },

    render: function () {
        var pColl = this.options.playlistCollection;
        this.$el.html(this.template({searchString: this.options.searchString, mode: this.options.mode}));
        _.each(this.collection.models, function (result) {

            if (result.attributes.wrapperType == "track") {
                this.$("tbody").append(new UB.Views.SearchResultTrackView({model: result, playlistCollection: pColl}).render().el);
            }
            else if (result.attributes.wrapperType == "artist") {
                this.$("tbody").append(new UB.Views.SearchResultArtistView({model: result, playlistCollection: pColl}).render().el);
            }
            else if (result.attributes.wrapperType == "collection") {
                this.$("tbody").append(new UB.Views.SearchResultCollectionView({model: result, playlistCollection: pColl}).render().el);
            }
            else if (result.attributes.name) { //user
                this.$("tbody").append(new UB.Views.SearchResultUserView({model: result}).render().el);
            }
            else {
                console.log("Result type not supported.");
            }

        });

        return this;
    },

    loadMore: function() {
        var self = this;
        $("#load-more-loading").show();
        $("#load-more-button").hide();
        console.log("loadmore");
        self.trigger("searchMore", {
            searchValue: self.options.searchString,
            searchType: self.options.mode + "/",
            searchLimit: self.options.limit + 10
        });
    }
});