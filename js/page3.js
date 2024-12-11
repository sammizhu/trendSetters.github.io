// page 3 right side chart for the linear market growth visualization
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    // Load data from CSV file
    d3.csv("../data/fashion_market.csv").then(data => {
        // Parse the trends field into an array
        data.forEach(d => {
            d.marketSize = +d.marketSize;
            d.trends = d.trends.split(";");
        });

        // Set dimensions
        const margin = { top: 40, right: 30, bottom: 50, left: 50 };
        const width = 400 - margin.left - margin.right;
        const height = 200 - margin.top - margin.bottom;

        // Create SVG
        const svg = d3.select("#yearlyChart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // Add chart title
        d3.select("#yearlyChart svg")
            .append("text")
            .attr("x", (width + margin.left + margin.right) / 2)
            .attr("y", margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Fashion Market Size Over Time (click a dot!)");

        // Add X-axis
        const x = d3.scaleLinear()
            .domain(d3.extent(data, d => d.year))
            .range([0, width]);
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(6).tickFormat(d3.format("d")));

        // Add X-axis label
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text("Year");

        // Add Y-axis
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.marketSize)])
            .range([height, 0]);
        svg.append("g").call(d3.axisLeft(y));

        // Add Y-axis label
        svg.append("text")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${-margin.left + 15},${height / 2})rotate(-90)`)
            .style("font-size", "12px")
            .text("Market Size (in B)");

        // Line generator
        const line = d3.line()
            .x(d => x(d.year))
            .y(d => y(d.marketSize));

        // Add line to chart
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "#ff6f61")
            .attr("stroke-width", 1.5)
            .attr("d", line);

        // Add dots
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => x(d.year))
            .attr("cy", d => y(d.marketSize))
            .attr("r", 5)
            .attr("fill", "#ff6f61")
            .style("cursor", "pointer")
            .on("click", function (event, d) {
                svg.selectAll("circle")
                    .attr("stroke", "none")
                    .attr("fill", "#ff6f61");

                d3.select(this)
                    .attr("stroke", "#b33a3a")
                    .attr("stroke-width", 2)
                    .attr("fill", "#e85550");

                updateInfo(d);
            });

        // Update Info Boxes on Click
        function updateInfo(dataPoint) {
            const yearElement = document.getElementById("year");
            const marketSizeElement = document.getElementById("market-size");
            const fastestSectorElement = document.getElementById("fastest-sector");
            const yearTrendsElement = document.getElementById("year-trends");
            const trendsTextElement = document.getElementById("trends-text");

            if (yearElement && marketSizeElement && fastestSectorElement && yearTrendsElement && trendsTextElement) {
                yearElement.textContent = dataPoint.year;
                marketSizeElement.textContent = `$${dataPoint.marketSize}B`;
                fastestSectorElement.textContent = dataPoint.fastestSector;
                yearTrendsElement.textContent = dataPoint.year;

                trendsTextElement.innerHTML = "";
                dataPoint.trends.forEach((trend) => {
                    const listItem = document.createElement("li");
                    listItem.textContent = trend;
                    trendsTextElement.appendChild(listItem);
                });
            }
        }

        // Initialize with the first data point
        updateInfo(data[0]);

        svg.selectAll("circle").filter((d, i) => i === 0)
            .attr("stroke", "#b33a3a")
            .attr("stroke-width", 2)
            .attr("fill", "#e85550");
    });
});