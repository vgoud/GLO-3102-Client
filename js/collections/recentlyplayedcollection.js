/**
 * Created by sgalarneau on 2014-12-04.
 */

window.UB.Collections.RecentlyPlayedCollection = Backbone.Collection.extend({

    localStorage: new Backbone.LocalStorage("RecentlyPlayedCollection"),
    model: UB.Models.LocalAlbumModel
});