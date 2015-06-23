/**
 *
 * @Author - Eugene Mutai
 * @Twitter - JheneKnights
 * @Email - eugenemutai@gmail.com
 *
 * Date: 23/06/15
 * Time: 12:45 PM
 * Description: All your applications business logic should fall in here
 *
 * Copyright (C) 2014
 * @Version -
 */

// Set cookie defaults
if ($.cookie) $.cookie.defaults = {
    path: '/',
    expires: 432000 * 12,
    domain: location.href
};

var Application = function() {};

Application.prototype = {
    // Application Constructor
    initialize: function() {
        this.init();
    },
    // Bind Event Listeners
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    init: function() {
        var self = this;
        document.addEventListener("DOMContentLoaded", function() {
            self.deviceready()
        });
        // Do the following functions 1st
        $(function() {
            self.prepareFunctions();
        });
    },
    // deviceready Event Handler
    // The scope of 'this' is the event. In order to call the 'prepareFunctions'
    // function, we must explicity call 'this.prepareFunctions(...);'
    deviceready: function(app) {
        this.doFunctions('DOMContentLoaded_has_loaded');
    },
    prepareFunctions: function(param) {
        // prepare these functions to do something (event binding, initialise etc...)
        // leave following function as last to run the stuff in the function after app preparations
        // eg. check user sign up or something
        // document.querySelector('textarea').onkeypress = function checkKey(e) {
        //     e = e || event;
        //     var code = e.which || e.keyCode || e.charCode;
        //     console.log(code);
        //     var can_do = [8, 46].indexOf(code) > -1: true; false;
        //     return void(can_do);
        // }
        $('#typing-field').keypress(function(event) {
            var w_Code = window.event;
            if ([8, 46].indexOf(event.which) > -1) {
                console.log('backspace', event.which)
                event.preventDefault();
                return false;
            }
            else{
                console.log(event.which, w_Code.charCode)
            }
            return true;
        })
    },
    doFunctions: function(dom_loaded) {
        // do something (check if user is already signed in,
        // check for internet connection, resize app e.t.c)
        var test = new Sentences();
        var sentence = test.getSentence();
        console.log(sentence);

        // add each letter as a span with it's own id
        if (sentence && sentence.length > 0) {
            // get the words for typos issue
            var words = sentence.split(/\s/g);

            $('#guide-text').empty();

            // loop the words
            var count = 0;
            for (var i = 0; i < words.length; i++) {
                // create it's class
                var word = words[i];

                //now loop thru the word itsle
                for (var x = 0; x < word.length; x++) {
                    $('#guide-text').append('<span data-word="' + word + '" data-word-pos="' + x + '" id="pos-' + count + '">' + word[x] + "</span>");
                    count++;
                    // console.log(sentence[x]);
                }

                // add a space
                $('#guide-text').append('<span data-word="space" id="pos-' + count + '"> </span>');
                count++;
            }
        }
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
