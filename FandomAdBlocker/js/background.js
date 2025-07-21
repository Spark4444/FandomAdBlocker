// Background scripts work all the time, even if the extensions popup or the active scripts arent working. 
// It also has only 1 instance of it running at all times no matter how many tabs are open.

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

// Function to clear all data from Chrome storage
function clearChromeStorage() {
    chrome.storage.sync.clear();
}

// Checks if a chrome storage value is set with a specific type
function checkIfAValueIsSetWithType(value, defaultValue, type) {
    if (value === undefined || typeof value !== type) {
        return defaultValue;
    } 
    else {
        return value;
    }
}

// Set default values for all the chrome storage variables if they are not set
getFromChromeStorage("adsBlockedTotal", function(value) {
    // Don't perform type checking here as the value can be a number or string
    const totalAdsBlocked = value > -1 ? value : 0;
    saveToChromeStorage("adsBlockedTotal", totalAdsBlocked);
});

getFromChromeStorage("statistics", function(value) {
    const statistics = checkIfAValueIsSetWithType(value, {}, "object");
    if (value !== statistics) {
        saveToChromeStorage("statistics", statistics);
    }
});

getFromChromeStorage("allowedList", function(value) {
    const allowedList = checkIfAValueIsSetWithType(value, {
        websitesPausedOn: [],
        cookiesBlockedOn: []
    }, "object");
    if (value !== allowedList) {
        saveToChromeStorage("allowedList", allowedList);
    }
});

getFromChromeStorage("options", function(value) {
    const options = checkIfAValueIsSetWithType(value, {
        enableSelfPromotion: true
    }, "object");
    if (value !== options) {
        saveToChromeStorage("options", options);
    }
});

// Function to set the badge text
function setBadgeText(text) {
    chrome.action.setBadgeText({text: text});
}
  
// Function to set the badge background color
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

// Function to update the badge based on current tab status
function updateBadge() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {method: "getStatus"}, function(response) {
                if (chrome.runtime.lastError) {
                    removeBadge();
                    setExtensionIcon(false);
                }
                else if (response.status === "active") {
                    const { adsBlocked } = response;
                    setBadgeAds(adsBlocked, false);
                    setExtensionIcon(true);
                }
           });
        });
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

// Listen for when the chrome storage total ads blocked changes
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName === "sync") {
        if (changes.adsBlockedTotal) {
            updateBadge();
        }
    }
});