let buttons = {
    cookiesButton: false,
    pauseButton: false
};

// Check if the popup is opened on a valid website
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {method: "getStatus"}, function(response) {
        if (chrome.runtime.lastError) {
            // Set the popup to nothing design
            nothingToBlock();
        }
        else {
            const { status, hostName, adsBlocked } = response;
            if (status === "active") {
                updateHostNameAndAdsBlocked(hostName, adsBlocked);
                initializeUI();

                // Event listener for chrome storage changes, update the total count and normal count
                chrome.storage.onChanged.addListener(function(changes, areaName) {
                    if (areaName === "sync") {
                        if (changes.statistics) {
                            count2.innerHTML = changes.statistics.newValue ? sumUpStatistics(changes.statistics.newValue) : "0";

                            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                                chrome.tabs.sendMessage(tabs[0].id, {method: "getStatus"}, function(response) {
                                    if (chrome.runtime.lastError) {
                                        count.innerHTML = "0";
                                    }
                                    else {
                                        count.innerHTML = response.adsBlocked;
                                    }
                                });
                            });
                        }
                    }
                
                });
            }
        }
    });
});

// Open settings page in new tab on click
settingsIcon.addEventListener("click", function() {
    chrome.tabs.create({ url: chrome.runtime.getURL("settings/index.html") });
});