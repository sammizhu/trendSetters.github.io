function createBubbleChart() {
    const data = [
        { name: "Shoes", value: 30 },
        { name: "Accessories", value: 50 },
        { name: "Clothing", value: 100 },
    ];

    const svg = d3.select("#bubbleChart")
        .append("svg")
        .attr("width", 400)
        .attr("height", 200);

    const bubble = d3.pack()
        .size([400, 200])
        .padding(1.5);

    const root = d3.hierarchy({ children: data })
        .sum(d => d.value);

    bubble(root);

    const nodes = svg.selectAll("g")
        .data(root.children)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${d.x},${d.y})`);

    nodes.append("circle")
        .attr("r", d => d.r)
        .attr("fill", "steelblue");

    nodes.append("text")
        .text(d => d.data.name)
        .attr("text-anchor", "middle")
        .attr("dy", ".3em")
        .style("fill", "white");
}

// Render the bubble chart
createBubbleChart();