// Edit this variable to add a new page
const pages = document.querySelectorAll(".page");
const pagesNames = [
    "#GeneralSettings",
    "#AllowedList",
    "#Statistics",
    "#About",
    "#Support"
];
let sections;

// Function to generate sections and pages dynamically based on pagesNames
function generateSectionsAndPages() {
    const sectionWrap = document.querySelector(".sectionWrap");

    // Generate the sections dynamically based on the pagesNames array
    sectionWrap.innerHTML = pagesNames.map(name => {
        // Replace Uppercase letters with a space before them except the first letter
        const formattedName = name.replace(/([A-Z])/g, ' $1').trim();
        return `<a class="section" href="${name}">${formattedName.replace("#", "")}</a>`;
    }).join("");

    sections = document.querySelectorAll(".section");

    // Get all page elements
    const pages = document.querySelectorAll(".page");

    // Generate page classes based on the pagesNames array
    pages.forEach((page, index) => {
        page.classList.add(pagesNames[index].replace("#", "").toLowerCase());
    });

    const sectionTitles = document.querySelectorAll(".sectionTitle");

    // Set the innerHTML of each section title based on the pagesNames array
    sectionTitles.forEach((title, index) => {
        title.innerHTML = pagesNames[index].replace("#", "").replace(/([A-Z])/g, ' $1').trim();
    });
}

generateSectionsAndPages(); // Call the function to generate sections and pages