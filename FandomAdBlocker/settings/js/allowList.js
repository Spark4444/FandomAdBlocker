const fandomInput = document.querySelector(".fandomInput");
const message = document.querySelector(".message");
const listSections = document.querySelectorAll(".listSection");

// Explanation: this varaible determines which mode is user in Allowed List/Blocked cookie list
// I used a boolean since it only has two states and perfectly fits the use case
let currentMode = true;

// Function to validate the fandom URL input
fandomInput.addEventListener("keyup", function(event) {
    const key = event.key.toLowerCase();
    if (key === "enter") {
        // *://*.fandom.com/* regex
        const fandomUrl = fandomInput.value.trim();
        const fandomRegex = /^https?:\/\/.*\.fandom\.com\/.*$/i;
        if (fandomRegex.test(fandomUrl)) {
            message.innerHTML = "Success! The fandom URL is valid.";
            message.style.color = "green";
        }
        else {
            message.innerHTML = "Error! Please enter a valid fandom URL. e.g. https://www.fandom.com/";
            message.style.color = "red";
        }
    }
});

// Clear the message when the user starts typing
fandomInput.addEventListener("input", function() {
    message.innerHTML = "";
});

// Add click event listeners to each section in the list to toggle between Allowed List and Blocked Cookie List
listSections.forEach((section, index) => {
    section.addEventListener("click", function(event) {
        listSections.forEach((sec, idx) => {
            sec.classList.remove("active");
            if (idx === index) {
                sec.classList.add("active");
                idx === 0 ? currentMode = true : currentMode = false;
            }
        });
    });
});