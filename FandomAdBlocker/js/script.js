// Function to save data to Chrome storage
function saveToChromeStorage(key, value) {
    chrome.storage.sync.set({[key]: value});
}

// Function to get data from Chrome storage
function getFromChromeStorage(key, callback) {
    chrome.storage.sync.get([key], function(result) {
        callback(result[key]);
    });
}

// Checks if a chrome storage value is set
function checkIfAValueIsSet(value, defaultValue){
    if(value == undefined){
        return defaultValue;
    }
    else{
        return value;
    }
}

// Varaible initialization
let adsBlocked = 0;

// Get the varaible values from chrome storage
let adsBlockedTotal;
getFromChromeStorage("adsBlockedTotal", function(value){
    adsBlockedTotal = checkIfAValueIsSet(value, "0");
    if(window.location.href.includes("chrome-extension")){
        let count2 = document.querySelector(".count2");
        count2.innerHTML = adsBlockedTotal;
    }
});

let cookiesBlockedOn;
getFromChromeStorage("cookiesBlockedOn", function(value){
    cookiesBlockedOn = checkIfAValueIsSet(value, []);
});

let websitesPausedOn;
getFromChromeStorage("websitesPausedOn", function(value){
    websitesPausedOn = checkIfAValueIsSet(value, []);
});

// Deletes an element of specified name 
function deleteElement(elementName){
    if(document.querySelector(elementName)){
        document.querySelector(elementName).remove();
        adsBlocked++;
        adsBlockedTotal++;
        saveToChromeStorage("adsBlocked", adsBlocked);
        saveToChromeStorage("adsBlockedTotal", adsBlockedTotal);
    }
}

// Check if javascript is running in popup or on the tab
if(!window.location.href.includes("chrome-extension")){
    let websiteHostName = window.location.hostname;

    // Sends the status of the javascript
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getStatus")
        sendResponse({status: "active", hostName: window.location.hostname, adsBlocked: adsBlocked});
    });

    function removeAdsCookies(){
        if(!websitesPausedOn.includes(websiteHostName)){
            deleteElement(".cnx");
            deleteElement(".WikiaBarWrapper");
            deleteElement(".bottom-ads-container");
            deleteElement(".top-ads-container");
            deleteElement(".top_boxad");
            deleteElement(".gpt-ad");
            deleteElement(".featured-video-player-container");
        }
        if(cookiesBlockedOn.includes(websiteHostName)){
            document.cookie.split(';').forEach(function(c) { 
                let name = c.split('=')[0];
                document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'; 
            });
        }
    }

    // Removes all ads from any fandom website every 100 miliseconds
    setTimeout(() => {
        removeAdsCookies();
    }, 10);
    setInterval(removeAdsCookies, 100);
}
else{
    // Check if javascript of the extension is active if not switch to nothing to block design
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {method: "getStatus"}, function(response) {
          if (chrome.runtime.lastError) {
            document.querySelector(".main").innerHTML = `
            <div class="nothingText">Nothing to block here!</div>
            <div class="seperator"></div>
            <img src="img/disabledSite.png" class="nothingToBlockImage" alt="nothing to block image">
            `;
            document.querySelector(".main").style.height = "310px";
            document.querySelector("body").style.height = "380px";
          }
          else{
            let websiteName = document.querySelector(".websiteName");
            let count = document.querySelector(".count");
            let pauseOnThisFandombtn = document.querySelector(".pauseOnThisFandombtn");
            let disableCookiesbtn = document.querySelector(".disableCookiesbtn");
            let cookieIcon = document.querySelector(".cookieIcon");
            let pauseIcon = document.querySelector(".pauseIcon");
            let websiteNameVisited = response.hostName;
            adsBlocked = response.adsBlocked

            // Set the correct statistics on the pop up
            websiteName.innerHTML = websiteNameVisited;
            count.innerHTML = adsBlocked;

            // Enables turned on and turned off styles for a button
            function enableStylesForButton(button, icon, enable){
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
            if(websitesPausedOn.includes(websiteNameVisited)){
                pauseOnThisFandombtn.innerHTML = `<img src="img/play.svg" class="pauseIcon" style="padding: 0 6px 0 0;width: 15px;" alt="">Resume ad blocking on this fandom`;
                pauseIcon = document.querySelector(".pauseIcon")
                enableStylesForButton(pauseOnThisFandombtn, pauseIcon, true);
            }
            else{
                pauseOnThisFandombtn.innerHTML = `<img src="img/pause.svg" class="pauseIcon" alt="">Pause ad blocking on this fandom`;
            }
            if(cookiesBlockedOn.includes(websiteNameVisited)){
                disableCookiesbtn.innerHTML = `<img src="img/cookie.svg" class="cookieIcon" alt="">Enable cookies on this fandom`;
                cookieIcon = document.querySelector(".cookieIcon");
                enableStylesForButton(disableCookiesbtn, cookieIcon, true);
            }
            else{
                disableCookiesbtn.innerHTML = `<img src="img/cookie.svg" class="cookieIcon" alt="">Disable cookies on this fandom`;
            }

            // Disables all cookies on specified website on click
            disableCookiesbtn.addEventListener("click", function(event) {
                if(websiteNameVisited !== undefined){
                    if(!cookiesBlockedOn.includes(websiteNameVisited)){
                        cookiesBlockedOn.push(websiteNameVisited);
                        disableCookiesbtn.innerHTML = `<img src="img/cookie.svg" class="cookieIcon" alt="">Enable cookies on this fandom`;
                        cookieIcon = document.querySelector(".cookieIcon");
                        enableStylesForButton(disableCookiesbtn, cookieIcon, true);
                    }
                    else{
                        cookiesBlockedOn = cookiesBlockedOn.filter(item => item !== websiteNameVisited);
                        disableCookiesbtn.innerHTML = `<img src="img/cookie.svg" class="cookieIcon" alt="">Disable cookies on this fandom`;
                        cookieIcon = document.querySelector(".cookieIcon");
                        enableStylesForButton(disableCookiesbtn, cookieIcon, false);
                    }
                    saveToChromeStorage("cookiesBlockedOn", cookiesBlockedOn);
                }
            });
        
            // Pause ad blocking on a specified website on click
            pauseOnThisFandombtn.addEventListener("click", function(event) {
                if(websiteNameVisited !== undefined){
                    if(!websitesPausedOn.includes(websiteNameVisited)){
                        websitesPausedOn.push(websiteNameVisited);
                        pauseOnThisFandombtn.innerHTML = `<img src="img/play.svg" class="pauseIcon" style="padding: 0 6px 0 0;width: 15px;" alt="">Resume ad blocking on this fandom`;
                        pauseIcon = document.querySelector(".pauseIcon")
                        enableStylesForButton(pauseOnThisFandombtn, pauseIcon, true);
                    }
                    else{
                        websitesPausedOn = websitesPausedOn.filter(item => item !== websiteNameVisited);
                        pauseOnThisFandombtn.innerHTML = `<img src="img/pause.svg" class="pauseIcon" alt="">Pause ad blocking on this fandom`;
                        pauseIcon = document.querySelector(".pauseIcon")
                        enableStylesForButton(pauseOnThisFandombtn, pauseIcon, false);
                    }
                    saveToChromeStorage("websitesPausedOn", websitesPausedOn);
                }
            });
          }
        });
    });
}