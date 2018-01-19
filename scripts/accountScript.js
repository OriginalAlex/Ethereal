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

function register() {
    var username = document.getElementById("username").value,
        password = document.getElementById("password").value;
    if (username == null || username.length <= 3) {
        feedback.innerHTML = "Your username must be longer than 3 characters!";
        feedback.style.color = "red";
        return;
    } else if (password == null || password.length <= 3) {
        feedback.innerHTML = "Your password must be longer than 3 characters!";
        feedback.style.color = "red";
        return;
    }
    performHTTPRequest("POST", "http://localhost:81/api/users/createaccount", '{"username":"' + username + '", "password"="' + password + '"}', function(response) {
        console.log(response);   
    });
}

function wipedb() {
    performHTTPRequest("POST", "http://localhost:81/api/database/wipedb", "", function() {
        console.log("wiped");
    }); 
}