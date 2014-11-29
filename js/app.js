/**
 * Created by Vincent on 2014-09-25.
 */

$(document).ready(function () {

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

//        UB.Routers.router.navigate("#", {trigger: true});
    });

});