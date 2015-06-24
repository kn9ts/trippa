var Application = function() {};

Application.prototype = {
    Sentence: {},
    // Application Constructor
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    initialize: function() {
        var self = this;
        document.addEventListener("DOMContentLoaded", function() {
            self.deviceReady();
        });
        return this;
    },
    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'prepareFunctions'
    // function, we must explicity call 'this.prepareFunctions(...);'
    deviceReady: function(app) {
        // do something (check if user is already signed in,
        // check for internet connection, resize app e.t.c)
        var typing = new Sentences();
        this.Sentence.sentence = typing.getSentence();
        this.Sentence._meta = typing.getMetaData();

        typing.populateToDOM('#guide-text');
        return this;
    },
    getSentenceInstance: function() {
        return this.Sentence;
    }
};
