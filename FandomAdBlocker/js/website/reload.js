/** Function to check if a website's membership status changed between two arrays */
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