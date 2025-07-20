// Count - on current page, count2 - total count
const count = document.querySelector(".count");
const count2 = document.querySelector(".count2");
const websiteName = document.querySelector(".websiteName");
const settingsIcon = document.querySelector(".settingsIcon");
const listButtons = document.querySelectorAll(".listButton");
const listIcons = document.querySelectorAll(".listIcon");

let buttons = {
    cookiesButton: false,
    pauseButton: false
};

// Check if the popup is opened on a valid website
chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {method: "getStatus"}, function(response) {
        if (chrome.runtime.lastError) {
            // Set the popup to nothing design
            document.querySelector(".main").innerHTML = `
            <div class="nothingText">Nothing to block here!</div>
            <div class="seperator"></div>
            <img src="img/disabledSite.png" class="nothingToBlockImage" draggable="false" alt="nothing to block image">
            `;
            document.querySelector(".main").style.height = "310px";
            document.querySelector("body").style.height = "380px";
        }
        else {
            const { status, hostName, adsBlocked } = response;
            if (status === "active") {
                websiteName.innerHTML = hostName;
                count.innerHTML = adsBlocked;

                // Update the total ads blocked count
                getFromChromeStorage("adsBlockedTotal", function(value) {
                    value = checkIfAValueIsSet(value, "0");
                    count2.innerHTML = value;
                });

                // Update the allowedList
                getFromChromeStorage("allowedList", function(value) {
                    allowedList = checkIfAValueIsSet(value, {
                        websitesPausedOn: [],
                        cookiesBlockedOn: []
                    });

                    saveToChromeStorage("allowedList", allowedList);

                    if (allowedList.websitesPausedOn.includes(hostName)) {
                        buttons.pauseButton = toggleButton(buttons.pauseButton, 1);
                    }
                    if (allowedList.cookiesBlockedOn.includes(hostName)) {
                        buttons.cookiesButton = toggleButton(buttons.cookiesButton, 0);
                    }
                });

                // Reverse the state of the buttons when clicked and return the new state
                function toggleButton(buttonBool, index) {
                    buttonBool = !buttonBool;

                    const button1Text = buttonBool ? "Enable cookies on this fandom" : "Disable cookies on this fandom";
                    const button2Text = buttonBool ? "Resume ad blocking on this fandom" : "Pause ad blocking on this fandom";

                    const type = index === 0 ? "cookiesBlockedOn" : "websitesPausedOn";

                    // Add an active class to the button if it is active, otherwise remove it
                    getFromChromeStorage("allowedList", function(value) {
                        allowedList = checkIfAValueIsSet(value, {
                            websitesPausedOn: [],
                            cookiesBlockedOn: []
                        });

                        if (buttonBool) {
                            listButtons[index].classList.add("active");

                            // Add the hostName to the allowedList if it is not already there
                            if (!allowedList[type].includes(hostName)) {
                                allowedList[type].push(hostName);
                            }
                        }
                        else {
                            listButtons[index].classList.remove("active");

                            // Remove the hostName from the allowedList if it is there
                            allowedList[type] = allowedList[type].filter(item => item !== hostName);
                        }

                        // Save the updated allowedList to chrome storage
                        saveToChromeStorage("allowedList", allowedList);
                    });

                    // Add some specific styles/change src for the img depending on the button index
                    if (index === 1) {
                        const src = buttonBool ? "img/play.svg" : "img/pause.svg";
                        const style = buttonBool ? "padding: 0px 6px 0px 0px; width: 15px;" : "";
                        listButtons[index].innerHTML = `<img src="${src}" style="${style}" class="pauseIcon listIcon" draggable="false" alt="">${button2Text}`;
                    }
                    else {
                        listButtons[index].innerHTML = `<img src="img/cookie.svg" class="cookieIcon listIcon" draggable="false" alt="">${button1Text}`;
                    }

                    return buttonBool;
                }

                listButtons.forEach((button, index) => {
                    button.addEventListener("click", function() {
                        if (index === 0) {
                            buttons.cookiesButton = toggleButton(buttons.cookiesButton, index);
                        } 
                        else if (index === 1) {
                            buttons.pauseButton = toggleButton(buttons.pauseButton, index);
                        }
                    });
                });
            }
        }
    });
});

// Open settings page in new tab on click
settingsIcon.addEventListener("click", function() {
    chrome.tabs.create({ url: chrome.runtime.getURL("settings/index.html") });
});