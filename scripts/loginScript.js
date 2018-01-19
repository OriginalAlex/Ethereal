function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.send(null);
}

function performHTTPRequest(method, url, data, callback) {
    var shouldBeAsync = true;
    var request = new XMLHttpRequest();
    request.withCredentials = true;
    request.onload = function () {
        callback(request.responseText);
    }

    request.open(method, url, shouldBeAsync);

    request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    request.send(data);
}

document.onload = function() {
    if (document.cookie != null && document.cookie != "null") {
        var feedback = document.getElementById("feedback");
        feedback.innerHTML = "You are already signed in!";
        feedback.style.color = "red";
    }
}

function login() {
    var username = document.getElementById("username").value,
        password = document.getElementById("password").value;
    if (document.cookie != null && document.cookie != "null") {
        var feedback = document.getElementById("feedback");
        feedback.innerHTML = "You are already signed in!";
        feedback.style.color = "red";
        //return;
    }
    
    performHTTPRequest("POST", "http://localhost:81/api/users/signin", '{"username":"' + username + '", "password":"' + password + '"}', function(response) {
        var feedback = document.getElementById("feedback");
        console.log(response);
        if (response == 0) { // invalid incredentials
            feedback.innerHTML = "The username or password was incorrect";
            feedback.style.color = "red";
        } else {
            feedback.innerHTML = "Signed in successfully!";
            feedback.style.color = "green";
            document.cookie = response;
        }
    });
}

function logout() {
    var feedback = document.getElementById("feedback");
    if (document.cookie == null || document.cookie == "null") {
        feedback.innerHTML = "You are not logged in!";
        feedback.style.color = "red";
        return;
    }
    document.cookie = null;
    feedback.innerHTML = "Successfully logged out";
    feedback.style.color = "red";
}