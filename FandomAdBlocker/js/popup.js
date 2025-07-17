// Numbers
let adsBlocked = 0;
let adsBlockedTotal;

// Arrays
let cookiesBlockedOn;
let websitesPausedOn;

// DOM elements
let websiteName = document.querySelector(".websiteName");
let count = document.querySelector(".count");
let pauseOnThisFandombtn = document.querySelector(".pauseOnThisFandombtn");
let disableCookiesbtn = document.querySelector(".disableCookiesbtn");
let cookieIcon = document.querySelector(".cookieIcon");
let pauseIcon = document.querySelector(".pauseIcon");
let settingsIcon = document.querySelector(".settingsIcon");

// Imports
import { getFromChromeStorage, saveToChromeStorage, checkIfAValueIsSet} from "./functions.js";

// Get the varaible values from chrome storage
getFromChromeStorage("adsBlockedTotal", function(value){
    adsBlockedTotal = checkIfAValueIsSet(value, "0");

    // Update the ads blocked total count on the extension popup
    if(window.location.href.includes("chrome-extension")){
        let count2 = document.querySelector(".count2");
        count2.innerHTML = adsBlockedTotal;
    }
});

getFromChromeStorage("cookiesBlockedOn", function(value){
    cookiesBlockedOn = checkIfAValueIsSet(value, []);
});

getFromChromeStorage("websitesPausedOn", function(value){
    websitesPausedOn = checkIfAValueIsSet(value, []);
});

// Check if javascript of the extension is active if not switch to nothing design
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
        else{
            let websiteHostname = response.hostName;
            adsBlocked = response.adsBlocked;

            // Set the correct statistics on the pop up
            websiteName.innerHTML = websiteHostname;
            count.innerHTML = adsBlocked;

            // Enables turned on and turned off styles for a button
            function enableStylesForButton(button, icon, enable) {
                if(enable){
                    button.style.background = "#520143";
                    button.style.color = "white";
                    icon.style.filter = "invert(1)";
                }
                else{
                    button.style.background = "";
                    button.style.color = "";
                    icon.style.filter = "";
                }
            }

            // Set the correct button styles depending on the status of the website
            if(websitesPausedOn.includes(websiteHostname)) {
                pauseOnThisFandombtn.innerHTML = `<img src="img/play.svg" class="pauseIcon" style="padding: 0 6px 0 0;width: 15px;" draggable="false" alt="">Resume ad blocking on this fandom`;
                pauseIcon = document.querySelector(".pauseIcon");
                enableStylesForButton(pauseOnThisFandombtn, pauseIcon, true);
            }
            else{
                pauseOnThisFandombtn.innerHTML = `<img src="img/pause.svg" class="pauseIcon" draggable="false" alt="">Pause ad blocking on this fandom`;
            }

            if(cookiesBlockedOn.includes(websiteHostname)) {
                disableCookiesbtn.innerHTML = `<img src="img/cookie.svg" class="cookieIcon" draggable="false" alt="">Enable cookies on this fandom`;
                cookieIcon = document.querySelector(".cookieIcon");
                enableStylesForButton(disableCookiesbtn, cookieIcon, true);
            }
            else{
                disableCookiesbtn.innerHTML = `<img src="img/cookie.svg" class="cookieIcon" draggable="false" alt="">Disable cookies on this fandom`;
            }

            // Event listener for the buttons
            // Disable cookies on a specified website
            disableCookiesbtn.addEventListener("click", function(event) {
                if(websiteHostname !== undefined){
                    if(!cookiesBlockedOn.includes(websiteHostname)) {
                        cookiesBlockedOn.push(websiteHostname);
                        disableCookiesbtn.innerHTML = `<img src="img/cookie.svg" class="cookieIcon" draggable="false" alt="">Enable cookies on this fandom`;
                        cookieIcon = document.querySelector(".cookieIcon");
                        enableStylesForButton(disableCookiesbtn, cookieIcon, true);
                    }
                    else{
                        cookiesBlockedOn = cookiesBlockedOn.filter(item => item !== websiteHostname);
                        disableCookiesbtn.innerHTML = `<img src="img/cookie.svg" class="cookieIcon" draggable="false" alt="">Disable cookies on this fandom`;
                        cookieIcon = document.querySelector(".cookieIcon");
                        enableStylesForButton(disableCookiesbtn, cookieIcon, false);
                    }

                    chrome.tabs.sendMessage(tabs[0].id, {action: "updatePage"});
                    saveToChromeStorage("cookiesBlockedOn", cookiesBlockedOn);
                }
            });
        
            // Pause ad blocking on a specified website
            pauseOnThisFandombtn.addEventListener("click", function(event) {
                if(websiteHostname !== undefined){
                    if(!websitesPausedOn.includes(websiteHostname)) {
                        websitesPausedOn.push(websiteHostname);
                        pauseOnThisFandombtn.innerHTML = `<img src="img/play.svg" class="pauseIcon" draggable="false" style="padding: 0 6px 0 0;width: 15px;" alt="">Resume ad blocking on this fandom`;
                        pauseIcon = document.querySelector(".pauseIcon")
                        enableStylesForButton(pauseOnThisFandombtn, pauseIcon, true);
                    }
                    else{
                        websitesPausedOn = websitesPausedOn.filter(item => item !== websiteHostname);
                        pauseOnThisFandombtn.innerHTML = `<img src="img/pause.svg" class="pauseIcon" draggable="false" alt="">Pause ad blocking on this fandom`;
                        pauseIcon = document.querySelector(".pauseIcon")
                        enableStylesForButton(pauseOnThisFandombtn, pauseIcon, false);
                    }

                    chrome.tabs.sendMessage(tabs[0].id, {action: "updatePage"});
                    saveToChromeStorage("websitesPausedOn", websitesPausedOn);
                }
            });
        }
    });
});

// Open settings page in new tab
settingsIcon.addEventListener("click", function() {
    chrome.tabs.create({ url: chrome.runtime.getURL("settings/index.html") });
});