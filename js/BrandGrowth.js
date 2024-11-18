class BrandGrowth {
    constructor({parentElement, data}) {
        // set up
        this.parentElement = parentElement;
        this.dataPath = data;
        this.initVis();
    }

    initVis() {
        const vis = this;

        // color scale
        vis.colorScale = d3.scaleOrdinal()
            .domain(["LVMH", "TJX", "LULU", "GAP"])
            .range(["#AEC6CF", "#FFB347", "#B39EB5", "#FF6961"]);

        // Set up margins and dimensions
        vis.margin = { top: 10, right: 50, bottom: 100, left: 50 };
        vis.width = 600 - vis.margin.left - vis.margin.right;
        vis.height = 350 - vis.margin.top - vis.margin.bottom;

        // Append the SVG element
        vis.svg = d3
            .select(vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        // initialize chart group
        vis.chartGroup = vis.svg.append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

        // initialize legend
        vis.legendGroup = vis.svg.append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

        // form legend to appear at bottom
        vis.brands = ["LVMH", "TJX", "LULU", "GAP"]
        vis.legendGroup.selectAll(".dot").remove();
        vis.legendGroup.selectAll(".dot")
            .data(vis.brands)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", (d,i) => -vis.margin.left + 10 + i * 50)
            .attr("cy", vis.height + vis.margin.top + 45)
            .attr("r", 5)
            .attr("fill", d => vis.colorScale(d));
        vis.legendGroup.selectAll("text")
            .data(vis.brands)
            .enter()
            .append("text")
            .attr("x", (d,i) => -vis.margin.left + 20 + i * 50)
            .attr("y", vis.height + vis.margin.top + 50)
            .attr("r", 5)
            .text(d => d)
            .style("font-size", "10px")

        // Initialize scales
        vis.xScale = d3.scaleLinear().range([0, vis.width - vis.margin.left]);
        vis.yScale = d3.scaleLinear().range([vis.height, 0]);
        vis.sizeScale = d3.scaleLinear().range([2,5]);

        // Add axis groups
        vis.xAxisGroup = vis.chartGroup.append("g")
            .attr("transform", `translate(0,${vis.height})`);

        vis.yAxisGroup = vis.chartGroup.append("g");

        // add title
        vis.svg.append("text")
            .attr("x", (vis.width + vis.margin.left + vis.margin.right) / 2)
            .attr("y", vis.margin.top / 4)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text("What Brands Are Growing the Fastest?");

        // Add axis labels
        vis.chartGroup.append("text")
            .attr("x", (vis.width - vis.margin.left) / 2)
            .attr("y", vis.height + vis.margin.top + 45)
            .attr("text-anchor", "middle")
            .text("Year");

        vis.chartGroup.append("text")
            .attr("x", -vis.height / 2)
            .attr("y", -vis.margin.left + 10)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .text("Annual Growth Rate");

        // Load data from the specified paths
        vis.loadData();
    }

    loadData() {
        const vis = this;

        // parse date from the data
        const parseDate = d3.timeParse("%Y Q%q");
        const parseRevenue = value => +value.replace(/,/g, "");

        d3.csv(vis.dataPath).then(data => {
            vis.data = [];
            data.forEach(row => {
                const date = parseDate(row.Date);
                vis.data.push(
                    { date, company: "MC", value: parseRevenue(row["MC-Total Revenue (FQ)($)"]) },
                    { date, company: "TJX", value: parseRevenue(row["TJX-Total Revenue (FQ)($)"]) },
                    { date, company: "LULU", value: parseRevenue(row["LULU-Total Revenue (FQ)($)"]) },
                    { date, company: "GAP", value: parseRevenue(row["GAP-Total Revenue (FQ)($)"]) }
                );
            });


        // separate out each company's data
        vis.lvmhData = []
        vis.tjxData = []
        vis.luluData = []
        vis.gapData = []

        vis.sortedData = vis.data.sort((a,b) => a.date - b.date)

        vis.sortedData.forEach(row => {
            if (row["company"] === "MC") {
                vis.lvmhData.push(row);
            }
            else if (row["company"] === "TJX") {
                vis.tjxData.push(row);
            }
            else if (row["company"] === "LULU") {
                vis.luluData.push(row);
            }
            else {
                vis.gapData.push(row);
            }
        });

        // separate out each company's growth rates
        vis.lvmhRates = []
        vis.tjxRates = []
        vis.luluRates = []
        vis.gapRates = []

        // calculate and push annual growth rates measured on jan 1
        for (let i = 4; i < vis.lvmhData.length; i = i+4) {
            vis.lvmhRates.push({
                company: "LVMH",
                date: vis.lvmhData[i].date,
                rate: vis.lvmhData[i].value / vis.lvmhData[i-4].value - 1
            })
            vis.tjxRates.push({
                company: "TJX",
                date: vis.tjxData[i].date,
                rate: vis.tjxData[i].value / vis.tjxData[i-4].value - 1
            })
            vis.luluRates.push({
                company: "LULU",
                date: vis.luluData[i].date,
                rate: vis.luluData[i].value / vis.luluData[i-4].value - 1
            })
            vis.gapRates.push({
                company: "GAP",
                date: vis.gapData[i].date,
                rate: vis.gapData[i].value / vis.gapData[i-4].value - 1
            })

        }

        // combine all companies' data to one list
        vis.allRates = vis.lvmhRates.concat(vis.tjxRates, vis.luluRates, vis.gapRates)

        vis.updateVis();
        }).catch(error => {
            console.error("Error loading data:", error);
        });

    }


    updateVis() {
        const vis = this;

        // set domains of scales
        vis.minY = d3.min(vis.allRates, d => d.rate)
        vis.maxY = d3.max(vis.allRates, d => d.rate)

        vis.minX = (d3.min(vis.allRates, d => d.date));
        vis.maxX = (d3.max(vis.allRates, d => d.date));

        vis.xScale.domain([vis.minX, vis.maxX])
        vis.yScale.domain([vis.minY, vis.maxY])
        vis.sizeScale.domain([vis.minY, vis.maxY])


        // create custom tickValues which are just the years
        vis.customTickValues = []

        vis.lvmhRates.forEach( row => {
            vis.customTickValues.push(row.date)
        })

        // Render the axes
        vis.xAxisGroup.call(d3.axisBottom(vis.xScale)
            .tickValues(vis.customTickValues)
            .tickFormat(d3.timeFormat("%Y")))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        vis.yAxisGroup.call(d3.axisLeft(vis.yScale)
            .tickFormat(d3.format(".0%")));

        // show chart and render the data points
        vis.chartGroup.selectAll(".dot").remove(); // Clear old points if present
        vis.chartGroup.selectAll(".dot")
            .data(vis.allRates)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => vis.xScale(d.date))
            .attr("cy", d => vis.yScale(d.rate))
            .attr("r", d => vis.sizeScale(d.rate))
            .attr("fill", d => vis.colorScale(d.company))

    }
}
