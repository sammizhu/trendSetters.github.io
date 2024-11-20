class LineChart {
    constructor({ parentElement, data }) {
        this.parentElement = parentElement;
        this.data = data;
        this.initVis();
    }

    initVis() {
        const vis = this;

        // Define the color scale
        vis.colorScale = d3.scaleOrdinal()
            .domain(["MC", "TJX", "LULU", "GAP"])
            .range(["#AEC6CF", "#FFB347", "#B39EB5", "#FF6961"]);

        // Set up the margins and dimensions
        vis.margin = { top: 50, right: 20, bottom: 60, left: 50 }; // Increased top margin for title
        vis.width = 500 - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

        // Create the SVG container
        vis.svg = d3.select(vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

        // Add a title to the chart
        vis.svg.append("text")
            .attr("x", (vis.width + vis.margin.left + vis.margin.right) / 2)
            .attr("y", vis.margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("Number of Fashion Queries Over Time");

        vis.chartGroup = vis.svg.append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

        // Initialize scales
        vis.xScale = d3.scaleLinear().range([0, vis.width]);
        vis.yScale = d3.scaleLinear().range([vis.height, 0]);

        // Add axis groups
        vis.xAxisGroup = vis.chartGroup.append("g")
            .attr("transform", `translate(0,${vis.height})`);

        vis.yAxisGroup = vis.chartGroup.append("g");

        // Add axis labels
        vis.chartGroup.append("text")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + vis.margin.bottom - 10)
            .attr("text-anchor", "middle")
            .text("Year");

        vis.chartGroup.append("text")
            .attr("x", -vis.height / 2)
            .attr("y", -vis.margin.left + 20)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Count of Queries");

        // Initialize the line generator
        vis.lineGenerator = d3.line()
            .x(d => vis.xScale(d.year))
            .y(d => vis.yScale(d.count));

        // Render the visualization
        vis.updateVis();
    }

    updateVis() {
        const vis = this;

        // Set the scale domains
        vis.xScale.domain(d3.extent(vis.data, d => d.year));
        vis.yScale.domain([0, d3.max(vis.data, d => d.count)]);

        // Render the axes
        vis.xAxisGroup.call(d3.axisBottom(vis.xScale).tickFormat(d3.format("d")))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        vis.yAxisGroup.call(d3.axisLeft(vis.yScale));

        // Render the line
        vis.chartGroup.selectAll(".line-path").remove(); // Clear old path if present
        vis.chartGroup.append("path")
            .datum(vis.data)
            .attr("class", "line-path")
            .attr("fill", "none")
            .attr("stroke", vis.colorScale("MC")) // Using consistent color for now
            .attr("stroke-width", 2)
            .attr("d", vis.lineGenerator);

        // Render the data points
        vis.chartGroup.selectAll(".dot").remove(); // Clear old points if present
        vis.chartGroup.selectAll(".dot")
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => vis.xScale(d.year))
            .attr("cy", d => vis.yScale(d.count))
            .attr("r", 5)
            .attr("fill", vis.colorScale("MC"));

        // Render data labels
        vis.chartGroup.selectAll(".text").remove(); // Clear old labels if present
        vis.chartGroup.selectAll(".text")
            .data(vis.data)
            .enter()
            .append("text")
            .attr("class", "text")
            .attr("x", d => vis.xScale(d.year))
            .attr("y", d => vis.yScale(d.count) - 10)
            .attr("text-anchor", "middle")
            .text(d => d.count);
    }
}

// Example usage
document.addEventListener("DOMContentLoaded", () => {
    // Mock data for testing
    const data = [
        { year: 2012, count: 25 },
        { year: 2014, count: 5 },
        { year: 2015, count: 10 },
        { year: 2016, count: 10 },
        { year: 2018, count: 10 },
        { year: 2019, count: 5 }
    ];

    // Create a new LineChart instance
    const chart = new LineChart({
        parentElement: "#VisContainer3",
        data: data
    });
});
