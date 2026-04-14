// Background scripts work all the time, even if the extensions popup or the active scripts arent working. 
// It also has only 1 instance of it running at all times no matter how many tabs are open.
// Import the all the functions
importScripts("../shared/functions.js");

// Listen for extension installation/update
chrome.runtime.onInstalled.addListener(function(details) {
    if (details.reason === "install") {
        // Open welcome page on first install
        chrome.tabs.create({
            url: chrome.runtime.getURL("welcome/index.html")
        });
    } 
    else if (details.reason === "update") {
        // Open update page on extension update
        chrome.tabs.create({
            url: chrome.runtime.getURL("update/index.html")
        });
    }
});

// Checks if a chrome storage value is set with a specific type
function checkIfAValueIsSetWithType(value, defaultValue, type) {
    if (value === undefined || typeof value !== type) {
        return defaultValue;
    } 
    else {
        return value;
    }
}

importScripts("chromeStorage.js", "badge.js", "stack.js");