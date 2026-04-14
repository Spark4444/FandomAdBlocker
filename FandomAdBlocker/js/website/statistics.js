// Chrome storage variables for ad blocking statistics
let adsBlocked = 0;
let totalAdsBlockedBefore = 0;

// Statistics for each element
let statistics = {};

// Save timeout for debouncing
let saveTimeout;

// Initialize statistics for all possible elements (avoid duplicates)
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

// Function to merge two objects by adding the values of the same keys 
function mergeObjects(obj1, obj2) {
    const merged = {...obj1};
    for (const key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            merged[key] = (merged[key] || 0) + (obj2[key] || 0);
        }
    }
    return merged;
}

// Debounce function to save data to Chrome storage to prevent MAX_WRITE_OPERATIONS_PER_MINUTE quota error
function startSavingTimeout() {
    if (saveTimeout) {
        clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
        getFromChromeStorage("adsBlockedTotal", function(value) {
            // When updating the total ads blocked, we need to ensure that the value doesn't get doubled.
            // So we subtract the previous total ads blocked before adding the new value to ensure it is accurate.
            const newAdsBlocked = adsBlocked - totalAdsBlockedBefore;
            saveToChromeStorage("adsBlockedTotal", newAdsBlocked + (value || 0));
            totalAdsBlockedBefore = adsBlocked; // Update the previous total ads blocked
        });
        getFromChromeStorage("statistics", function(value) {
            saveToChromeStorage("statistics", mergeObjects(value, statistics));
        });
    }, 1000);
}

// Function to increment statistics for an element
function incrementElementStatistics(elementName) {
    statistics[elementName]++;
    adsBlocked++;
}

// Initialize statistics
initializeStatistics();
