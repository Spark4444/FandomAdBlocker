// Badge management functionality for the browser extension
// This file handles all badge-related operations including setting text, colors, and icons

// Function to set the badge text
function setBadgeText(text) {
    chrome.action.setBadgeText({text: text});
}
  
// Function to set the badge background color
function setBadgeColor(color) {
    chrome.action.setBadgeBackgroundColor({color: color});
}

// Function to set both badge text and color
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
    const iconPath = active ? "../../img/128.png" : "../../img/128BlackAndWhite.png";
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
        if (changes.statistics) {
            updateBadge();
        }
    }
});