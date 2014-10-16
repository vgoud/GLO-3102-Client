/**
 * Created by Vincent on 2014-10-15.
 * Original source : https://github.com/ccoenraets/backbone-directory/blob/master/web/js/utils.js
 */

/**
 * Simple template loader.
 * @type {{load: load}}
 */
window.UBeat.Utils.templateLoader = {

    load: function(templates, callback) {
        var deferredTemplates = [];

        $.each(templates, function(index, tpl) {
            if (window.UBeat.Views[tpl]) {
                // Get the html from the template .html file.
                deferredTemplates.push($.get('tpl/' + tpl + '.html', function(data) {
                    // Compile template on successful load
                    // and add the template function to the view object.
                    window.UBeat.Views[tpl].prototype.template = _.template(data);
                }, 'html'));
            } else {
                console.log(tpl + " not found.");
            }
        });

        $.when.apply(null, deferredTemplates).done(callback);
    }

}