// Function to delete an element from the website
function deleteElements(...elementNames) {
    elementNames.forEach(elementName => {
        // Use querySelectorAll to get all matching elements
        const elements = document.querySelectorAll(elementName);
        
        if (elements.length > 0) {
            elements.forEach(element => {
                // Remove the element from the DOM
                element.remove();
                
                // Update the statistics
                incrementElementStatistics(elementName);
            });
            
            // Update the chrome storage data (debounced)
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

// Function to remove ads from the website (if not paused)
function removeAds() {
    // Check if the website is paused and delete the ads
    if (!isWebsitePaused()) {
        getFromChromeStorage("options", function(value) {
            const options = checkIfAValueIsSet(value, {});

            // Go through each option and if it is enabled then delete the corresponding elements for that option
            Object.entries(optionsMap).forEach(([option, elementNames]) => {
                // Check if the option is either true or undefined if undefined set it to true
                if (options[option]) {
                    deleteElements(...elementNames);
                }
                else if (options[option] === undefined){
                    deleteElements(...elementNames);
                    options[option] = true
                }
            });

            // Delete base elements (always enabled)
            deleteElements(...elementNames);

            // Save the new options if they changed
            if (JSON.stringify(options) !== JSON.stringify(value)) {
                saveToChromeStorage("options", options);
            }
        });
    }
}

// Function to remove ads and cookies from the website (if not paused and if cookies are blocked on this website)
function removeAdsCookies() {
    removeAds();
    removeCookies();
}

// Remove all the ads and cookies on the website
// Run the removal after a short delay before the actual interval
setTimeout(() => {
    removeAdsCookies();
}, 10);
setInterval(removeAdsCookies, 200);