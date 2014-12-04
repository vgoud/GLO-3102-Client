/**
 * Created by Sebastien on 11/29/2014.
 */

var key = '133b4c7f0ff32e661ffff807bd128553d8a9b02d';
var secret = '7f2e908305a809a8c036b12e12e8b64975872bb5';
var api = new MusicStoryApi(key, secret);

window.UB.mspHelpers.getMSPArtistPicture = function(artist) {

    //Search for the artist ID in the database
    api.search('artist', {type: 'Band', name: artist.get('artistName')}, function (list) {
        if (list.data.length > 0) {

            //Gets the picture of the artist
            list.current().getConnector('pictures', null, null, null, function (pics) {
                var artistImageURL = pics.data[0].url_400;
                $('#artist-image').append("<img id='artist-img-url' src='" + artistImageURL + "' />");
            });

        } else {
            // Temporary
            console.log("artist PICTURE not found in API!!");
        }
    });
}

window.UB.mspHelpers.getMSPArtistInfos = function(artist) {

    //Search for the artist ID in the database
    api.search('artist', {type: 'Band', name: artist.get('artistName')}, function (list) {
        if (list.data.length > 0) {

            //Gets the artist's biography
            list.current().getConnector('biographies', null, null, null, function (bio) {
                var artistBio = bio.data[0];
                $('#artist-bio-header').append(artistBio.header);
                $('#artist-bio').append(artistBio.content);
            });

        } else {
            // Temporary
            console.log("artist BIO not found in API!!");
        }
    });
}

window.UB.mspHelpers.getMSPChart = function() {

    //Search for the artist ID in the database
    api.search('Chart', null, function (chart) {
        while (chart.hasNext()) {
            $('#news').append(chart.current());
        }
    });
}
