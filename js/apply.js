$.support.cors = true;

// Set cookie defaults
if (jQuery && $.cookie) {
    $.cookie.defaults = {
        path: '/',
        expires: 432000 * 12,
        domain: location.href
    };
}

// on document ready, as soon as it begins to load
var app = new Application();
var appInstance = app.initialize();
var DATA = {};

var myFirebase = new Firebase("https://trippa.firebaseio.com/");
var Users = myFirebase.child("users"),
    userExists,
    user,
    scoreCard;
var Leaderboard = myFirebase.child("leaderboard");

// get all the scores, order then and display in the leaderboard card
Leaderboard.orderByValue().on('value', function(snapshot) {
    console.log("all leaderboard data", snapshot.val());
    $('.leaderboard tbody.leaderboard-results').empty();
    var scores = snapshot.val();

    var scores_array = _.toArray(scores);

    var trippa = new Trippa();
    // Calculates the average of the two: WPM & accuracy
    scores_array = _.map(scores_array, function(score) {
        var Average = ((score.WPM * 100) / trippa.proSpeed + score.accuracy) / 2;
        score.average = Average;
        return score;
    });

    scores_array = _.sortBy(scores_array, 'average').reverse();
    // scores_array = scores_array.sort(function(a, b) {
    //     return b.WPM - a.WPM && b.accuracy - a.accuracy;
    // })
    console.log(scores_array);

    var count = 1;
    _.map(scores_array, function(score, x) {
        var td = '<tr><td>' + (count++) + '</td><td>' + score.name + '</td><td>' + score.WPM + '</td><td>' + score.accuracy + '</td><td>' + score.typos + '</td></tr>';
        $('.leaderboard tbody.leaderboard-results').append(td)
    });

})

// -------- FIREBASE --------
// Update or create the user's data on Facebook login
document.addEventListener('FacebookLoginComplete', function(data) {
    var user_crendential = data.detail.userdata;

    // Re-enable the text area
    $('textarea').attr('disabled', false);

    // Check if the user exists
    // https://trippa.firebaseio.com/users/1013945085302869
    userExists = Users.child(user_crendential.id); // Users.child('12621726721')
    if (userExists) {
        userExists.update(user_crendential)
        Users.child(user_crendential.id).on('value', function(snapshot) {
            console.log("======= Firebase User DATA: ========", snapshot.val());
            user = snapshot.val();

            var userLeaderboardURL = "https://trippa.firebaseio.com/leaderboard/" + user.scoreId;
            scoreCard = new Firebase(userLeaderboardURL);
            scoreCard.on('value', function(snapshot) {
                // Use this data
            })
        });
    }
    // If he/she doesnt exist
    else {
        // Save this data to firebase
        Users.child(user_crendential.id).set(user_crendential);
    }
});

$(function() {
    var collectTypingData = [];
    var countdown = new Timer('#time', 60);
    var textArea = $('textarea');
    var wpm = $('#wpm');
    var typos = $('#typos');
    var accuracy = $('#accuracy');
    var reset_time = $('#reset-time');

    // Enabled on app start
    textArea.attr('disabled', false);

    // Check the trace of user existing, if he/she logged in
    var isLoggedIn = LS.runQuery('TrippaUser');
    if (isLoggedIn) {
        // If they had Disable the text area till the Facebook data has been pulled
        textArea.attr('disabled', true);
    }

    // slide in the comments side-bar
    $('.open-leaderboard').click(function(ev) {
        ev.preventDefault();

        $('.leaderboard').removeClass('bounceOutRight').addClass('bounceInRight');
        $('.overlay').css('display', 'block');
    })

    // Add event of it's closure
    $('.overlay, .leaderboard button.close').on('click', function(ev) {
        $('.leaderboard').removeClass('bounceInRight').addClass('bounceOutRight');
        $('.overlay').css('display', 'none');
    });

    textArea.keyup(function(ev) {
        var el = this;
        if (collectTypingData.length === 0 && !countdown.isActive) {
            console.log("========== STARTED ===========", ev.which);
            reset_time.toggleClass('button-error');
            countdown.startCountDown();
        }

        // get what he has typed
        var typed = $(el).val();
        var words_typed = typed.split(/\s/g);
        var given = appInstance.getSentenceInstance();
        // console.log(given._meta);

        var Sentence = given.sentence;
        var words = Sentence.split(/\s/g).splice(0, words_typed.length);
        // console.log(words);

        // Loop thru the words of the sentence given
        for (var x = 0; x < words.length; x++) {
            var word = words[x],
                wt = words_typed[x];

            var word_data = _.where(given._meta, {word_position: x});
            // console.log(word_data);

            for(var i in word_data) {
                var val = word_data[i];
                if(val.letter != wt[val.letter_position]) {
                    $('span#' + val.dom_position).removeClass('green').addClass('red');
                } else {
                    $('span#' + val.dom_position).removeClass('red').addClass('green');
                }
                // console.log(val)
            }

            // loop thru the letters of the word itself
            // for (var i = 0; i < word.length; i++) {
            //     // If the letter's do no not match what the user has typed
            //     console.log(word[i], wt[i], word[i] != wt[i]);
            //     if (word[i] != wt[i]) {
            //         $('span#position-' + i).removeClass('green').addClass('red');
            //     } else {
            //         $('span#position-' + i).removeClass('red').addClass('green');
            //     }
            // }
        }

    });

    // Disabled copy/paste
    textArea.on('copy paste', function(e) {
        e.preventDefault();
    });

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

            // Just push data for testing
            // Leaderboard.push(DATA);

            // check to see if the user is logged in
            if (userExists) {
                // check to see if the user already has a score card saved
                if (user.scoreId) {
                    // if yes, fetch & update it
                    // Check to see if the scoreCard instance has been created
                    if (!scoreCard) {
                        var userLeaderboardURL = "https://trippa.firebaseio.com/leaderboard/" + user.scoreId;
                        console.log("=========== Score Card URL: ===========", userLeaderboardURL);
                        scoreCard = new Firebase(userLeaderboardURL);
                    }
                    scoreCard.update(DATA);
                }
                // if he does not
                else {
                    // Add refence no to it
                    DATA.id = user.id;
                    DATA.name = [user.first_name, user.last_name].join(' ');
                    DATA.gender = user.gender;
                    // DATA.location = user.location;

                    var scoreId = Leaderboard.push(DATA, function(no_data_returned) {
                        console.log("=============== Firebase Post Callback ==============", scoreId.key())
                            // When the scoreId is created
                        if (scoreId.key()) {
                            // Give it back to the user
                            Users.child(user.id).update({
                                scoreId: scoreId.key()
                            })
                        }
                    });
                }
            }
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
