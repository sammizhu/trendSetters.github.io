function createRadialTreeMap() {
    const width = 600;
    const height = 600;
    const radius = Math.min(width, height) / 2 - 50;

    const svg = d3.select("#radialTreeMap")
        .append("svg")
        .attr("width", width + 150) // Increased width to accommodate the legend
        .attr("height", height);

    // Center the chart within the SVG
    const g = svg.append("g")
        .attr("transform", `translate(${(width / 2) + 30}, ${height / 3 + 30})`);

    const pie = d3.pie()
        .sort(null)
        .value(d => d.value);

    const color = d3.scaleLinear()
        .domain([0, 27.5, 55])
        .range(["#ffe6e6", "#ffb3b3", "#ff6f61"]);

    const arc = d3.arc()
        .innerRadius(50)
        .outerRadius(d => radius * (d.value / 100));

    // Load data from CSV
    d3.csv("../data/fashion_data.csv").then(data => {
        // Convert values to numbers
        data.forEach(d => d.value = +d.value);

        const arcs = g.selectAll(".arc")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "arc");

        arcs.append("path")
            .attr("d", arc)
            .attr("fill", d => color(d.data.value))
            .attr("stroke", "#fff")
            .attr("stroke-width", "1px");

        arcs.append("text")
            .attr("transform", d => {
                const angle = (d.startAngle + d.endAngle) / 2;
                let rotation = (angle * 180 / Math.PI) - 90;
                if (angle > Math.PI / 2 && angle < (3 * Math.PI / 2)) {
                    rotation += 180;
                }
                const [x, y] = arc.centroid(d);
                return `translate(${x}, ${y}) rotate(${rotation})`;
            })
            .attr("text-anchor", d => {
                const angle = (d.startAngle + d.endAngle) / 2;
                return (angle > Math.PI / 2 && angle < (3 * Math.PI / 2)) ? "end" : "start";
            })
            .attr("dy", ".35em")
            .text(d => d.data.name)
            .attr("class", "label-text");

        // Caption closer to the chart
        g.append("text")
            .attr("x", 75)
            .attr("y", -radius + 25)
            .attr("text-anchor", "middle")
            .attr("class", "chart-description")
            .text("See the Top 10 most searched for fashion items in the past decade according to Google Trend searches!");

        const legendData = [
            { color: "#ffe6e6", label: "0-34" },
            { color: "#ffb3b3", label: "35-50" },
            { color: "#ff6f61", label: "51-77" }
        ];

        const legendX = radius + 30;
        const legendY = -radius / 2;

        const legend = g.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${legendX}, ${legendY})`);

        // Add legend title
        legend.append("text")
            .attr("x", 0)
            .attr("y", -20)
            .attr("class", "legend-title")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("text-anchor", "start")
            .text("Google Search Growth (%)");

        // Add legend items
        const legendItems = legend.selectAll(".legend-item")
            .data(legendData)
            .enter().append("g")
            .attr("class", "legend-item")
            .attr("transform", (d, i) => `translate(0, ${i * 20})`);

        legendItems.append("rect")
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", d => d.color)
            .attr("stroke", "#ccc")
            .attr("stroke-width", "1px");

        legendItems.append("text")
            .attr("x", 20)
            .attr("y", 12)
            .attr("class", "legend-label")
            .style("font-size", "14px")
            .text(d => d.label);
    });
}

createRadialTreeMap();