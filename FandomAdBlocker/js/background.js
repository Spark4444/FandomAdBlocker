// Background scripts work all the time, even if the extensions popup or the active scripts arent working. 
// It also has only 1 instance of it running at all times no matter how many tabs are open.

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

let currentTabId = null;

// Funtion set the badge text
function setBadgeText(text) {
    chrome.action.setBadgeText({text: text});
}
  
// Function set the badge background color
function setBadgeColor(color) {
    chrome.action.setBadgeBackgroundColor({color: color});
}

function setBadge(text, color) {
    setBadgeText(text);
    setBadgeColor(color);
}
  
// Function to remove the badge
function removeBadge() {
    setBadgeText("");
    setBadgeColor("#00ff00");
}

// Function to set the extension icon
function setExtensionIcon(active) {
    const iconPath = active ? "../img/128.png" : "../img/128BlackAndWhite.png";
    chrome.action.setIcon({ path: iconPath });
}
  
// Function to set the badge depending on the amount of ads blocked
function setBadgeAds(amount, paused = false) {
    if(paused) {
        setBadge("0", "#666666");
    }
    else {
        setBadge(amount.toString(), "#00ff00");
        if(amount > 2){
            setBadgeColor("#7fff00");
        }
        if(amount > 4){
            setBadgeColor("#ffff00");
        }
        if(amount > 6){
            setBadgeColor("#ff7f00");
        }
        if(amount > 8){
            setBadgeColor("#ff0000");
        }
    }
}

function updateBadge() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {method: "getStatus"}, function(response) {
                if (chrome.runtime.lastError) {
                    removeBadge();
                    setExtensionIcon(false);
                }
                else if (response.status === "active") {
                    const { adsBlocked, adsBlockedTotal } = response;
                    setBadgeAds(adsBlocked, false);
                    setExtensionIcon(true);
                }
           });
        });
}

// Function to set the extension icon
function setExtensionIcon(active) {
    const iconPath = active ? "../img/128.png" : "../img/128BlackAndWhite.png";
    chrome.action.setIcon({ path: iconPath });
}

// Listen for tab updates (changing URL or opening a new tab)
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo.status === "complete") {
        updateBadge();
    }
});

// Listen for tab activation (switching tabs)
chrome.tabs.onActivated.addListener(function(activeInfo) {
    updateBadge();
});

chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName === "sync") {
        if (changes.adsBlocked) {
            updateBadge();
        }
    }
});