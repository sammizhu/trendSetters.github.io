// Data for slider
const stats = [
    { year: "2000", worth: "$1.2T" },
    { year: "2006", worth: "$1.5T" },
    { year: "2012", worth: "$1.7T" },
    { year: "2018", worth: "$2.0T" },
    { year: "2024", worth: "$2.5T" }
];

// Create a function to render data dynamically using D3
function updateStats(index) {
    const currentStat = stats[index];

    // Select the container for the stats
    const container = d3.select("#stats-container");

    // Bind data
    const statData = container.selectAll(".stat").data([currentStat]);

    // ENTER: Create elements if needed
    const enter = statData.enter()
        .append("div")
        .attr("class", "stat d-flex justify-content-center align-items-center");

    // Year
    enter.append("div")
        .attr("class", "mx-4")
        .append("h1")
        .attr("class", "year")
        .style("font-size", "48px")
        .style("color", "#ff6f61") // Pink color for emphasis
        .style("margin-bottom", "5px");

    enter.append("p")
        .style("font-size", "20px")
        .style("color", "#333") // Dark grey text
        .text("Year");

    // Industry Worth
    enter.append("div")
        .attr("class", "mx-4")
        .append("h1")
        .attr("class", "worth")
        .style("font-size", "48px")
        .style("color", "#ffb3b3") // Medium pink for balance
        .style("margin-bottom", "5px");

    enter.append("p")
        .style("font-size", "20px")
        .style("color", "#333") // Dark grey text
        .text("Industry Worth");

    // UPDATE: Update existing elements
    statData.select(".year").text(currentStat.year);
    statData.select(".worth").text(currentStat.worth);

    // Remove unused elements
    statData.exit().remove();
}

// Style the slider
const slider = document.getElementById("slider");
slider.style.accentColor = "#ff6f61"; // Pink accent color for the slider

// Slider functionality
slider.addEventListener("input", (e) => {
    const value = e.target.value;
    updateStats(value);
});

// Initialize with the first statistic
updateStats(0);