// Function to save data to Chrome storage
export function saveToChromeStorage(key, value) {
    chrome.storage.sync.set({[key]: value});
}

// Function to get data from Chrome storage
export function getFromChromeStorage(key, callback) {
    chrome.storage.sync.get([key], function(result) {
        callback(result[key]);
    });
}

// Checks if a chrome storage value is set
export function checkIfAValueIsSet(value, defaultValue){
    if(value == undefined){
        return defaultValue;
    }
    else{
        return value;
    }
}