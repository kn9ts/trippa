// $(function() {
var collectTypingData = [];
var countdown = new Timer('#time');
var textArea = $('textarea');

textArea.keydown(function(ev) {
    var el = this;
    if (collectTypingData.length === 0 && !countdown.isActive) {
        countdown.startCountDown().then(function(cd) {
            // collect data
        });
    }
})

// do something
document.addEventListener('countdown', function(event) {
    if (event.detail.time <= 0) {
        clearInterval(countdown.countingDown)
        countdown.isActive = false;
        textArea.attr('disabled', true);
    }

    collectTypingData.push({
        value: textArea.val(),
        time: countdown.getValue()
    });
    // console.log(event.detail.time);
});
// })
