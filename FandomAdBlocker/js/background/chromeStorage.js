// Set default values for all the chrome storage variables if they are not set
getFromChromeStorage("adsBlockedTotal", function(value) {
    // Don't perform type checking here as the value can be a number or string
    const totalAdsBlocked = value > -1 ? value : 0;
    saveToChromeStorage("adsBlockedTotal", totalAdsBlocked);
});

getFromChromeStorage("statistics", function(value) {
    const statistics = checkIfAValueIsSetWithType(value, {}, "object");
    if (value !== statistics) {
        saveToChromeStorage("statistics", statistics);
    }
});

getFromChromeStorage("allowedList", function(value) {
    const allowedList = checkIfAValueIsSetWithType(value, {
        websitesPausedOn: [],
        cookiesBlockedOn: []
    }, "object");
    if (value !== allowedList) {
        saveToChromeStorage("allowedList", allowedList);
    }
});

getFromChromeStorage("options", function(value) {
    const options = checkIfAValueIsSetWithType(value, {
        enableSelfPromotion: true
    }, "object");
    if (value !== options) {
        saveToChromeStorage("options", options);
    }
});