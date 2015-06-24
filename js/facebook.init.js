var Fb;
var LS = new LocalStorage();
// The function assigned to window.fbAsyncInit is run as soon as the SDK has completed loading.
// Any code that you want to run after the SDK is loaded should be placed within this function and after the call to FB.init.
// Any kind of JavaScript can be used here, but any SDK functions must be called after FB.init.
window.fbAsyncInit = function() {
    // Setting status & xfbml to false can improve page load times,
    // but you'll need to manually check for login status using FB.getLoginStatus.
    // https://developers.facebook.com/apps/
    var APP_ID = {
            "local": '213258518873900',
            "remote": '846451778767759'
        } //local - for testing, remote - Trippa

    //init FB auth
    FB.init({
        appId: APP_ID["local"],
        status: false, // check login status on SDK load
        cookie: true, // enable cookies to allow the server to access the session
        xfbml: false // parse XFBML
    });

    // check if user is initialised
    Fb = new Facebook();
    Fb.initialise().then(function(fb) {

        var ud = fb.userdata;
        LS.runQuery('TrippaUserData', ud);
        console.log(Fb.userdata);

    });

    $('#facebookButton').click(function(event) {
        event.preventDefault();
        console.log("BUTTON CLICKED");
        // Try to prompt the user to login
        Fb.tryAction('login');

        // If user exists, this is a logout request
        if (LS.runQuery('TrippaUser')) {
            LS.runQuery('TrippaUser', false);
        }
    }).css('color', function() {
        // dummy return
        return $(this).css("color");
    });

}

// -------- FIREBASE --------
// Update or create the user's data
document.addEventListener('FacebookLoginComplete', function(data) {
    var ud = data.detail.userdata;
    // Check if the user exists
    var userExists = Users.child(ud.id)
    if (userExists) {
        userExists.update(ud)
    }
    // If he/she doesnt exist
    else {
        // Save this data to firebase
        Users.child(ud.id).set(ud);
    }
})
