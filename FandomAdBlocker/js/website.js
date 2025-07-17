// Numbers
let adsBlocked = 0;
let adsBlockedTotal;

// Arrays
let cookiesBlockedOn;
let websitesPausedOn;

// Strings
let websiteHostName = window.location.hostname;

// Function to save data to Chrome storage
function saveToChromeStorage(key, value) {
    chrome.storage.sync.set({[key]: value});
}

// Function to get data from Chrome storage
function getFromChromeStorage(key, callback) {
    chrome.storage.sync.get([key], function(result) {
        callback(result[key]);
    });
}

// Checks if a chrome storage value is set
function checkIfAValueIsSet(value, defaultValue){
    if(value == undefined){
        return defaultValue;
    }
    else{
        return value;
    }
}

// Function to update the badge
function updateBadge(){
    chrome.runtime.sendMessage({method: "updateBadge"});
}

// Function to delete an element from the website
function deleteElements(...elementNames){
    elementNames.forEach(elementName => {
        if(document.querySelector(elementName)){
            document.querySelector(elementName).remove();
            adsBlocked++;
            updateBadge();
            adsBlockedTotal++;
            saveToChromeStorage("adsBlocked", adsBlocked);
            saveToChromeStorage("adsBlockedTotal", adsBlockedTotal);
        }
    });
}

// Get the varaible values from chrome storage
getFromChromeStorage("adsBlockedTotal", function(value){
    adsBlockedTotal = checkIfAValueIsSet(value, "0");
});

getFromChromeStorage("cookiesBlockedOn", function(value){
    cookiesBlockedOn = checkIfAValueIsSet(value, []);
});

getFromChromeStorage("websitesPausedOn", function(value){
    websitesPausedOn = checkIfAValueIsSet(value, []);
});

// Sends the status of the javascript
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getStatus") {
        sendResponse({
            status: "active",
            hostName: window.location.hostname,
            adsBlocked: adsBlocked,
            adsBlockedTotal: adsBlockedTotal,
            websitesPausedOn: websitesPausedOn,
            cookiesBlockedOn: cookiesBlockedOn
        });
    }


    if (request.action == "updatePage") {
        window.location.reload();
    }
});

// Function to remove ads and cookies from the website (if not paused and if cookies are blocked on this website)
function removeAdsCookies(){
    // Check if the website is paused and delete the ads
    if(!websitesPausedOn.includes(websiteHostName)){
        // Element class names to delete
        // Add more ad elements as needed
        let elementNames = [
            ".cnx",
            ".WikiaBarWrapper",
            ".bottom-ads-container",
            ".top-ads-container",
            ".top_boxad",
            ".ad-slot-placeholder",
            ".gpt-ad",
            ".featured-video-player-container",
            "#top_boxad",
            "#mid_boxad",
            "#incontent_boxad",
            ".incontent_leaderboard"
        ];
        deleteElements(...elementNames);
    }

    // Check if cookies are blocked on this website and delete them
    if(cookiesBlockedOn.includes(websiteHostName)){
        document.cookie.split(';').forEach(function(c) { 
            let name = c.split('=')[0];
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'; 
        });
    }
}

// Remove all the ads and cookies on the website
setTimeout(() => {
    removeAdsCookies();
}, 10);
setInterval(removeAdsCookies, 100);