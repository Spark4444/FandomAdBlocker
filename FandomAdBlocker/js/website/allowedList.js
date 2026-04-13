// Store cookies blocked on this website and websites paused as objects
let allowedList = {
    websitesPausedOn: [],
    cookiesBlockedOn: []
};

// Initialize allowed list from Chrome storage
function initializeAllowedList() {
    getFromChromeStorage("allowedList", function(value) {
        allowedList = checkIfAValueIsSet(value, {
            websitesPausedOn: [],
            cookiesBlockedOn: []
        });
        saveToChromeStorage("allowedList", allowedList);
    });
}

// Check if the current website is paused
function isWebsitePaused() {
    return allowedList.websitesPausedOn.includes(websiteHostName);
}

// Check if cookies should be blocked on the current website
function shouldBlockCookies() {
    return allowedList.cookiesBlockedOn.includes(websiteHostName);
}

// Function to remove cookies from the current website
function removeCookies() {
    if (shouldBlockCookies()) {
        document.cookie.split(';').forEach(function(c) { 
            let name = c.split('=')[0];
            document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'; 
        });
    }
}

// Initialize allowed list
initializeAllowedList();
