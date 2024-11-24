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

    enter.append("div").attr("class", "mx-4").append("h1").attr("class", "cagr");
    enter.append("p").text("Industry CAGR");

    enter.append("div").attr("class", "mx-4").append("h1").attr("class", "worth");
    enter.append("p").text("Industry Worth");

    // UPDATE: Update existing elements
    statData.select(".cagr").text(currentStat.cagr);
    statData.select(".worth").text(currentStat.worth);

    // Remove unused elements
    statData.exit().remove();

    // Update description
    d3.select("#slider-desc").text(currentStat.desc);
}

// Slider functionality
const slider = document.getElementById("slider");
slider.addEventListener("input", (e) => {
    const value = e.target.value;
    updateStats(value);
});

// Initialize with the first statistic
updateStats(0);