// Data for slider
const stats = [
    { cagr: "5%", worth: "$1.2T", desc: "Fashion industry growing slowly" },
    { cagr: "6%", worth: "$1.5T", desc: "Fashion growing moderately" },
    { cagr: "7%", worth: "$1.7T", desc: "Strong growth in fashion" },
    { cagr: "8%", worth: "$2.0T", desc: "Rapid expansion of fashion industry" },
    { cagr: "9%", worth: "$2.5T", desc: "Exceptional fashion growth rate" }
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

    enter.append("div")
        .attr("class", "mx-4")
        .append("h1")
        .attr("class", "cagr")
        .style("font-size", "48px")
        .style("color", "#ff6f61") // Deep pink for emphasis
        .style("margin-bottom", "5px");

    enter.append("p")
        .style("font-size", "20px")
        .style("color", "#333") // Dark grey text
        .text("Industry CAGR");

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
    statData.select(".cagr").text(currentStat.cagr);
    statData.select(".worth").text(currentStat.worth);

    // Remove unused elements
    statData.exit().remove();

    // Update description
    d3.select("#slider-desc")
        .text(currentStat.desc)
        .style("font-size", "30px")
        .style("color", "#333") // Dark grey for readability
        .style("text-align", "center")
        .style("margin-top", "10px");
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