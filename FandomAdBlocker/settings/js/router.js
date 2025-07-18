const pages = document.querySelectorAll(".page");
const pagesNames = [
    "#General",
    "#AllowList",
    "#Statistics",
    "#Support",
    "#About"
];
let sections;

function generateSectionsAndPages() {
    const sectionWrap = document.querySelector(".sectionWrap");

    // Generate the sections dynamically based on the pagesNames array
    sectionWrap.innerHTML = pagesNames.map(name => {
        // Replace Uppercase letters with a space before them except the first letter
        const formattedName = name.replace(/([A-Z])/g, ' $1').trim();
        return `<a class="section" href="${name}">${formattedName.replace("#", "")}</a>`;
    }).join("");

    sections = document.querySelectorAll(".section");



    const pages = document.querySelectorAll(".page");

    pages.forEach((page, index) => {
        page.classList.add(pagesNames[index].replace("#", "").toLowerCase());
    });
}

generateSectionsAndPages(); // Call the function to generate sections and pages

// Initialize the router to set the correct page on load
function router() {
    const hash = window.location.hash.toLowerCase();
    
    pages.forEach(page => {
        page.style.display = "none";
    });

    pages.forEach(page => {
        if (page.classList.contains(hash.replace("#", ""))) {
            page.style.display = "";
        }
    });
}

router(); // Call the router function to set the initial page

// Add onclick event listener to each section for their respective hash
sections.forEach(section => {
    section.addEventListener("click", function(event) {
        const hash = event.target.getAttribute("href");
        const lowerCaseHash = hash.toLowerCase();

        // Don't do unnecessary updates unless the hash has changed
        if (lowerCaseHash !== window.location.hash.toLowerCase() && lowerCaseHash) {
            window.location.hash = hash;
            router();
        }
    });
});