// Select the button and the container for banners
const button = document.getElementById("actionButton");
const bannerContainer = document.getElementById("banner-container");

// List of questions to cycle through
const questions = [
    "What brands are growing the fastest?",
    "Which brand should I invest in?",
    "Which brands have dominated the fashion industry?",
    "How much do you spend on clothes every year?",
    "What influences your fashion purchases the most?",
    "Which brands do you shop from the most?",
    "How often do you shop for new clothes?",
    "Do you prioritize style or comfort when buying clothes?",
];

// Index to keep track of the current question
let currentIndex = 0;
// Counter to track button clicks
let clickCount = 0;

// Vertical position tracker
let currentTop = 15;

// Add event listener to the button
button.addEventListener("click", () => {
    // If the button has been clicked 8 times, reset the banners and the counter
    if (clickCount >= 8) {
        // Remove all banners
        while (bannerContainer.firstChild) {
            bannerContainer.removeChild(bannerContainer.firstChild);
        }

        // Reset the counter, index, and top position
        clickCount = 0;
        currentIndex = 0;
        currentTop = 15;

        return;
    }

    // Create a new banner
    const banner = document.createElement("div");
    banner.className = "banner";

    // Set a consistent vertical position for the banner
    banner.style.top = `${currentTop}%`;

    // Increment the vertical position for the next banner
    currentTop += 10; // Adjust increment as needed to fit your design

    // If the vertical position exceeds 100%, reset it (optional)
    if (currentTop >= 100) {
        currentTop = 0;
    }

    // Set the banner text to the current question
    banner.textContent = questions[currentIndex];

    // Increment the index and reset if at the end of the list
    currentIndex = (currentIndex + 1) % questions.length;

    // Increment the click counter
    clickCount++;

    // Add the banner to the container
    bannerContainer.appendChild(banner);
});