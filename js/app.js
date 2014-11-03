/**
 * Created by Vincent on 2014-09-25.
 */

$(document).ready(function () {


//    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NDNiZmJhNWQ1MDEyZmQ0MGRjMzlhMGMiLCJleHAiOjE0MTM0OTEyMzY0NDR9.w2msrDhI90_pmGO-_DfugqZNOP0en7EqADFhmIfVtZA";

//    $.ajaxSetup({
//        headers: { "Authorization": token }
//    });

//    if (!pageName) {
//        return;
//    }

    UB.albumUrl = "http://localhost:3000/unsecure/albums/718938040/tracks";
    UB.artistAlbumUrlBefore = "http://localhost:3000/unsecure/albums/";
    UB.artistAlbumUrlAfter = "/tracks";
    UB.artistUrl = "http://localhost:3000/unsecure/artists/5448636";
    UB.artistAlbumsUrl = "http://localhost:3000/unsecure/artists/5448636/albums";

    UB.albumInfoUrl = "http://localhost:3000/unsecure/albums/718938040";
    UB.albumTracksUrl = "http://localhost:3000/unsecure/albums/718938040/tracks";

    UB.Utils.templateLoader.load([
        "TrackView",
        "TrackCollectionView",
        "AlbumInfoView",
        "RandomTrackCollectionView",
        "ArtistView",
        "AlbumsView",
        "HomeView",
        "PlayerView",
        "GlobalView",
        "HeaderView"

    ], function () {
            UB.Routers.router = new UB.Routers.Router();
            Backbone.history.start();
    });

    // Inclusion of the navbar html.
//    $("#navbar").load("menu.html");

});