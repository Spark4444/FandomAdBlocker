// Chrome storage variables for ad blocking statistics
let adsBlocked = 0;

// Statistics for each element
let statistics = {};

// Save timeout for debouncing
let saveTimeout;

/** Initialize statistics for all possible elements (avoid duplicates) */
function initializeStatistics() {
    const allElementNames = new Set([
        ...elementNames,
        ...Object.values(optionsMap).flat()
    ]);

    // Initialize each element's count to 0
    allElementNames.forEach(elementName => {
        statistics[elementName] = 0;
    });
}

/** Function to reset local statistics after they've been sent to background */
function resetLocalStatistics() {
    Object.keys(statistics).forEach(key => {
        statistics[key] = 0;
    });
}

/** Debounce function to send statistics to background script to prevent MAX_WRITE_OPERATIONS_PER_MINUTE quota error */
function startSavingTimeout() {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
        
        // Only send message if there are new statistics to report
        if (Object.keys(statistics).some(key => statistics[key] > 0)) {
            const messageData = {
                method: "updateStatistics",
                statistics: { ...statistics }, // Send a copy of current statistics
            };
            
            // Send message to background script to update statistics
            chrome.runtime.sendMessage(messageData, function(response) {
                if (response && response.success) {
                    // Reset local counters after successful update
                    resetLocalStatistics();
                }
            });
        }
    }, 500);
}

/** Function to increment statistics for an element */
function incrementElementStatistics(elementName) {
    statistics[elementName]++;
    adsBlocked++;
}

// Initialize statistics
initializeStatistics();
