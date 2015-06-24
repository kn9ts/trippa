var Application = function() {};

Application.prototype = {
    Sentence: null,
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
        var test = new Sentences();
        var sentence = test.getSentence();
        // console.log(sentence);
        this.Sentence = sentence.getMetaData().populateToDOM('#guide-text');
        return this.Sentence;
    },
    /**
     * LOCAL STORAGE MANAGEMENT FUNCTION
     * @param options - local(bool), content(object), backup(bool)
     * @param key
     * STORE CONTENT locally or in cookie or BOTH
     *
     * HOW TO USE:
         app.localStorage('key') //Returns the content if existing, or false if it doesnt
         app.localStorage('key', {
            content: the content, can be a raw object, string or raw array //it is stringified by the function
            local: true/false //yes or no if you want to store only in localStorage
         })
     */
    localStorage: function(key, options) {
        if (options) { //store this data
            if (!options.local) {
                localStorage.setItem(key, JSON.stringify(options.content));
            } else { //also in cookie too
                if ($.cookie) $.cookie(key, options.content);
                localStorage.setItem(key, JSON.stringify(options.content));
            }
        } else if (options === false) { //if options == false
            localStorage.removeItem(key);
            if ($.cookie) $.cookie(key, false); //remove everything
        }

        //if only one argument is given retrieve that data from localstorage
        return arguments.length == 1 ? JSON.parse(localStorage.getItem(key)) : false;
    }
};
