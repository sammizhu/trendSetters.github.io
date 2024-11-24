function createBubbleChart() {
    const data = [
        { name: "Company A", value: 30 },
        { name: "Company B", value: 50 },
        { name: "Company C", value: 20 },
        { name: "Company D", value: 40 },
        { name: "Company E", value: 10 },
        { name: "Company F", value: 15 },
        { name: "Company G", value: 35 },
        { name: "Company H", value: 25 },
        { name: "Company I", value: 5 },
        { name: "Company J", value: 45 },
        { name: "Company K", value: 100 },
    ];

    const width = 600;
    const height = 600;

    // Create SVG container
    const svg = d3.select("#bubbleChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Add a title
    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 40)
        .attr("text-anchor", "middle")
        .style("font-size", "24px")
        .style("font-weight", "bold")
        .text("Popular Fashion Queries Over Time");

    // Create a bubble layout
    const bubble = d3.pack()
        .size([width, height - 100]) // Adjust for title and legend
        .padding(2);

    // Prepare hierarchy data
    const root = d3.hierarchy({ children: data })
        .sum(d => d.value);

    bubble(root);

    // Create nodes
    const nodes = svg.selectAll("g")
        .data(root.children)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x},${d.y + 50})`); // Shift down for title

    // Draw circles
    nodes.append("circle")
        .attr("r", d => d.r)
        .attr("fill", "steelblue")
        .attr("opacity", 0.8);

    // Add text labels
    nodes.append("text")
        .text(d => d.data.name)
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .style("font-size", d => `${Math.min(12, d.r / 3)}px`) // Scale text size based on radius
        .style("fill", "white");

    // Add a legend
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 150}, ${height - 150})`);

    // Legend title
    legend.append("text")
        .attr("x", 0)
        .attr("y", -10)
        .style("font-size", "14px")
        .style("font-weight", "bold")
        .text("Count of Query");

    // Legend gradient
    const gradient = svg.append("defs")
        .append("linearGradient")
        .attr("id", "legendGradient")
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "0%")
        .attr("y2", "0%");

    gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "lightblue");

    gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "steelblue");

    legend.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 100)
        .attr("height", 10)
        .style("fill", "url(#legendGradient)");

    // Legend scale
    legend.append("text")
        .attr("x", 0)
        .attr("y", 25)
        .style("font-size", "12px")
        .text("1");

    legend.append("text")
        .attr("x", 100)
        .attr("y", 25)
        .style("font-size", "12px")
        .attr("text-anchor", "end")
        .text("100");
}

// Render the bubble chart
createBubbleChart();