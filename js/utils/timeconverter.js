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