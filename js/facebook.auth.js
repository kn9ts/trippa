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
                    // LS.runQuery('TrippaUser', false);
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
                    // LS.runQuery('TrippaUser', false);
                } else {
                    self.checkIfUserExist();
                    // LS.runQuery('TrippaUser', false);
                    console.log("user exist and is not saved anywhere or anyhow!!!", response);
                }
            }, false); //ask for info
        }
    }, true);

    return this;
}

Facebook.prototype.checkIfUserExist = function(cb, bool) {
    var self = this;
    var user = LS.runQuery('TrippaUser');
    console.log("does the user exit?? --- ", user);
    if (user) { // exists
        if (user.isFacebook !== "false") {
            // if bool is false, the function will run
            if (!bool) self.getUserInfo("facebook-opengraph-api");
            return true;
        } else {
            // do nothing, the data is safe where it is;
            // localstorage
        }
    } else {
        // user does not exist;
        // Ensure the FB button is working
        $('#facebookButton').click(function(event) {
            event.preventDefault();
            console.log("BUTTON CLICKED");

            // Try to prompt the user to login
            self.tryAction('login');
        }).css('color', function() {
            // dummy return
            return $(this).css("color");
        });
        return false;
    }

    // run the callback if it's a function
    if (cb && typeof cb == "function") cb(user); //u ndefined if no user
}

Facebook.prototype.tryAction = function(action) {
    var self = this;
    console.log(self.checkIfUserExist(), LS.runQuery('TrippaUser'))
    if (self.checkIfUserExist() && LS.runQuery('TrippaUser')) {
        try {
            self.logout(true, function() {
                console.log("======= Logged out the user ==========");
            });
        } catch (reasons) {
            self.tryAction('login');
        }
    }
    // has not logged in
    else {
        // initialise the login phase
        self.login(true, function(response) {
            // work with the response from FB
            if (response.authResponse) {
                // The person logged into your app
                console.log("=================== GET DATA =============")
                self.getUserInfo("facebook-opengraph-api"); // get his info -- opengraph api
                console.log("did not fail")
            } else {
                // The person cancelled the login dialog -- handle error
                // So maybe he doesnt want to use FB, so just hide FB auth and show normal form.
                self.checkIfUserExist([], true);
            }
        });
    }

    return this;
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
        // Remove all data from local storage
        var deleted = LS.runQuery('TrippaUser', false);
        if (deleted) {
            FB.logout(function(response) {
                // Person is now logged out
                cb(response); // run callback, passing the FB response
                console.log("User logged out successfuly...");
                $('.profile-pic').attr('src', 'http://lorempixel.com/g/200/200/cats').next().text('Are you a cat?!');
                $('#facebookButton').toggleClass('button-dull').text('Log in');
                // reload page
                window.location.reload(false);
                // If we needed to pull the document from
                // the web-server again (such as where the document contents
                // change dynamically) we would pass the argument as 'true'.
            });
        }
    }

    return this;
}

Facebook.prototype.logout = function(cb) {
    // Logout the user by passing a false boolean
    return this.login(false, (cb && typeof cb == "function") ? cb : function() {});
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
                // username: r.username,
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
            LS.runQuery('TrippaUser', {
                content: self.userdata
            });

            var event = new CustomEvent("FacebookLoginComplete", {
                detail: {
                    message: "Facebook login complete, passing user data",
                    userdata: self.userdata
                },
                bubbles: true,
                cancelable: true
            });

            // Now, we need to dispatch self event on a specific element
            document.querySelector('body').dispatchEvent(event);

            try {
                $('.profile-name').text(r.first_name + ' ' + r.last_name);
                // $('.profile-pic').attr("src", r.picture.LS.url);
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
                $('#facebookButton').toggleClass('button-dull').text('Log out');
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
