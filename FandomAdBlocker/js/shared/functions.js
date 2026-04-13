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

// Debugging functions for logging and clearing Chrome storage data
function clearChromeStorage() {
    chrome.storage.sync.clear();
}

function logSettingsData() {
    getFromChromeStorage("options", function(value) {
        console.log("Options:", value);
    });
}

function logStatisticsData() {
    getFromChromeStorage("statistics", function(value) {
        console.log("Statistics:", value);
    });
}

function logAllowedListData() {
    getFromChromeStorage("allowedList", function(value) {
        console.log("Allowed List:", value);
    });
}