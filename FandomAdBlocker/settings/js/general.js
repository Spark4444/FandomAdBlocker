const checkboxes = {};
const sideBarOptions = [];

// Generate the options object by selecting all elements with the class "option" and then finding the checkbox input within each option to store in the checkboxes object with the checkbox id as the key
document.querySelectorAll(".option").forEach(option => {
    const checkbox = option.querySelector("input[type='checkbox']");
    if (checkbox) {
        checkboxes[checkbox.id] = checkbox;

        // If the checkbox id ends with "Sidebar" but does not start with "sidebar" then it is a sidebar related option that should be toggled when the "sidebar" option is toggled so we store it in the sideBarOptions array for easy access later
        if (checkbox.id.endsWith("Sidebar") && checkbox.id.startsWith("sidebar") !== true) {
            sideBarOptions.push(checkbox.id);
        }
    }
});

// Store all option states in an options object to be saved to Chrome storage
let options = {};

// Load options from Chrome storage and set up event listeners
getFromChromeStorage("options", function(value) {
    value = checkIfAValueIsSet(value, undefined);
    
    Object.entries(checkboxes).forEach(([key, checkbox]) => {
        // Set the initial state of the checkbox based on the stored value
        checkbox.checked = checkIfAValueIsSet(value[key], true);

        // Initialize the options object with the checkbox state
        options[key] = checkbox.checked;


        // Add an event listener to update the options when the checkbox state changes
        checkbox.addEventListener("change", function() {
            if (key == "sidebar" && this.checked === true) {
                // If the "Sidebar" option is changed, update the state of all sidebar-related options to match it
                // Since all the sidebar options are encompased in the sidebar if the sidebar is disabled then they will not be displayed regardless of their individual settings
                // So it makes sense to disable them in the settings as well to avoid confusion
                sideBarOptions.forEach(sideBarOption => {
                    checkboxes[sideBarOption].checked = this.checked;
                    options[sideBarOption] = this.checked;
                });
            }

            options[key] = this.checked;
            saveToChromeStorage("options", options);
        });
    });

    // Save the options to Chrome storage
    saveToChromeStorage("options", options);
});