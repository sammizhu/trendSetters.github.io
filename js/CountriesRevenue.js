// CircleVis class definition
class CircleVis {
    constructor({ parentElement, dataPaths }) {
        this.parentElement = parentElement;
        this.dataPaths = dataPaths;
        console.log("Initializing CircleVis..."); // Debugging log
        this.initVis();
    }

    initVis() {
        const vis = this;

        // Set up color scale
        vis.colorScale = d3.scaleOrdinal(d3.schemeCategory10);

        // Set up margins and dimensions
        vis.margin = { top: 30, right: 50, bottom: 30, left: 50 };
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 600 - vis.margin.top - vis.margin.bottom;

        // Append the SVG element
        vis.svg = d3
            .select(vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        console.log("SVG element created:", vis.svg); // Debugging log

        // Load data from the specified paths
        vis.loadData();
    }

    loadData() {
        const vis = this;

        // Load the CSV file and extract the "Country of Origin" data
        d3.csv(vis.dataPaths[0]).then(data => {
            console.log("Raw data from CSV:", data); // Log the raw data

            // Extract "Country of Origin" column
            vis.data = data.map(d => d["Country of Origin"]);
            console.log("Extracted Country of Origin data:", vis.data); // Log the extracted data

            // Proceed to update the visualization
            vis.updateVis();
        }).catch(error => {
            console.error("Error loading data:", error);
        });
    }


    updateVis() {
        const vis = this;

        // Count occurrences of each "Country of Origin"
        const countryCounts = d3.rollup(
            vis.data,
            v => v.length,
            d => d
        );

        // Convert the data into an array and sort by count
        vis.countries = Array.from(countryCounts, ([country, count]) => ({
            country,
            count
        })).sort((a, b) => b.count - a.count);

        console.log("Country counts:", vis.countries); // Debugging log

        // Set up scales
        vis.xScale = d3.scalePoint()
            .domain(vis.countries.map(d => d.country))
            .range([0, vis.width])
            .padding(0.5);

        // Adjust circle size range for better visibility
        vis.sizeScale = d3.scaleSqrt()
            .domain([0, d3.max(vis.countries, d => d.count)])
            .range([10, 50]); // Larger range for circle sizes

        // Draw circles
        const circles = vis.svg.selectAll("circle")
            .data(vis.countries);

        circles.enter()
            .append("circle")
            .merge(circles)
            .attr("cx", d => vis.xScale(d.country))
            .attr("cy", vis.height / 2)
            .attr("r", d => vis.sizeScale(d.count))
            .attr("fill", (d, i) => vis.colorScale(i))
            .attr("opacity", 0.7);

        circles.exit().remove();

        // Add country labels
        const labels = vis.svg.selectAll("text")
            .data(vis.countries);

        labels.enter()
            .append("text")
            .merge(labels)
            .attr("x", d => vis.xScale(d.country))
            .attr("y", vis.height / 2 + 5)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-weight", "bold")
            .text(d => d.country);

        labels.exit().remove();
    }
}

// Instantiate the CircleVis class when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", () => {
    const circleVis = new CircleVis({
        parentElement: "#VisContainer4", // The container for the visualization
        dataPaths: ["data/countryrevenue.csv"]
    });
});
