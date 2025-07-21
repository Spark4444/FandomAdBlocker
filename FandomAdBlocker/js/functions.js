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

// Function to clear all data from Chrome storage
function clearChromeStorage() {
    chrome.storage.sync.clear();
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

// Function to log all the Chrome storage data
function logChromeStorage() {
    chrome.storage.sync.get(null, function(items) {
        console.log("Chrome storage data:", items);
    });
}