/**
 * Created by Vincent on 2014-09-25.
 */

$(document).ready(function () {

//    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NDNiZmJhNWQ1MDEyZmQ0MGRjMzlhMGMiLCJleHAiOjE0MTM0OTEyMzY0NDR9.w2msrDhI90_pmGO-_DfugqZNOP0en7EqADFhmIfVtZA";

//    $.ajaxSetup({
//        headers: { "Authorization": token }
//    });

    UBeat.albumUrl = "http://localhost:3000/unsecure/albums/718938040/tracks";

    UBeat.Utils.templateLoader.load(["TrackView", "TrackCollectionView"], function () {

        // Will become a member of the router eventually.
        UBeat.Collections.trackCollection = new UBeat.Collections.TrackCollection();
        // Hardcoded url to Transatlanticism album.
        UBeat.Collections.trackCollection.url = UBeat.albumUrl;

        UBeat.Collections.trackCollection.fetch({
            success: function (coll) {
                console.log("Track collection fetched sucessfully.");
                UBeat.Views.trackCollectionView = new UBeat.Views.TrackCollectionView({
                    collection: UBeat.Collections.trackCollection
                });
                $("#album-content").html(UBeat.Views.trackCollectionView.render().el);
            },
            error: function(coll) {
                console.log("Track collection cannot fetch data.");
            }
        });
    });

    // Inclusion of the navbar html.
    $("#navbar").load("menu.html");

});