$.support.cors = true;

// Set cookie defaults
if (jQuery && $.cookie) {
    $.cookie.defaults = {
        path: '/',
        expires: 432000 * 12,
        domain: location.href
    };
}

//on document ready, as soon as it begins to load
var app = new Application();
var appInstance = app.initialize();
var myFirebase = new Firebase("https://trippa.firebaseio.com/");
var Users = myFirebase.child("users");
var Leaderboard = myFirebase.child("leaderboard");
var DATA = {};

$(function() {
    var collectTypingData = [];
    var countdown = new Timer('#time', 6);
    var textArea = $('textarea');
    var wpm = $('#wpm');
    var typos = $('#typos');
    var accuracy = $('#accuracy');
    var reset_time = $('#reset-time');

    textArea.keydown(function(ev) {
        var el = this;
        if (collectTypingData.length === 0 && !countdown.isActive) {
            console.log("========== STARTED ===========", ev.which);
            reset_time.toggleClass('button-error');
            countdown.startCountDown();
        }
    })

    // do something
    document.addEventListener('countdown', function(event) {
        if (event.detail.time <= 0) {
            clearInterval(countdown.countingDown);
            countdown.isActive = false;
            textArea.attr('disabled', true);

            var words_typed = textArea.val();
            var trippa = new Trippa();

            // Calculate WPM
            var WPM = trippa.calculateWPM(words_typed, 60);
            console.log(WPM);
            wpm.html(WPM);

            var Sentence = appInstance.getSentenceInstance();
            console.log(Sentence);

            // Calculate Accuracy
            var Accuracy = trippa.calculateAccuracy(words_typed, Sentence.sentence);
            console.log(Accuracy);
            accuracy.html(Accuracy);

            var Typos = trippa.calculateTypos(words_typed, Sentence);
            console.log(Typos);
            typos.html(Typos);

            // Collect this data, to be stored in Firebase
            DATA.accuracy = parseInt(Accuracy);
            DATA.WPM = WPM;
            DATA.typos = Typos;
        }

        collectTypingData.push({
            value: textArea.val(),
            time: countdown.getValue()
        });
        // console.log(event.detail.time);
    });

    reset_time.on('click', function(ev) {
        // Reset results back to zero
        $('.showing').text(0);

        // clear the text area
        textArea.val('');

        // stop the count down time
        clearInterval(countdown.countingDown);

        // reset the timer
        countdown.resetTimer();

        // dim the button and re-enable the textarea if it was disabled
        $(this).toggleClass('button-error');
        textArea.attr('disabled', false);

        // Empty the data that was being collected
        collectTypingData = [];
    });

})
