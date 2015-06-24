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
var Sentence = app.initialize();
console.log(Sentence)

$(function() {
    var collectTypingData = [];
    var countdown = new Timer('#time', 10);
    var textArea = $('textarea');
    var wpm = $('#wpm');
    var typos = $('#typos');
    var accuracy = $('#accuracy');

    textArea.keydown(function(ev) {
        var el = this;
        if (collectTypingData.length === 0 && !countdown.isActive) {
            console.log("========== STARTED ===========", el.which)
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
            var WPM = trippa.calculateWPM(words_typed, 60);
            console.log(WPM);
            wpm.html(WPM);
        }

        collectTypingData.push({
            value: textArea.val(),
            time: countdown.getValue()
        });
        // console.log(event.detail.time);

    });
})
