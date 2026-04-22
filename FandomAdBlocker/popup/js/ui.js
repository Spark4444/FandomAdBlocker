// Count - on current page, count2 - total count
const count = document.querySelector(".count");
const count2 = document.querySelector(".count2");
const websiteName = document.querySelector(".websiteName");
const settingsIcon = document.querySelector(".settingsIcon");
const listButtons = document.querySelectorAll(".listButton");
const listIcons = document.querySelectorAll(".listIcon");
const main = document.querySelector(".main");
const body = document.querySelector("body");

// DIsplay the no ui ui
function nothingToBlock() {
    main.innerHTML = `
        <div class="nothingText">Nothing to block here!</div>
        <div class="seperator"></div>
        <img src="../img/disabledSite.png" class="nothingToBlockImage" draggable="false" alt="nothing to block image">
    `;
    main.style.height = "310px";
    body.style.height = "380px";
}


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
        const src = buttonBool ? "../img/play.svg" : "../img/pause.svg";
        const style = buttonBool ? "padding: 0px 6px 0px 0px; width: 15px;" : "";
        listButtons[index].innerHTML = `<img src="${src}" style="${style}" class="pauseIcon listIcon" draggable="false" alt="">${button2Text}`;
        count.innerHTML = 0; // Reset the count when pausing ad blocking
    }
    else {
        listButtons[index].innerHTML = `<img src="../img/cookie.svg" class="cookieIcon listIcon" draggable="false" alt="">${button1Text}`;
    }

    return buttonBool;
}

// Update the hostname and ads blocked count in the UI
function updateHostNameAndAdsBlocked(hostname, adsBlocked) {
    websiteName.innerHTML = hostname;
    count.innerHTML = adsBlocked;
}

// Function to initialize the UI with the correct values and event listeners
function initializeUI() {

    // Update the total ads blocked count
    getFromChromeStorage("statistics", function(value) {
        value = checkIfAValueIsSet(value, {});
        count2.innerHTML = sumUpStatistics(value) ? sumUpStatistics(value) : "0";
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

    // Add click event listeners to the buttons
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