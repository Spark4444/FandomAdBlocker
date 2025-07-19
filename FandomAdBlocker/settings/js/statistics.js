const statistics = document.querySelector(".statisticsList");

// Function to update the statistics display
function updateStatistics() {
    getFromChromeStorage("adsBlocked", function(value){
        adsBlockedTotal = checkIfAValueIsSet(value.adsBlockedTotal, "0");
        statistics.innerHTML = `<div class="statisticItem mainStat"><div class="textLeft">Total Ads Blocked:</div> <div class="textRight">${adsBlockedTotal}</div>`;
    });

    getFromChromeStorage("statistics", function(value){
        statistics.innerHTML += `<div class="statisticsHeader">Blocked Elements Breakdown</div>`;
        Object.entries(value).forEach(([key, val]) => {
            if (typeof val === "number" || typeof val === "string" && typeof key === "string") {
                statistics.innerHTML += `<div class="statisticItem"><div class="textLeft">Element <div class="textHighlight">${key}</div></div> <div class="textRight">${val} times</div></div>`;
            }
        });
    });
}

updateStatistics(); // Initial render of statistics

// Update statistics on changes
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName === "sync" && (changes.statistics || changes.adsBlockedTotal)) {
        updateStatistics();
    }
});