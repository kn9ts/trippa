var Trippa = function(data) {
    this.data = data || [];
    this.averageSpeed = 35;
    this.timeAllocated = 60;
    this.averageWordLength = 5;
}

Trippa.prototype = {
    calculateWPM: function(words_typed, time_taken) {
        // WPM calculation
        // (((words_typed / 5) * 60) / time_taken)
        return ((words_typed.length / 5) * 60) / parseInt(time_taken);
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

        var count = 0;
        for (var x = 0; x < words_typed.length; x++) {
            if (words.indexOf(words_typed[x]) == -1) {
                console.log(words[x]);
                count++;
            }
        }

        return count;
    }
}
