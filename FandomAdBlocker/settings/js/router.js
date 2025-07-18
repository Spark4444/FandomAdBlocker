const pages = document.querySelectorAll(".page");
const pagesNames = [
    "#General",
    "#AllowList",
    "#Statistics",
    "#Support"
];
let sections;

// Initialize the router to set the correct page on load
function router() {
    switch (window.location.hash.toLowerCase()) {
        case "#general":
            pages.forEach(page => {
                page.style.display = "none";
            });
            pages[0].style.display = "";
            break;
        case "#allowlist":
            pages.forEach(page => {
                page.style.display = "none";
            });
            pages[1].style.display = "";
            break;
        case "#statistics":
            pages.forEach(page => {
                page.style.display = "none";
            });
            pages[2].style.display = "";
            break;
        case "#support":
            pages.forEach(page => {
                page.style.display = "none";
            });
            pages[3].style.display = "";
            break;
        // Show general settings page if hash is not recognized
        default:
            pages.forEach(page => {
                page.style.display = "none";
            });
            pages[0].style.display = "";
            break;
    }
}

router(); // Call the router function to set the initial page

function generateSectionsAndPages() {
    const sectionWrap = document.querySelector(".sectionWrap");

    // Generate the sections dynamically based on the pagesNames array
    sectionWrap.innerHTML = pagesNames.map(name => {
        // Replace Uppercase letters with a space before them except the first letter
        const formattedName = name.replace(/([A-Z])/g, ' $1').trim();
        return `<div class="section" hash="${name}">${formattedName.replace("#", "")}</div>`;
    }).join("");

    sections = document.querySelectorAll(".section");



    const pages = document.querySelectorAll(".page");

    pages.forEach((page, index) => {
        page.classList.add(pagesNames[index].replace("#", "").toLowerCase());
    });
}

generateSectionsAndPages(); // Call the function to generate sections and pages

// Add onclick event listener to each section for their respective hash
sections.forEach(section => {
    section.addEventListener("click", function(event) {
        const hash = event.target.getAttribute("hash");
        const lowerCaseHash = hash.toLowerCase();

        // Don't do unnecessary updates unless the hash has changed
        if (lowerCaseHash !== window.location.hash.toLowerCase() && lowerCaseHash) {
            window.location.hash = hash;
            router();
        }
    });
});