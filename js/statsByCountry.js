// creates the market size slider visualzation on the top of the third page left side

// Load data and initialize the slider
d3.csv("../data/market_size.csv").then(data => {
    // Convert marketSize to numbers
    data.forEach(d => {
        d.marketSize = `$${+d.marketSize}`;
    });

    // Create a function to render data dynamically
    function updateStats(index) {
        const currentStat = data[index];

        const container = d3.select("#stats-container");

        const statData = container.selectAll(".stat").data([currentStat]);

        // ENTER: Create elements if they don’t already exist
        const enter = statData.enter()
            .append("div")
            .attr("class", "stat d-flex justify-content-center align-items-center");

        // Country
        const countryContainer = enter.append("div").attr("class", "mx-4");
        countryContainer.append("h2")
            .attr("class", "country")
            .style("font-size", "30px")
            .style("color", "#ff6f61")
            .style("margin-bottom", "5px");
        countryContainer.append("p")
            .style("font-size", "20px")
            .style("color", "#333")
            .text("Country");

        // Market Size
        const marketSizeContainer = enter.append("div").attr("class", "mx-4");
        marketSizeContainer.append("h2")
            .attr("class", "market-size")
            .style("font-size", "30px")
            .style("color", "#ffb3b3")
            .style("margin-bottom", "5px");
        marketSizeContainer.append("p")
            .style("font-size", "20px")
            .style("color", "#333")
            .text("Market Size (billions)");

        // UPDATE: Update the text content of existing elements
        statData.select(".country").text(currentStat.country);
        statData.select(".market-size").text(currentStat.marketSize);

        // EXIT: Remove any unnecessary elements
        statData.exit().remove();
    }

    // Style the slider
    const slider = document.getElementById("slider");
    slider.style.accentColor = "#ff6f61";

    // Slider functionality
    slider.max = data.length - 1;
    slider.addEventListener("input", (e) => {
        const value = e.target.value;
        updateStats(value);
    });

    // Initialize with the first statistic
    updateStats(0);
});