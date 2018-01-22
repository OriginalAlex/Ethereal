var betsizeElem, payoutElem, winChanceElem, winAmountElem, betsize, payout, over, under, socket; 
const edge = 0.01;

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

function connectWebSocket() {
    socket = new WebSocket("ws://localhost:31416");
    
    socket.onopen = function() {
        console.log("hi");
        socket.send("hi");
    }
}

function send() {
    socket.send("hi");
    socket.send("test");
}

function roundToTwoDp(num) {
    console.log(num);
    return Math.round(num*100) / 100;
}

function roundToSixDp(num) {
    return Math.round(num*1000000) / 1000000;
}

function openTab(evt, tabname, tabContentClassName, tabLinksClassName) {   
    var i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName(tabContentClassName);
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablinks = document.getElementsByClassName(tabLinksClassName);
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabname).style.display = "inline-block";
    evt.currentTarget.className += " active";
}

function multiplyProfit(num) {
    var val = payoutElem.value * parseFloat(num);
    if (val < 1.02) return;
    profit.value = val;
}

function update() {
    var theoreticalChance = (1/payout),
        chance = theoreticalChance * (1-edge),
        chancePercent = roundToTwoDp(chance*100);
    winChanceElem.value = chancePercent;
    winAmountElem.value = roundToSixDp(betsize*payout);
    under.innerHTML = chancePercent;
    over.innerHTML = roundToTwoDp(99.99-chancePercent);    
}

window.onload = function(e) {    
    betsizeElem = document.getElementById("betsize");
    payoutElem = document.getElementById("payout");
    winChanceElem = document.getElementById("winChance");
    winAmountElem = document.getElementById("winAmount");    
    over = document.getElementById("over");
    under = document.getElementById("under");
    
    betsizeElem.addEventListener("change", function(event) {
        betsize = betsizeElem.value;
        update();
    });
    
    payoutElem.addEventListener("change", function(event) {
        payout = payoutElem.value;
        update();
    });
    
    betsize = 0.0001;
    payout = 2;
}

function multiplyBet(num) {
    var val = betsize.value * parseFloat(num);
    if (val < 0.0001) return;
    betsize.value = val;
}

function setMaxOrMin(max) {
    if (max) betsize.value = 5;
    else betsize.value = 0.00001;
}

function fetchInformation() {
    var cookie = document.cookie;
    if (cookie != null && cookie != "null") { // they're signed in
        performHTTPRequest("GET", "http://localhost:81/api/users/fetchInformation", "", function(response) {
            if (response != "-1" && response != "-2") {
                var data = JSON.parse(response),
                    username = document.getElementById("username"),
                    balance = document.getElementById("balance");
                username.innerHTML = data.username;
                balance.innerHTML = data.balance;
                connectWebSocket();
            }
        });
    }
}
fetchInformation();