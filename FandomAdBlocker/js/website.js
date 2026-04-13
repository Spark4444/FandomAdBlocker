// Chrome storage variables 
let adsBlocked = 0;
let totalAdsBlockedBefore = 0;

// Store cookies blocked on this website and websites paused as objects
let allowedList = {
    websitesPausedOn: [],
    cookiesBlockedOn: []
};

// Statistics for each element
let statistics = {};

// Get the hostname of the current website and remove "www." if it exists
const websiteHostName = window.location.hostname.replace(/^www\./, "");

// Element class names to delete.
// Add more ad elements as needed
let elementNames = [
    ".top_leaderboard-odyssey-wrapper",
    "#incontent_player_container",
    ".fandom-ad-wrapper",
    ".bottom-ads-container",
    "#floor_adhesion_wrapper",
    "#rail-boxad-wrapper",
    "#mid_boxad",
    ".sticky-modules-wrapper",
    // Mobile Version Ads
    "#top_boxad"
];

let saveTimeout;


// Initialize each element's count to 0
elementNames.forEach(elementName => {
    statistics[elementName] = 0;
});

Object.entries(optionsMap).forEach(([option, elementNames]) => {
    elementNames.forEach(elementName => {
        statistics[elementName] = 0;
    });
});

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
    }, 200);
}

// Function to delete an element from the website
function deleteElements(...elementNames){
    elementNames.forEach(elementName => {
        // Check if the element exists before trying to remove it
        if(document.querySelector(elementName)){
            // Remove the element from the DOM
            document.querySelector(elementName).remove();

            // Update the statistics and adsBlocked count with the name of the element + 1
            statistics[elementName]++;

            // Update the total ads blocked count
            adsBlocked++;

            // Update the chrome storage data
            startSavingTimeout();
        }
    });
}

// Send the status of the extension to the popup and background scripts
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getStatus") {
        sendResponse({
                status: "active",
                hostName: websiteHostName,
                adsBlocked: adsBlocked
        });
    }
});

// Get the value for the allowedList from Chrome storage
getFromChromeStorage("allowedList", function(value) {
    allowedList = checkIfAValueIsSet(value, {
        websitesPausedOn: [],
        cookiesBlockedOn: []
    });
    saveToChromeStorage("allowedList", allowedList);
});

// Function to remove ads and cookies from the website (if not paused and if cookies are blocked on this website)
function removeAdsCookies(){
    const { websitesPausedOn, cookiesBlockedOn } = allowedList;
    // Check if the website is paused and delete the ads
    if(!websitesPausedOn.includes(websiteHostName)){
        getFromChromeStorage("options", function(value) {
            const options = checkIfAValueIsSet(value, {});

            // Go through each option and if it is enabled then delete the corresponding elements for that option
            Object.entries(optionsMap).forEach(([option, elementNames]) => {
                // Check if the option is either true or undefined if underfined set it to true
                if (options[option]) {
                    deleteElements(...elementNames);
                }
                else if (options[option] === undefined){
                    deleteElements(...elementNames);
                    options[option] = true
                }

                // Save the new options
                if (options !== value) {
                    saveToChromeStorage("options", options);
                }
            });

            deleteElements(...elementNames);
        });
    }

    // Check if cookies are blocked on this website and delete them
    if(cookiesBlockedOn.includes(websiteHostName)){
        document.cookie.split(';').forEach(function(c) { 
            let name = c.split('=')[0];
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'; 
        });
    }
}

// Remove all the ads and cookies on the website
setTimeout(() => {
    removeAdsCookies();
}, 10);
setInterval(removeAdsCookies, 200);

// Function to check if a website's membership status changed between two arrays
function hasWebsiteMembershipChanged(website, oldArray, newArray) {
    // Safely handle undefined/null arrays
    const oldList = oldArray || [];
    const newList = newArray || [];
    
    // Check if the website was added to or removed from the list
    return oldList.includes(website) !== newList.includes(website);
}


// Update the page if one of the lists changes or options change
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName === "sync") {
        if (changes.allowedList) {
            const { cookiesBlockedOn: oldCookiesBlockedOn, websitesPausedOn: oldWebsitesPausedOn } = changes.allowedList.oldValue || {};
            const { cookiesBlockedOn: newCookiesBlockedOn, websitesPausedOn: newWebsitesPausedOn } = changes.allowedList.newValue || {};
            
            // Check if the current website's status changed in either list
            if (hasWebsiteMembershipChanged(websiteHostName, oldWebsitesPausedOn, newWebsitesPausedOn) ||
                hasWebsiteMembershipChanged(websiteHostName, oldCookiesBlockedOn, newCookiesBlockedOn)) {
                // If the current website was added to or removed from either list, reload the page to apply the changes
                window.location.reload();
            }
        }
        else if (changes.options) {
            if (changes.options.newValue !== changes.options.oldValue) {
                // If the options changed, reload the page to apply the changes
                window.location.reload();
            }
        }
    }
});