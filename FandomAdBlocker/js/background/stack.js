// Stack to accumulate statistics updates before saving to chrome storage
let statisticsStack = {};
let totalAdsBlockedStack = 0;

// Timeout for debounced saving
let stackSaveTimeout = null;

// Function to merge statistics objects by adding values for the same keys
function mergeStatistics(target, source) {
    for (const key in source) {
        if (source.hasOwnProperty(key)) {
            target[key] = (target[key] || 0) + (source[key] || 0);
        }
    }
}

// Function to process the accumulated stack and update chrome storage
function processStackAndSave() {
    // Only proceed if there's data to save
    // Update total ads blocked
    if (totalAdsBlockedStack > 0) {
        getFromChromeStorage("adsBlockedTotal", function(currentTotal) {
            console.log(currentTotal, totalAdsBlockedStack);
            const newTotal = (currentTotal || 0) + totalAdsBlockedStack;
            saveToChromeStorage("adsBlockedTotal", newTotal);
            totalAdsBlockedStack = 0;
        });
    }

    // Update statistics
    if (Object.keys(statisticsStack).length > 0) {
        getFromChromeStorage("statistics", function(currentStats) {
            const updatedStats = currentStats || {};
            mergeStatistics(updatedStats, statisticsStack);
            saveToChromeStorage("statistics", updatedStats);
            statisticsStack = {};
        });
    }
}

// Function to add statistics update to the stack
function addToStack(statistics, adsBlocked) {
    // Add statistics to the stack
    if (statistics && typeof statistics === "object") {
        mergeStatistics(statisticsStack, statistics);
    }

    // Add ads blocked count to the stack
    if (adsBlocked && typeof adsBlocked === "number" && adsBlocked > 0) {
        totalAdsBlockedStack += adsBlocked;
    }

    // Start or restart the debounced save
    startStackSaveTimeout();
}

// Function to start the debounced save timeout
function startStackSaveTimeout() {
    // Clear existing timeout if it exists
    if (stackSaveTimeout) {
        clearTimeout(stackSaveTimeout);
    }

    // Set new timeout for debounced save
    stackSaveTimeout = setTimeout(() => {
        processStackAndSave();
        stackSaveTimeout = null;
    }, 2000);
}

// Message listener for statistics updates from content scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method === "updateStatistics") {
        try {
            // Add the update to the stack
            addToStack(request.statistics, request.adsBlocked);
            
            // Send success response back to content script
            sendResponse({ success: true });
        } catch (error) {
            sendResponse({ success: false, error: error.message });
        }
        
        // Return true to indicate we will send a response asynchronously
        return true;
    }
});

// Function to force immediate save (can be called when extension is closing)
function forceStackSave() {
    if (stackSaveTimeout) {
        clearTimeout(stackSaveTimeout);
        stackSaveTimeout = null;
    }
    processStackAndSave();
}

// Listen for extension suspension/unload to save any pending data
chrome.runtime.onSuspend.addListener(function() {
    forceStackSave();
});