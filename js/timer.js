var Timer = function(elem) {
    this.time = 60;
    this.timeAllocation = 60;
    this.elem = elem || document;

    if (this.elem !== document) {
        document.querySelector(this.elem).textContent = this.time;
    }
};

Timer.prototype = {
    startCountDown: function() {
        var self = this;
        console.log(self.time);
        this.countingDown = setInterval(function() {
            // check if the countdown has reached zero
            // if (self.isTimeOver()) {
            //     clearInterval(countDown);
            // }

            // If not keep subtracting
            self.time--;
            document.querySelector(self.elem).textContent = self.time;

            var event = new CustomEvent("countdown", {
                detail: {
                    message: "Counting down, subtracted one",
                    time: self.time,
                },
                bubbles: true,
                cancelable: true
            });

            // Now, we need to dispatch self event on a specific element
            document.querySelector(self.elem).dispatchEvent(event);
        }, 1000);
        // return countDown;
    },
    isTimeOver: function() {
        if (this.time === 0) {
            return 0;
        }

        return this.time;
    },
    resetTimer: function() {
        this.time = this.timeAllocation;
        return this;
    },
    getValue: function() {
        return this.time;
    }
}
