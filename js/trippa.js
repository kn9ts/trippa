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
    }
}
