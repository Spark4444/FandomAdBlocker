// Edit this variable to add a new page
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

    // Generate page classes based on the pagesNames array
    pages.forEach((page, index) => {
        page.classList.add(pagesNames[index].replace("#", "").toLowerCase());
    });
}

generateSectionsAndPages(); // Call the function to generate sections and pages