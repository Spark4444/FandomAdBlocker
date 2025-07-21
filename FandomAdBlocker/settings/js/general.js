const checkboxes = {
    enableSelfPromotion: document.querySelector("#enableSelfPromotion")
};

// Store all options in an object
let options = {};

// Load options from Chrome storage and set up event listeners
getFromChromeStorage("options", function(value) {
    Object.entries(checkboxes).forEach(([key, checkbox]) => {
        // Set the initial state of the checkbox based on the stored value
        checkbox.checked = checkIfAValueIsSet(value[key], checkbox.checked);

        // Initialize the options object with the checkbox state
        options[key] = checkbox.checked;


        // Add an event listener to update the options when the checkbox state changes
        checkbox.addEventListener("change", function() {
            options[key] = this.checked;
            saveToChromeStorage("options", options);
        });
    });

    // Save the options to Chrome storage
    saveToChromeStorage("options", options);
});