/**
 * Created by Vincent on 2014-09-25.
 */

$(document).ready(function () {
    // Handlers of toggle-type play buttons in the table.
    $(".ub-button-play").click(function () {
        var $el = $(this);
        togglePlayVolumeIcons($el);
    });

    var animationPlayButtonClasses = "animated infinite pulse";

    function togglePlayVolumeIcons($el) {
        if ($el.hasClass("ub-active")) {
            $el.removeClass("ub-active " + animationPlayButtonClasses);
//            stopSong();
        }
        else {
            // We can only have one song playing at once.
            var $playingSongButton = $(".ub-button-play.ub-active");
            if ($playingSongButton) {
                $playingSongButton.removeClass("ub-active " + animationPlayButtonClasses);
            }
            // We remove the track number and replace it by an icon of volume.
            $el.addClass("ub-active " + animationPlayButtonClasses);
//            playSong();
        }
    }
    function playSong() {
        return;
    }
    function stopSong() {
        return;
    }
});