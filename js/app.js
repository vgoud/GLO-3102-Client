/**
 * Created by Vincent on 2014-09-25.
 */

$(document).ready(function () {

//    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NDNiZmJhNWQ1MDEyZmQ0MGRjMzlhMGMiLCJleHAiOjE0MTM0OTEyMzY0NDR9.w2msrDhI90_pmGO-_DfugqZNOP0en7EqADFhmIfVtZA";

//    $.ajaxSetup({
//        headers: { "Authorization": token }
//    });

    UB.albumUrl = "http://localhost:3000/unsecure/albums/718938040/tracks";

    UB.Utils.templateLoader.load(["TrackView", "TrackCollectionView"], function () {

        // Will become a member of the router eventually.
        UB.Collections.trackCollection = new UB.Collections.TrackCollection();
        // Hardcoded url to Transatlanticism album.
        UB.Collections.trackCollection.url = UB.albumUrl;

        UB.Collections.trackCollection.fetch({
            success: function (coll) {
                console.log("Track collection fetched sucessfully.");
                UB.Views.trackCollectionView = new UB.Views.TrackCollectionView({
                    collection: UB.Collections.trackCollection
                });
                $("#album-content").html(UB.Views.trackCollectionView.render().el);
            },
            error: function(coll) {
                console.log("Track collection cannot fetch data.");
            }
        });
    });

    // Inclusion of the navbar html.
    $("#navbar").load("menu.html");

});