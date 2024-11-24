// Select the button and the container for banners
const button = document.getElementById("actionButton");
const bannerContainer = document.getElementById("banner-container");

// Add event listener to the button
button.addEventListener("click", () => {
    // Create a new banner
    const banner = document.createElement("div");
    banner.className = "banner";
    banner.style.top = `${Math.random() * 80 + 10}%`; // Random vertical position (10% to 90%)
    banner.textContent = "PROMPT"; // Text for the banner

    // Add the banner to the container
    bannerContainer.appendChild(banner);
});
