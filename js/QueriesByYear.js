class LineChart {
    constructor({ parentElement, data }) {
        this.parentElement = parentElement;
        this.data = data;
        this.initVis();
    }

    initVis() {
        const vis = this;

        // Updated color scale to use pink-themed colors
        vis.colorScale = d3.scaleOrdinal()
            .domain(["MC", "TJX", "LULU", "GAP"])
            .range(["#ffe6e6", "#ffb3b3", "#ff6f61", "#ff8c94"]);

        vis.margin = { top: 50, right: 20, bottom: 60, left: 50 };
        vis.width = 500 - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select(vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom);

        vis.svg.append("text")
            .attr("x", (vis.width + vis.margin.left + vis.margin.right) / 2)
            .attr("y", vis.margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .style("fill", "#ff6f61") // Title in pink
            .text("Number of Fashion Queries Over Time");

        vis.chartGroup = vis.svg.append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

        vis.xScale = d3.scaleLinear().range([0, vis.width]);
        vis.yScale = d3.scaleLinear().range([vis.height, 0]);

        vis.xAxisGroup = vis.chartGroup.append("g")
            .attr("transform", `translate(0,${vis.height})`);

        vis.yAxisGroup = vis.chartGroup.append("g");

        vis.chartGroup.append("text")
            .attr("x", vis.width / 2)
            .attr("y", vis.height + vis.margin.bottom - 10)
            .attr("text-anchor", "middle")
            .style("fill", "#333") // Dark grey for axis label
            .text("Year");

        vis.chartGroup.append("text")
            .attr("x", -vis.height / 2)
            .attr("y", -vis.margin.left + 20)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .style("fill", "#333") // Dark grey for axis label
            .text("Count of Queries");

        vis.lineGenerator = d3.line()
            .x(d => vis.xScale(d.year))
            .y(d => vis.yScale(d.count));

        vis.updateVis();
    }

    updateVis() {
        const vis = this;

        vis.xScale.domain(d3.extent(vis.data, d => d.year));
        vis.yScale.domain([0, d3.max(vis.data, d => d.count)]);

        vis.xAxisGroup.call(d3.axisBottom(vis.xScale).tickFormat(d3.format("d")))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end")
            .style("fill", "#333"); // Dark grey for axis text

        vis.yAxisGroup.call(d3.axisLeft(vis.yScale))
            .selectAll("text")
            .style("fill", "#333"); // Dark grey for axis text

        vis.chartGroup.selectAll(".line-path").remove();
        vis.chartGroup.append("path")
            .datum(vis.data)
            .attr("class", "line-path")
            .attr("fill", "none")
            .attr("stroke", "#ff6f61") // Pink for the line
            .attr("stroke-width", 2)
            .attr("d", vis.lineGenerator);

        vis.chartGroup.selectAll(".dot").remove();
        vis.chartGroup.selectAll(".dot")
            .data(vis.data)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => vis.xScale(d.year))
            .attr("cy", d => vis.yScale(d.count))
            .attr("r", 5)
            .attr("fill", "#ffb3b3") // Light pink for dots
            .attr("stroke", "#ff6f61") // Add a darker pink stroke for contrast
            .attr("stroke-width", 1.5);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const data = [
        { year: 2012, count: 25 },
        { year: 2014, count: 5 },
        { year: 2015, count: 10 },
        { year: 2016, count: 10 },
        { year: 2018, count: 10 },
        { year: 2019, count: 5 }
    ];

    const chart = new LineChart({
        parentElement: "#lineChart",
        data: data
    });
});