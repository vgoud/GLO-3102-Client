/**
 * Created by Vincent on 2014-10-15.
 * Original source : https://github.com/ccoenraets/backbone-directory/blob/master/web/js/utils.js
 */

/**
 * Simple template loader.
 *
 * Template file MUST have the same name as the corresponding view file.
 *
 * @type {{load: load}}
 */
window.UB.Utils.templateLoader = {

    load: function(templates, callback) {
        var deferredTemplates = [];

        $.each(templates, function(index, tpl) {
            if (window.UB.Views[tpl]) {
                // Get the html from the template .html file.
                deferredTemplates.push($.get('tpl/' + tpl + '.html', function(data) {
                    // Compile template on successful load
                    // and add the template function to the view object.
                    window.UB.Views[tpl].prototype.template = _.template(data);
                }, 'html'));
            } else {
                console.log(tpl + " not found.");
            }
        });

        $.when.apply(null, deferredTemplates).done(callback);
    }

}