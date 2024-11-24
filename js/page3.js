document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM fully loaded and parsed");

    // Mock Data
    const data = [
        { year: 2010, marketSize: 500, fastestSector: "Clothing", trends: "E-commerce growth starts." },
        { year: 2012, marketSize: 600, fastestSector: "Accessories", trends: "Influencer culture begins." },
        { year: 2014, marketSize: 750, fastestSector: "Shoes", trends: "Sneaker trends rise." },
        { year: 2016, marketSize: 900, fastestSector: "Luxury", trends: "High-end brands go online." },
        { year: 2018, marketSize: 1100, fastestSector: "Activewear", trends: "Athleisure dominates fashion." },
        { year: 2020, marketSize: 1300, fastestSector: "E-commerce", trends: "Pandemic accelerates digital adoption." }
    ];

    // Set dimensions
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = 400 - margin.left - margin.right;
    const height = 200 - margin.top - margin.bottom;

    // Create SVG
    const svg = d3.select("#yearlyChart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add transparent background without capturing pointer events
    svg.append("rect")
        .attr("width", width)
        .attr("height", height)
        .attr("fill", "transparent")
        .style("pointer-events", "none"); // Added this line

    // Set scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.marketSize)])
        .range([height, 0]);

    // Add X-axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).ticks(6).tickFormat(d3.format("d")));

    // Add Y-axis
    svg.append("g").call(d3.axisLeft(y));

    // Line generator
    const line = d3.line()
        .x(d => x(d.year))
        .y(d => y(d.marketSize));

    // Add line to chart
    svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
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
        .attr("fill", "steelblue")
        .style("cursor", "pointer")
        .style("pointer-events", "all") // Ensure circles can receive pointer events
        .on("click", (event, d) => {
            console.log("Dot clicked:", d); // Debugging log
            updateInfo(d); // Call update function
        });

    // Update Info Boxes on Click
    function updateInfo(dataPoint) {
        console.log("Updating info boxes with:", dataPoint); // Debugging log
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
            trendsTextElement.value = dataPoint.trends;
        } else {
            console.error("One or more elements for updating info boxes are missing or incorrectly defined.");
        }
    }

    // Initialize with the first data point
    updateInfo(data[0]);
});