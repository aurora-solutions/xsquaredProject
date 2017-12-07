$(document).ready(function () {
    var register=false;
});


var options = {
    scope: 'public_profile,email'
};


function onFacebookLogin() {
    localStorage.removeItem('oauth');
    FB.login(function (response) {
        getFacebookUserInfo(true);
    }, options);
}

function onFacebookRegister() {
    FB.login(function (response) {
        getFacebookUserInfo(false);
    }, options);
}

function getFacebookUserInfo(userExists) {
    FB.api('/me?fields=id,email,name,picture', function (response) {
        console.log(response);
        // localStorage.setItem('facebookLoggedIn', true);
        if (userExists) {
            if (localStorage.getItem('oauth') != null && localStorage.getItem('oauth') != "") {
                userAuth();
            } else {
                loginWithFacebookPasswordEmail(response.email, response.id);
            }
        } else {
            console.log('register');
            registerUsingSocialId(response.email, response.id);
        }
    });
}

function logoutFB() {
    FB.logout();
}

function registerUsingSocialId(email, password) {
    $.ajax({
        url: 'https://stark-island-54204.herokuapp.com/cloud/api/beta/register.php',
        data: {
            email: email,
            pw: password
        },
        method: "POST",
        complete: function (transport) {
            console.log(transport.responseText);
            theResp = $.parseJSON(transport.responseText);
            if (theResp['status'] == 'success') {
                window.location = window.location.href;
            } else {
                alert("Sorry that email is already taken or invalid.");
                IN.User.logout();
            }
        }
    })
}

function loginWithFacebookPasswordEmail(email, password) {

    $.ajax({
        url: 'https://stark-island-54204.herokuapp.com/cloud/api/beta/login.php',
        data: {
            email: email,
            pw: password
        },
        method: "POST",
        complete: function (transport) {

            theResp = $.parseJSON(transport.responseText);
            if (theResp['status'] == 'success') {
                $('#userBalance').html("$" + numberWithCommas(parseFloat(theResp.mockbalance).toFixed(2)));
                localStorage.setItem('oauth', theResp.oauth);
                userAuth();
                $(".lity-close").click();
            } else {
                alert("Unable to authenticate with facebook. Please try again.");
            }
        }
    })
}

function loginWithLinkedinPasswordEmail(email, password) {

    $.ajax({
        url: 'https://stark-island-54204.herokuapp.com/cloud/api/beta/login.php',
        data: {
            email: email,
            pw: password
        },
        method: "POST",
        complete: function (transport) {

            theResp = $.parseJSON(transport.responseText);
            if (theResp['status'] == 'success') {
                $('#userBalance').html("$" + numberWithCommas(parseFloat(theResp.mockbalance).toFixed(2)));
                localStorage.setItem('oauth', theResp.oauth);
                userAuth();
                $(".lity-close").click();
            } else {
                alert("Unable to authenticate with Linkedin. Please make sure you are registered and try again.");
                IN.User.logout();
            }
        }
    })
}

function onLinkedInLoad() {
    IN.Event.on(IN, "auth", getLinkedInUserInfoForLogin);
}

function getLinkedInUserInfoForLogin() {

    IN.API.Profile("me").fields("id", "first-name", "last-name", "email-address").result(function(response){
        if(register==false) {
            loginWithLinkedinPasswordEmail(response.values[0].emailAddress, response.values[0].id);
        }
        else if(register==true)  {
            localStorage.removeItem('oauth');
            registerUsingSocialId(response.values[0].emailAddress, response.values[0].id);
        }
    }).error(function(error) {
        console.log(error);
    });

}

function onLinkedinLogin() {
    register=false;
    localStorage.removeItem('oauth');

    IN.User.authorize();
}

function onLinkedinRegister() {
    register=true;

    IN.User.authorize();
}