// Get the hostname of the current website and remove "www." if it exists
const websiteHostName = window.location.hostname.replace(/^www\./, "");

// Element class names to delete.
// Add more ad elements as needed
const elementNames = [
    ".top_leaderboard-odyssey-wrapper",
    "#incontent_player_container",
    ".fandom-ad-wrapper",
    ".bottom-ads-container",
    "#floor_adhesion_wrapper",
    "#rail-boxad-wrapper",
    "#mid_boxad",
    ".sticky-modules-wrapper",
    // Mobile Version Ads
    "#top_boxad"
];