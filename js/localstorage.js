var LocalStorage = function() {}

/**
 * LOCAL STORAGE MANAGEMENT CLASS
 * @param options - local(bool), content(object), backup(bool)
 * @param key
 * STORE CONTENT locally or in cookie or BOTH
 *
 * HOW TO USE:
    var app = new LocalStorage();
    app.runQuery('key') // Returns the content if existing, or false if it doesnt
    app.runQuery('key', {
        content: the content, can be a raw object, string or raw array // it is stringified by the function
        cookie: true/false // yes or no if you want to store only in localStorage
    })
    app.localStorage('key', false) // Delete the item from storage from both cookie and localstorage
 */
LocalStorage.prototype.runQuery = function(key, options) {
    if (options) {
        // store this data in local and in cookie too
        if (options.cookie) {
            if (jQuery && $.cookie) $.cookie(key, options.content);
            localStorage.setItem(key, JSON.stringify(options.content));

        }
        // also
        else {
            localStorage.setItem(key, JSON.stringify(options.content));
        }
    }
    // If a False boolean is provided as the option instead, remove all data related with the key
    else if(options ===  false) {
        localStorage.removeItem(key);
        if (jQuery && $.cookie) $.cookie(key, false); // remove everything
        console.log("------- DATA removed from LocalStorage -----------");
        return true;
    }

    // if only one argument is given retrieve that data from localstorage
    return arguments.length == 1 ? JSON.parse(localStorage.getItem(key)) : false;
}

LocalStorage.prototype.flush = function() {
    localStorage.clear();
    return true;
}
