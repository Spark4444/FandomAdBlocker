const fandomInput = document.querySelector(".fandomInput");
const message = document.querySelector(".message");
const listSections = document.querySelectorAll(".listSection");
const allowedLists = document.querySelectorAll(".allowedList");
const clearAllButton = document.querySelector(".clearAllButton");

// Explanation: this variable determines which mode the user is in Allowed List/Blocked cookie list
// I used a boolean since it only has two states and perfectly fits the use case
let currentMode = true;
let allowedList = {
    websitesPausedOn: [],
    cookiesBlockedOn: []
};
let messageTimeout;
let messageTimeout2;

/** Clear the message immediately */
function clearMessage() {
    clearTimeout(messageTimeout);
    clearTimeout(messageTimeout2);
    message.innerHTML = "";
    message.classList.remove("hideMessage");
    message.style.display = "none";
}

/** Show a message with the specified text and type (error or success) */
function showMessage(text, type) {
    clearTimeout(messageTimeout);
    clearTimeout(messageTimeout2);

    message.innerHTML = text;
    message.style.display = "";
    message.style.color = type === "error" ? "red" : "green";

    messageTimeout = setTimeout(() => {
        message.classList.add("hideMessage");
    }, 1500);

    messageTimeout2 = setTimeout(() => {
        message.innerHTML = "";
        message.style.display = "none";
        message.classList.remove("hideMessage");
    }, 2450);
}

// Function to validate the fandom URL input
fandomInput.addEventListener("keyup", function(event) {
    const key = event.key.toLowerCase();
    if (key === "enter") {
        // *://*.fandom.com/* regex
        const fandomUrl = fandomInput.value.trim();
        const isAlreadyInList = currentMode ? allowedList.websitesPausedOn.includes(fandomUrl) : allowedList.cookiesBlockedOn.includes(fandomUrl);
        const fandomRegex = /^(https?:\/\/)?([\w-]+\.)?fandom\.com(\/.*)?$/i;
        if (fandomRegex.test(fandomUrl) && !isAlreadyInList) {
            showMessage("Success! The fandom URL is valid.", "success");

            // Extract the hostname from the URL
            let hostname;
            if (fandomUrl.startsWith('http://') || fandomUrl.startsWith('https://')) {
                const url = new URL(fandomUrl);
                hostname = url.hostname.replace(/^www\./, ""); // Remove "www."
            } 
            else {
                // Handle URLs without protocol by adding https://
                const url = new URL('https://' + fandomUrl);
                hostname = url.hostname.replace(/^www\./, ""); // Remove "www."
            }
            const key = currentMode ? "websitesPausedOn" : "cookiesBlockedOn";


            // Get prev allowed list from Chrome storage and add the new hostname if not already present
            getFromChromeStorage("allowedList", function(value) {
                const currentList = value || { websitesPausedOn: [], cookiesBlockedOn: [] };
                // Use a set to avoid duplicates
                saveToChromeStorage("allowedList", {...currentList, [key]: [...new Set([...currentList[key], hostname])]});
            });
        }
        else if (!isAlreadyInList) {
            showMessage("Error! Please enter a valid fandom URL. e.g. https://www.fandom.com/", "error");
        }
        else {
            showMessage("Error! This fandom URL is already in the list.", "error");
        }
    }
});

// Clear the message when the user starts typing
fandomInput.addEventListener("input", function() {
    message.innerHTML = "";
});

// Add click event listeners to each section in the list to toggle between Allowed List and Blocked Cookie List
listSections.forEach((section, index) => {
    section.addEventListener("click", function(event) {
        clearMessage(); // Clear the message when switching sections
        fandomInput.value = ""; // Clear the input field when switching sections
        listSections.forEach((sec, idx) => {
            sec.classList.remove("active");
            allowedLists[idx].style.display = "none";
            if (idx === index) {
                sec.classList.add("active");
                allowedLists[idx].style.display = "";
                idx === 0 ? currentMode = true : currentMode = false;
            }
        });
    });
});

/** Generate the allowed list based on the current mode.
 * listType: true for websitesPausedOn, false for cookiesBlockedOn
 */
function generateAllowedList(listType) {
    const listKey = listType ? "websitesPausedOn" : "cookiesBlockedOn";
    const listIndex = listType ? 0 : 1;
    getFromChromeStorage("allowedList", function(value) {
        value = checkIfAValueIsSet(value, {
            websitesPausedOn: [],
            cookiesBlockedOn: []
        });

        allowedList = value;
        allowedLists[listIndex].innerHTML = value[listKey].map(item => `<div class="listItemContainer"><div class="listItem">${item}</div><div class="removeItem btn" key="${item}" type="${listType ? "websitesPausedOn" : "cookiesBlockedOn"}">Remove</div></div>`).join("");

        if (value[listKey].length === 0) {
            allowedLists[listIndex].innerHTML = `<div class="noItemContainer">No items in this list yet. Add some using the input above.</div>`;
        }
        
        // Add event listeners to the remove buttons
        const removeItems = document.querySelectorAll(".removeItem");

        removeItems.forEach(item => {
            item.addEventListener("click", function(event) {
                const itemKey = event.target.getAttribute("key");
                const listType = event.target.getAttribute("type");

                getFromChromeStorage("allowedList", function(value) {
                    // There's no need for confirmation here since it's pretty easy to add the item back
                    const updatedList = value[listType].filter(i => i !== itemKey);
                    saveToChromeStorage("allowedList", {...value, [listType]: updatedList});
                    generateAllowedList(listType === "websitesPausedOn"); // Regenerate the list after removal
                });
            });
        });
    });
}

// Initial render of both allowed lists
generateAllowedList(true);
generateAllowedList(false);

// Update the allowed list when the storage changes
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName === "sync") {
        if (changes.allowedList) {
            generateAllowedList(true);
            generateAllowedList(false);
        }
    }
});

clearAllButton.addEventListener("click", function() {
    const isEmpty = currentMode ? allowedList.websitesPausedOn.length === 0 : allowedList.cookiesBlockedOn.length === 0;
    if (isEmpty) {
        showMessage("The list is already empty.", "error");
    }
    else {
        confirmModal("Are you sure you want to clear all entries in the current list?", "Clear", "Cancel", function() {
            const key = currentMode ? "websitesPausedOn" : "cookiesBlockedOn";
            getFromChromeStorage("allowedList", function(value) {
                const updatedList = {...value, [key]: []};
                saveToChromeStorage("allowedList", updatedList);
            });
            generateAllowedList(currentMode); // Regenerate the list after clearing
            showMessage("All entries cleared successfully.", "success");
        });
    }
});