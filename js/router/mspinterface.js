/**
 * Created by sgalarneau on 2014-11-17.
 */
var mspApiManager = {

    apiSettings: {
        consumerKey: '...',
        consumerSecret: '...',
        accessToken: 'someToken',
        accessTokenSecret: '...'
    },

    urlConfig: {
        requestTokenURL: 'http://api.music-story.com/oauth/request_token'
    },

    requestOAuth1Token: function(request, response){

        var self = this;

        $.ajax({
            url: this.urlConfig['requestTokenURL'],
            type: 'GET',
            contentType: 'application/json;charset=UTF-8',
            data: JSON.stringify({oauth_consumer_key: mspApiManager.apiSettings.consumerKey}),

            success:function (response){
                console.log(["Reponse details: " + response]);
            },

            error: function(response){
                console.log("Something wrong here:" + response);
            }

        });

    },

    encodeToken: function(){
        var encodedconsumerKey = encodeURIComponent(this.apiSettings['consumerKey']);

        var encodedconsumerSecret = encodeURIComponent(this.apiSettings['consumerSecret']);

        var bearertokencredentials = encodedconsumerKey + ':' + encodedconsumerSecret;

        var base64_encoded_bearer_token = btoa(bearertokencredentials);

        return base64_encoded_bearer_token;
    }

};


mspApiManager.requestOAuth1Token();
