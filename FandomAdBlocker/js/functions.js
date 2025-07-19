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

// Helper function to log all contents of Chrome storage
function logChromeStorage() {
    chrome.storage.sync.get(null, function(items) {
        console.log("Chrome Storage Contents:");
        for (let key in items) {
            console.log(`${key}:`);
            console.log(items[key]);
        }
    });
}

function clearChromeStorage() {
    chrome.storage.sync.clear(function() {
        console.log("Chrome storage cleared.");
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