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

// Add event listener to the button
button.addEventListener("click", () => {
    // Create a new banner
    const banner = document.createElement("div");
    banner.className = "banner";
    banner.style.top = `${Math.random() * 80 + 10}%`; // Random vertical position (10% to 90%)

    // Set the banner text to the current question
    banner.textContent = questions[currentIndex];

    // Increment the index and reset if at the end of the list
    currentIndex = (currentIndex + 1) % questions.length;

    // Add the banner to the container
    bannerContainer.appendChild(banner);
});