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

// Function that returns an HTML string for an option element with the given parameters
// Options explained:
// name: the name of the option to be displayed next to the checkbox
// id: the id attribute for the checkbox input
// description: a brief description of the option
// biggerOption: whether the option should be displayed as a bigger option if it has a longer description
// type: the type of the input (e.g. checkbox, radio)
// checked: whether the checkbox should be checked by default
function option(name, id, description, biggerOption = false, type = "checkbox", checked = false) {
    return `
        <div class="option ${biggerOption ? "biggerOption" : ""}">
            <div class="topOptionsWrap">
                <label for="${id}">${name.replace(/([A-Z])/g, ' $1').trim()}</label>
                <input type="${type}" id="${id}" ${checked ? "checked" : ""}>
            </div>
            <div class="optionDescription">${description}</div>
        </div>
    `;
}

function section(name) {
    return `
        <div class="optionSection">${name} options</div>
    `;
}

// Function to generate options dynamically based on the option elements in the HTML
function generateOptions() {
    let newOptions = "";
    const options = document.querySelectorAll("genOption, optionSection");

    options.forEach(element => {
        if (element.tagName.toLowerCase() === "optionsection") {
            newOptions += section(element.innerHTML);
        }
        else {
            const label = element.innerHTML;
            const id = element.id;
            const type = element.getAttribute("type");
            const checked = element.checked;
            const description = element.getAttribute("description");
            const biggerOption = element.hasAttribute("biggerOption");

            newOptions += option(label, id, description, biggerOption, type, checked);
        }
    });

    const optionsWrap = document.querySelector(".optionsWrap");
    optionsWrap.innerHTML = newOptions;
}

// HTML page generator
function generatePageLayout() {
    generateSectionsAndPages();
    generateOptions();
}

generatePageLayout();