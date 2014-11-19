/**
 * Created by Vincent on 2014-09-25.
 */

$(document).ready(function () {


//    var token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiI1NDNiZmJhNWQ1MDEyZmQ0MGRjMzlhMGMiLCJleHAiOjE0MTM0OTEyMzY0NDR9.w2msrDhI90_pmGO-_DfugqZNOP0en7EqADFhmIfVtZA";

//    $.ajaxSetup({
//        headers: { "Authorization": token }
//    });

    UB.albumUrl = "http://localhost:3000/unsecure/albums/718938040/tracks";
    UB.artistAlbumUrlBefore = "http://localhost:3000/unsecure/albums/";
    UB.artistAlbumUrlAfter = "/tracks";
    UB.artistUrl = "http://localhost:3000/unsecure/artists/5448636";
    UB.artistAlbumsUrl = "http://localhost:3000/unsecure/artists/5448636/albums";

    UB.albumInfoUrl = "http://localhost:3000/unsecure/albums/718938040";
    UB.albumTracksUrl = "http://localhost:3000/unsecure/albums/718938040/tracks";
    UB.PlaylistUrl = "http://localhost:3000/unsecure/playlists";

    // Load and compile all templates at once.
    UB.Utils.templateLoader.load([
        "TrackView",
        "TrackCollectionView",
        "AlbumInfoView",
        "RandomTrackCollectionView",
        "ArtistView",
        "AlbumsView",
        "HomeView",
        "PlayerView",
        "PlaylistView",
        "PlaylistCollectionView",
        "GlobalView",
        "HeaderCommonView",
        "CreatePlaylistView",
        "PlaylistTrackView",
        "RenamePlaylistView",
        "AddToPlaylistView",
        "HeaderStandardView",
        "HeaderTabletView",
        "HeaderMobileView",
        "SearchFieldView",
        "HomeButtonView",
        "LogoutButtonView",
        "ParametersButtonView",
        "LoginSignupView"
    ], function () {
        UB.Routers.router = new UB.Routers.Router();
        Backbone.history.start();
        UB.Routers.router.navigate("#home", {trigger: true});
    });

    // Prevent page from scrolling down when pressing spacebar.
    window.onkeydown = function (e) {
        return !(e.keyCode == 32);
    };
});