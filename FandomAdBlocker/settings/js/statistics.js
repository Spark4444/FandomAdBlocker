const statistics = document.querySelector(".statisticsList");
const clearStatisticsbtn = document.querySelector(".clearStatisticsbtn");

// Function to update the statistics display
function updateStatistics() {
    getFromChromeStorage("adsBlockedTotal", function(value){
        value = checkIfAValueIsSet(value, "0");
        statistics.innerHTML = `<div class="statisticItem mainStat"><div class="textLeft">Total Ads Blocked:</div> <div class="textRight">${value}</div>`;
    });

    getFromChromeStorage("statistics", function(value){
        if (Object.keys(value).length === 0) {
            statistics.innerHTML = `<div class="bold noStatistics">No statistics available yet. Open a new fandom page to see statistics here.</div>`;
        }
        else {
            statistics.innerHTML += `<div class="statisticsHeader">Blocked Elements Breakdown</div>`;
            Object.entries(value).forEach(([key, val]) => {
                if (typeof val === "number" || typeof val === "string" && typeof key === "string") {
                    statistics.innerHTML += `<div class="statisticItem"><div class="textLeft">Element <div class="textHighlight">${key}</div></div> <div class="textRight">${val} times</div></div>`;
                }
            });
        }
    });
}

updateStatistics(); // Initial render of statistics

// Update statistics on changes
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName === "sync" && (changes.statistics || changes.adsBlockedTotal)) {
        updateStatistics();
    }
});

// Clear statistics button functionality
clearStatisticsbtn.addEventListener("click", function() {
    const confirmation = confirm("Are you sure you want to clear all statistics?");
    if (confirmation) {
        saveToChromeStorage("statistics", {});
        saveToChromeStorage("adsBlockedTotal", 0);
        updateStatistics(); // Refresh the statistics display after clearing
    }
});