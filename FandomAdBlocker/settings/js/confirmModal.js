const modal = document.querySelector(".confirmModal");
const textElement = modal.querySelector(".modalText");
const confirmButton = modal.querySelector(".confirmButton");
const cancelButton = modal.querySelector(".cancelButton");

dragWindow(modal);

let hideTimeout;

function startHideTimeout() {
    modal.classList.add("hide");
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => {
        modal.style.display = "none";
        modal.classList.remove("hide");
        hideTimeout = null;
    }, 300);
}

/** Confirm Modal */
function confirmModal(message, confirmText, cancelText, onConfirm) {
    clearTimeout(hideTimeout);
    // Set the message and button texts
    textElement.innerHTML = message;
    confirmButton.innerHTML = confirmText;
    cancelButton.innerHTML = cancelText;

    confirmButton.onclick = () => {
        if (!hideTimeout) {
            // Call the onConfirm function and then remove the onclick event listeners to prevent memory leaks
            confirmButton.onclick = null;
            cancelButton.onclick = null;

            onConfirm();
            startHideTimeout();
        }
    };
    cancelButton.onclick = () => {
        if (!hideTimeout) {
            // Remove the onclick event listeners to prevent memory leaks
            confirmButton.onclick = null;
            cancelButton.onclick = null;

            startHideTimeout();
        }
    };

    modal.style.display = "";
}