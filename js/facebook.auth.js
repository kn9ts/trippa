// Init the class
var Facebook = function() {
    this.userdata = {};
}

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

            // get user info, refresh it if it existed before
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

    return this;
}

Facebook.prototype.checkIfUserExist = function(cb, bool) {
    var self = this;
    var user = self.localStorage('TrippaUser');
    console.log("does the user exit?? --- ", user);
    if (user) { //exists
        if (user.isFacebook !== "false") {
            // if bool is false, the function will run
            if (!bool) self.getUserFacebookInfo("facebook-opengraph-api");
        } else {
            // do nothing, the data is safe where it is;
            // localstorage
        }
    } else {
        // user does not exist;
        // Ensure the FB button is working
        $('#facebookInit').click(function(event) {
            event.preventDefault();
            // initialise the login phase
            self.login(true, function(response) {
                // Hide the modal window
                $('a[href="#user-record"]').on('shown.bs.tab', function() {
                    console.log("questionaire has been hidden.")
                }).click(); // .tab('show');

                // work with the response from FB
                if (response.authResponse) {
                    // The person logged into your app
                    self.getUserFacebookInfo("facebook-opengraph-api"); // get his info -- opengraph api
                } else {
                    // The person cancelled the login dialog -- handle error
                    // So maybe he doesnt want to use FB, so just hide FB auth and show normal form.
                    self.checkIfUserExist([], true);
                }
            });
        }).css('color', function() {
            if (bool) { // If boolean is set, then hide the Facebook auth well
                $(this).hide();
                // Do some more stuff
            }
            // dummy return
            return $(this).css("color");
        });
    }

    // run the callback if it's a function
    if (cb && typeof cb == "function") cb(user); //u ndefined if no user
}

Facebook.prototype.login = function(bool, cb) { // boolean, callback
    if (!cb) cb = function() {}; // assign an empty function if no callback is defined.

    // if undefined or true -- login in user to app
    if (bool || bool === undefined) {
        FB.login(cb, {
            scope: "public_profile, basic_info, email, user_birthday, user_hometown, user_location"
        });
        // note: will acquire profil pic after loggin
    }
    // anything else
    else {
        FB.logout(function(response) {
            // Person is now logged out
            cb(response); // run callback, passing the FB response
            console.log("User logged out successfuly...");
            $('#fbpicture').attr('src', '../assets/10.jpg').parent().find('#fbusername').text('Storyteller');
            // reload page
            window.location.reload(false);
            // If we needed to pull the document from
            // the web-server again (such as where the document contents
            // change dynamically) we would pass the argument as 'true'.
        });
    }

    return this;
}

Facebook.prototype.getUserInfo = function() {
    var self = this;
    console.log('============ Welcome! Fetching your information... ============');
    FB.api('/me', function(response) {
        if (response && !response.error) {
            var r = response;
            /* handle the result */
            console.log('Good to see you, -- ' + r.first_name)
                // console.log(JSON.stringify(r));
            r.isFacebook = true; //from facebook;

            self.userdata = {
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
            console.log(self.userdata);

            //store this data
            app.localStorage('TrippaUser', {
                content: self.userdata
                    // local: false
            });

            try {
                $('#profile-name').text(r.first_name);
                // $('#fbpicture').attr("src", r.picture.data.url);
                self.getProfilePic();
            } catch (error) {
                //do nothing
                console.log("error occured -- " + error);
            }
        } else {
            // something went wrong, get the error
            console.log(response.error);
        }
    });

    return this;
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
                var profileImage = response.data.url.replace('https', 'http');
                var randomNumber = Math.floor(Math.random() * 256);

                console.log(profileImage);
                // remove if there and add image element to dom to show without refresh
                // add random number to reduce the frequency of cached images showing
                document.querySelector('.profile-pic').setAttribute('src', profileImage);
            }
        }
    );

    return this;
}

Facebook.prototype.then = function(cb) {
    if (cb && typeof cb == 'function') {
        cb(this);
    }

    return this;
}
