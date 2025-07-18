// Initialize the router to set the correct page on load
function router() {
    const hash = window.location.hash.toLowerCase();
    let unknownHash = true;

    pages.forEach((page, index) => {
        page.style.display = "none";
        sections[index].classList.remove("active");
    });

    pages.forEach((page, index) => {
        if (page.classList.contains(hash.replace("#", ""))) {
            page.style.display = "";
            sections[index].classList.add("active");
            unknownHash = false;
        }
    });
    if (unknownHash) {
        // If the hash is unknown, show the first page by default
        window.location.hash = pagesNames[0];
        pages[0].style.display = "";
        sections[0].classList.add("active");
    }
}

router();

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

// Update the page when the hash changes
window.addEventListener("hashchange", router);