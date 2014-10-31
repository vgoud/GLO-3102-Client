/**
 * Created by Vincent on 2014-10-15.
 * Source : https://coderwall.com/p/wkdefg
 */

window.UB.Utils.convertMsToTime = function(duration) {
    var milliseconds = parseInt((duration%1000)/100)
        , seconds = parseInt((duration/1000)%60)
        , minutes = parseInt((duration/(1000*60))%60)
        , hours = parseInt((duration/(1000*60*60))%24);

//    hours = (hours < 10) ? "0" + hours : hours;
//    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;

    // No formatting. Return a literal object that contains all the infos.
    return {
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        milliseconds: milliseconds
    };
};

window.UB.Utils.formatDate = function(date) {
    var d = new Date(date);
    // day, dd mmm yyyy, ...
    var pattern = /^\w+,\s(\d{2}\s\w{3}\s\d{4}).*/i;
    // Keep the group in parentheses.
    var dateExtracted = d.toUTCString().replace(pattern, "$1");
    // Trim the leading zero in any.
    var leadingZeroTrimmed = dateExtracted.replace(/^0(.*)/i, "$1");
    return leadingZeroTrimmed;
}