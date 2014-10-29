/**
 * Created by Vincent on 2014-09-25.
 */

$(document).ready(function () {

//    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NDNiZmJhNWQ1MDEyZmQ0MGRjMzlhMGMiLCJleHAiOjE0MTM0OTEyMzY0NDR9.w2msrDhI90_pmGO-_DfugqZNOP0en7EqADFhmIfVtZA";

//    $.ajaxSetup({
//        headers: { "Authorization": token }
//    });

    UB.albumInfoUrl = "http://localhost:3000/unsecure/albums/718938040";
    UB.albumTracksUrl = "http://localhost:3000/unsecure/albums/718938040/tracks";

    UB.Utils.templateLoader.load([
        "TrackView",
        "TrackCollectionView",
        "AlbumInfoView"
    ], function () {

        UB.Models.albumInfoModel = new UB.Models.AlbumInfoModel();
        UB.Models.albumInfoModel.url = UB.albumInfoUrl;
        UB.Views.albumInfoView = new UB.Views.AlbumInfoView({
            model: UB.Models.albumInfoModel
        });

        UB.Models.albumInfoModel.fetch({
            success: function (model) {
                console.log("Album info model fetched sucessfully.");
                console.log(UB.Models.albumInfoModel.toJSON());
                $("#album-info-top-container").html(UB.Views.albumInfoView.render().el);
            },
            error: function(coll) {
                console.log("Track collection cannot fetch data.");
            }
        });

        // Will become a member of the router eventually.
        UB.Collections.trackCollection = new UB.Collections.TrackCollection();
        // Hardcoded url to Transatlanticism album.
        UB.Collections.trackCollection.url = UB.albumTracksUrl;
        UB.Views.trackCollectionView = new UB.Views.TrackCollectionView({
            collection: UB.Collections.trackCollection
        });

        UB.Collections.trackCollection.fetch({
            success: function (coll) {
                console.log("Track collection fetched sucessfully.");
                $("#album-tracks-container").html(UB.Views.trackCollectionView.render().el);
            },
            error: function(coll) {
                console.log("Track collection cannot fetch data.");
            }
        });
    });

    // Inclusion of the navbar html.
    $("#navbar").load("menu.html");

});