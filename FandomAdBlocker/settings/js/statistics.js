const statistics = document.querySelector(".statisticsList");

// Function to update the statistics display
function updateStatistics() {
    getFromChromeStorage("adsBlockedTotal", function(value){
        adsBlockedTotal = checkIfAValueIsSet(value, "0");
        statistics.innerHTML = `<div class="statisticItem">Ads blocked in total: ${adsBlockedTotal}</div>`;
    });

    getFromChromeStorage("statistics", function(value){
        statistics.innerHTML += `<div>Each element with the amount of times it was blocked:</div>`;
        Object.entries(value).forEach(([key, val]) => {
            if (typeof val === "number" || typeof val === "string" && typeof key === "string") {
                statistics.innerHTML += `<div class="statisticItem">Element "${key}": ${val} times</div>`;
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