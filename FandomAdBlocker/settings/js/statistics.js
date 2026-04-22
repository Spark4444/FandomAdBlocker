const statistics = document.querySelector(".statisticsList");
const clearStatisticsbtn = document.querySelector(".clearStatisticsbtn");
// Object with all the descriptions for regular blockers
const  descriptionsMap = {
    ".top_leaderboard-odyssey-wrapper": "Ad banner at the top.",
    "#incontent_player_container": "Video ad container that plays the annoying video ads.",
    ".fandom-ad-wrapper": "Center ad banner that is usually in the middle of the page, there are usually multiple of these on the page.",
    ".bottom-ads-container": "Ad banner at the bottom of the page.",
    "#floor_adhesion_wrapper": "Sticky ad banner at the bottom of the page that stays at the bottom when scrolling.",
    "#rail-boxad-wrapper": "Top ad in the sidebar.",
    "#mid_boxad": "Middle ad container in the sidebar.",
    ".sticky-modules-wrapper": "Bottom ad in the sidebar that is sticky and stays at the bottom of the sidebar when scrolling.",
    // Mobile Version Ads
    "#top_boxad": "Top ad container on mobile devices.",
};

/** Function to update the statistics display */
function updateStatistics() {
    // Get the statistics from storage
    getFromChromeStorage("statistics", function(value){
        // Check if the statistics are set
        value = checkIfAValueIsSet(value, {});

        // Default to nothing if nothing is found
        if (Object.keys(value).length === 0) {
            statistics.innerHTML = `<div class="bold noStatistics">No statistics available yet. Open a new fandom page to see statistics here.</div>`;
        }
        else {
            statistics.innerHTML = `<div class="statisticItem mainStat"><div class="textLeft">Total Ads Blocked:</div> <div class="textRight">${sumUpStatistics(value)}</div>`;
            statistics.innerHTML += `<div class="statisticsHeader">Blocked Elements</div>`;
            
            // Sort the statistics in descending order based on the count of blocked elements
            const sortedStatistics = Object.entries(value).sort((a, b) => b[1] - a[1]);

            // Go through all the statistics and map them for display
            sortedStatistics.forEach(([key, val]) => {
                let description = descriptionsMap[key];

                // If description doesnt exist take display the corresponding button name instead to not repeat the same description twice
                if (!description) {
                    Object.entries(optionsMap).forEach(([key2, val2]) => {
                        val2.forEach(element => {
                            if (element === key) {
                                description = `${document.querySelector(`label[for="${key2}"]`).innerHTML} selector (button in general settings).`;
                            }
                        });
                    });
                }


                if (typeof val === "number" || typeof val === "string" && typeof key === "string") {
                    statistics.innerHTML += `
                    <div class="statisticItem">
                        <div class="statisticsTop">
                            <div class="textLeft">Element <div class="textHighlight">${key}</div></div> 
                            <div class="textRight">${val} times</div>
                        </div>
                        <div class="statisticsBottom">
                            <div class="textLeft">Description:</div>
                            <div class="bottomTextRight">${description || "No description available"}</div>
                        </div>
                    </div>`;
                }
            });
        }
    });
}

updateStatistics(); // Initial render of statistics

// Update statistics on changes
chrome.storage.onChanged.addListener(function(changes, areaName) {
    if (areaName === "sync" && (changes.statistics)) {
        updateStatistics();
    }
});

// Clear statistics button functionality
clearStatisticsbtn.addEventListener("click", function() {
    confirmModal("Are you sure you want to clear all statistics?", "Clear", "Cancel", function() {
        saveToChromeStorage("statistics", {});
    });
});