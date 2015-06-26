var Trippa = function(data) {
    this.data = data || [];
    this.averageSpeed = 38;
    this.proficientSpeed = 50;
    this.proSpeed = 70;
    this.timeAllocated = 60;
    this.averageWordLength = 5;
}

Trippa.prototype = {
    calculateWPM: function(words_typed, Sentence) {

        // Split his sentence into an array
        var wordsTyped = words_typed.split(/\s/g);
        var givenSentence = Sentence;

        // Extract the equivalent words from given sentence to words typed by user
        var equivalentSentenceWords = givenSentence.split(/\s/g).splice(0, wordsTyped.length);

        // Now collect the correct words typed
        var correctWordsTyped = [];
        for (var x = 0; x < wordsTyped.length; x++) {
            // If the word typed matchs the given sentence's word position
            if (wordsTyped[x] == equivalentSentenceWords[x]) {
                correctWordsTyped.push(equivalentSentenceWords[x]);
            }
        }

        // Turn the correct words back to a sentence
        var correctWordsSentence = correctWordsTyped.join(' ');

        // WPM calculation
        // (((words_typed / 5) * 60) / time_taken)
        // time_taken == timeAllocated
        var WPM = ((correctWordsSentence.length / 5) * 60) / this.timeAllocated;
        return WPM;
    },
    calculateAccuracy: function(words_typed, Sentence) {
        var slicedSentence = Sentence.substr(0, words_typed.length);

        var count = 0;
        for (var x = 0; x < slicedSentence.length; x++) {
            if (slicedSentence[x] !== words_typed[x]) {
                console.log(slicedSentence[x], words_typed[x])
                count++;
            }
        }

        return Math.round(((slicedSentence.length - count) / slicedSentence.length) * 100) + '%';
    },
    calculateTypos: function(words_typed, Sentence) {
        var words = Sentence.sentence.split(/\s/g);
        words = words.slice(0, words_typed.split(/\s/g).length);

        // Turn it into an array
        // Replace all new lines and tabs with spaces
        words_typed = words_typed.replace(/(\n|\t)/, ' ').split(/\s/g);

        console.log(words_typed);
        console.log(words);

        var count = 0;
        for (var x = 0; x < words_typed.length; x++) {
            if (words.indexOf(words_typed[x]) == -1) {
                console.log(words[x]);
                // look for finished typose
                if (words_typed[x].length >= (words[x].length - (words_typed[x].length / 2))) {
                    count++;
                }
            }
        }

        return count;
    }
}
