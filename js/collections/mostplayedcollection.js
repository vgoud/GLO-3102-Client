/**
 * Created by sgalarneau on 2014-12-04.
 */

window.UB.Collections.MostPlayedAlbums = Backbone.Collection.extend({

    localStorage: new Backbone.LocalStorage("MostPlayedAlbums"),
    model: UB.Models.TrackModel

});