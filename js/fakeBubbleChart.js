function createRadialTreeMap() {
    const data = [
        { name: "Sneakers", value: 55 },
        { name: "Jeans", value: 50 },
        { name: "Dresses", value: 45 },
        { name: "T-shirts", value: 40 },
        { name: "Handbags", value: 35 },
        { name: "Hats", value: 30 },
        { name: "Jackets", value: 25 },
        { name: "Sunglasses", value: 20 },
        { name: "Watches", value: 15 },
        { name: "High Heels", value: 10 },
    ];

    const width = 550;
    const height = 550;
    const radius = Math.min(width, height) / 2 - 50;

    const svg = d3.select("#radialTreeMap")
        .append("svg")
        .attr("width", width)
        .attr("height", height);

    // Center the chart within the SVG
    const g = svg.append("g")
        .attr("transform", `translate(${(width / 2) + 100}, ${height / 2})`);

    const pie = d3.pie()
        .sort(null)
        .value(d => d.value);

    const color = d3.scaleLinear()
        .domain([0, 27.5, 55])
        .range(["#ffe6e6", "#ffb3b3", "#ff6f61"]);

    const arc = d3.arc()
        .innerRadius(50)
        .outerRadius(d => radius * (d.data.value / 100));

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

    // Title above the chart
    g.append("text")
        .attr("x", 0)
        .attr("y", -radius - 30)
        .attr("text-anchor", "middle")
        .attr("class", "chart-title")
        .text("Radial Tree Map: Top Fashion Searches");

    // Caption closer to the chart
    g.append("text")
        .attr("x", 0)
        .attr("y", -radius - 10)
        .attr("text-anchor", "middle")
        .attr("class", "chart-description")
        .text("This chart highlights the top 10 most searched-for fashion items over the past decade.");

    const legendData = [
        { color: "#ffe6e6", label: "0-18" },
        { color: "#ffb3b3", label: "19-36" },
        { color: "#ff6f61", label: "37-55" }
    ];

    // Position legend at the bottom-right quadrant of the chart
    // Adjust these values as needed to achieve the desired placement
    const legendX = radius * 0.5;
    const legendY = radius * 0.5 - 10;

    const legend = g.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${legendX}, ${legendY})`);

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
        .text(d => d.label);
}

createRadialTreeMap();