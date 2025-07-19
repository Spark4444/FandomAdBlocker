// Functions
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



// Chrome storage variables 
// Store ads blocked for each tab seprately and the total ads blocked
// adsBlockedTotal is a number, everything else is a key with and an array like this:
// [hostname, adsBlockedCount]
let adsBlocked = {
    adsBlockedTotal: 0
};

// Store cookies blocked on this website and websites paused as objects
let allowedList = {
    websitesPausedOn: [],
    cookiesBlockedOn: []
};

// Statistics for each element
let statistics = {};

// Website variables
const websiteHostName = window.location.hostname;

// Element class names to delete
// Add more ad elements as needed
const elementNames = [
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

let saveTimeout;


// Initialize each element's count to 0
elementNames.forEach(elementName => {
    statistics[elementName] = 0;
});

// Function to get a unique ID for each ad blocked
function getUniqueId() {
    return (Date.now() + Math.random()).toString(36);
}

// Unique ID for the current tab
const uniqueId = getUniqueId();

// Debounce function to save data to Chrome storage to prevent MAX_WRITE_OPERATIONS_PER_MINUTE quota error
function startSavingTimeout() {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
        getFromChromeStorage("adsBlocked", function(value) {
            const combinedAdsBlocked = {...adsBlocked, ...value};
            saveToChromeStorage("adsBlocked", combinedAdsBlocked);
        });
        getFromChromeStorage("statistics", function(value) {
            const combinedStatistics = {...statistics, ...value};
            saveToChromeStorage("statistics", combinedStatistics);
        });
    }, 200);
}

// Function to delete an element from the website
function deleteElements(...elementNames){
    elementNames.forEach(elementName => {
        // Check if the element exists before trying to remove it
        if(document.querySelector(elementName)){
            // Remove the element from the DOM
            document.querySelector(elementName).remove();

            // Update the statistics and adsBlocked count with the name of the element + 1
            statistics[elementName]++;

            // Increment the adsBlocked count for the current tab
            adsBlocked[uniqueId][1]++;

            // Update the total ads blocked count
            adsBlocked.adsBlockedTotal++;

            // Update the chrome storage data
            startSavingTimeout();
        }
    });
}

// Get the variable values from chrome storage
getFromChromeStorage("adsBlocked", function(value){
    adsBlocked = checkIfAValueIsSet(value, {
        adsBlockedTotal: 0
    });

    // Reset the adsBlocked count for the current tab if it is set or not set
    adsBlocked[uniqueId] = [websiteHostName, 0];
});

getFromChromeStorage("statistics", function(value){
    statistics = checkIfAValueIsSet(value, {});

    // Initialize each element's count to 0 if not already set
    elementNames.forEach(elementName => {
        if(statistics[elementName] === undefined) {
            statistics[elementName] = 0;
        }
    });
});

getFromChromeStorage("allowedList", function(value) {
    allowedList = checkIfAValueIsSet(value, {
        websitesPausedOn: [],
        cookiesBlockedOn: []
    });
});

// Send 
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getStatus") {
        sendResponse({
            status: "active",
            hostName: window.location.hostname,
            adsBlocked: adsBlocked[uniqueId][1],
            adsBlockedTotal: adsBlocked.adsBlockedTotal
        });
    }
});

// Function to remove ads and cookies from the website (if not paused and if cookies are blocked on this website)
function removeAdsCookies(){
    const { websitesPausedOn, cookiesBlockedOn } = allowedList;
    // Check if the website is paused and delete the ads
    if(!websitesPausedOn.includes(websiteHostName)){
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
setInterval(removeAdsCookies, 200);


// Update the page if one of the lists changes
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName === "sync") {
        if (changes.allowedList) {
            cleanUpAdsBlocked();
            setTimeout(() => {
                window.location.reload();
            }, 200);
        }
    }
});

// Function to clean up the adsBlocked object for the current tab
function cleanUpAdsBlocked() {
    getFromChromeStorage("adsBlocked", function(value) {
        delete value[uniqueId];
        saveToChromeStorage("adsBlocked", value);
    });
}


window.addEventListener("beforeunload", function() {
    // Clean up the adsBlocked object for the current tab before the page unloads
    cleanUpAdsBlocked();
});