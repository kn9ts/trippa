// Init the class
var Facebook = function() {}

// Init Facebook login checkup
Facebook.prototype.initialise = function() {
    var self = this;
    // FB App check
    FB.getLoginStatus(function(response) {
        // Here we specify what we do with the response anytime this event occurs.
        if (response.status === 'connected') {
            // The response object is returned with a status field that lets the app know the current
            // login status of the person. In this case, we're handling the situation where they
            // have logged in to the app.
            var uid = response.authResponse.userID;
            var accessToken = response.authResponse.accessToken;
            var expires = response.authResponse.expiresIn; //UTC time

            //get user info, refresh it if it existed before
            self.getUserInfo("facebook-opengraph-api");
        } else if (response.status === 'not_authorized') {
            // In this case, the person is logged into Facebook, but not into the app, so we call
            // FB.login() to prompt them to do so.
            // In real-life usage, you wouldn't want to immediately prompt someone to login
            // like this, for two reasons:
            // (1) JavaScript created popup windows are blocked by most browsers unless they
            // result from direct interaction from people using the app (such as a mouse click)
            // (2) it is a bad experience to be continually prompted to login upon page load.
            console.log("The person is logged into Facebook, but not into the app.")
            self.checkIfUserExist(function(response) {
                if (response && response.isFacebook == "false") {
                    console.log("user exist without facebook auth...", response);
                    // self.localStorage('TrippaUser', false);
                } else {
                    self.checkIfUserExist();
                }
            }, false); //ask for info
        } else {
            // In this case, the person is not logged into Facebook, so we call the login()
            // function to prompt them to do so. Note that at this stage there is no indication
            // of whether they are logged into the app. If they aren't then they'll see the Login
            // dialog right after they log in to Facebook.
            // The same caveats as above apply to the FB.login() call here.
            console.log("The person is not logged into Facebook")
            self.checkIfUserExist(function(response) {
                if (response && response.isFacebook == "false") {
                    console.log("user exist without facebook auth...", response);
                    // self.localStorage('TrippaUser', false);
                } else {
                    self.checkIfUserExist();
                    // this.localStorage('TrippaUser', false);
                    console.log("user exist is not saved anywhere or anyhow!!!", response);
                }
            }, false); //ask for info
        }
    }, true);
}

Facebook.prototype.login = function(bool, cb) { //boolean, callback
    if (!cb) cb = function() {}; //assign an empty function if no callback is defined.

    // if undefined or true -- login in user to app
    if (bool || bool === undefined) {
        FB.login(cb, {
            scope: "basic_info, email, user_birthday, user_hometown, user_location"
        });
        //note: will acquire profil pic after loggin
    } else { //anything else
        FB.logout(function(response) {
            // Person is now logged out
            cb(response); //run callback, passing the FB response
            console.log("User logged out successfuly...");
            $('#fbpicture').attr('src', '../assets/10.jpg').parent().find('#fbusername').text('Storyteller');
            //reload page
            window.location.reload(false);
            // If we needed to pull the document from
            //  the web-server again (such as where the document contents
            //  change dynamically) we would pass the argument as 'true'.
        });
    }
}

Facebook.prototype.getUserInfo = function() {
    console.log('============ Welcome! Fetching your information... ============');
    FB.api('/me', function(response) {
        if (response && !response.error) {
            var r = response;
            /* handle the result */
            console.log('Good to see you, -- ' + r.first_name)
                // console.log(JSON.stringify(r));
            r.isFacebook = true; //from facebook;

            var userdata = {
                id: r.id,
                first_name: r.first_name,
                last_name: r.last_name,
                link: r.link,
                username: r.username,
                gender: r.gender,
                locale: r.locale,
                location: r.location.name,
                // age_range: r.age_range
                hometown: r.hometown.name,
                birthday: r.birthday,
                email: r.email,
                isFacebook: true
            }
            console.log(userdata);

            //store this data
            app.localStorage('TrippaUser', {
                content: userdata
                    // local: false
            });

            try {
                $('#fbusername').text(r.first_name);
                // $('#fbpicture').attr("src", r.picture.data.url);
                this.getProfilePic();
            } catch (error) {
                //do nothing
                console.log("error occured -- " + error);
            }
        } else {
            // something went wrong, get the error
            console.log(response.error);
        }
    });
}

Facebook.prototype.getProfilePic = function() {
    /* make the API call */
    FB.api(
        "/me/picture", {
            "redirect": false,
            "height": "200",
            "type": "normal",
            "width": "200"
        },
        function(response) {
            if (response && !response.error) {
                /* handle the result */
                console.log(JSON.stringify(response));
                // remove https to avoid any cert issues
                var profileImage = response.data.url.replace('https', 'http'),
                    randomNumber = Math.floor(Math.random() * 256);

                // remove if there and add image element to dom to show without refresh
                // add random number to reduce the frequency of cached images showing
                $('.profile-image').attr("src", profileImage + '?' + randomNumber);
            }
        }
    );
}
