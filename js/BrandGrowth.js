// This class displays the Brand Growth Visualization on the bottom of the fourth page on the right side

class BrandGrowth {
    constructor({parentElement, data}) {
        // set up
        this.parentElement = parentElement;
        this.dataPath = data;
        this.initVis();
        this.minX;
    }

    initVis() {
        const vis = this;

        // color scale
        vis.colorScale = d3.scaleOrdinal()
            .domain(["LVMH", "TJX", "LULU", "GAP"])
            .range(["#ffb3b3", "#CE93D8", "#B39EB5", "#FF6961"]);

        // Set up margins and dimensions
        vis.margin = { top: 30, right: 50, bottom: 100, left: 50 };
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

        vis.visualWidth = vis.width

        // Append the SVG element
        vis.svg = d3
            .select(vis.parentElement)
            .append("svg")
            .attr("width", vis.visualWidth + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        // initialize chart group
        vis.chartGroup = vis.svg.append("g")

        // initialize legend
        vis.legendGroup = vis.svg.append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

        // form legend to appear at bottom
        vis.brands = ["LVMH", "TJX", "LULU", "GAP"]
        vis.legendGroup.selectAll(".dot").remove();
        // show colored circles
        vis.legendGroup.selectAll(".dot")
            .data(vis.brands)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", (d,i) => -vis.margin.left + 10 + i * 50)
            .attr("cy", vis.height + vis.margin.top - 15)
            .attr("r", 5)
            .attr("fill", d => vis.colorScale(d));
        // show text
        vis.legendGroup.selectAll("text")
            .data(vis.brands)
            .enter()
            .append("text")
            .attr("x", (d,i) => -vis.margin.left + 20 + i * 50)
            .attr("y", vis.height + vis.margin.top - 10)
            .attr("r", 5)
            .text(d => d)
            .style("font-size", "10px")

        // Initialize scales
        vis.xScale = d3.scaleLinear().range([0, vis.visualWidth - vis.margin.left]);
        vis.yScale = d3.scaleLinear().range([vis.height, 0]);
        vis.sizeScale = d3.scaleLinear().range([2,5]);

        // Add axis groups
        vis.xAxisGroup = vis.chartGroup.append("g")
            .attr("transform", `translate(0,${vis.height})`);

        vis.yAxisGroup = vis.chartGroup.append("g");

        // add title
        vis.svg.append("text")
            .attr("x", vis.width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .attr("class", "chart-title")
            .text("What Brands Are Growing the Fastest? (click me!)");

        // Add axis labels
        vis.chartGroup.append("text")
            .attr("x", (vis.visualWidth - vis.margin.left) / 2)
            .attr("y", vis.height + vis.margin.top + 20)
            .attr("text-anchor", "middle")
            .text("Year");

        vis.chartGroup.append("text")
            .attr("x", -vis.height / 2)
            .attr("y", -vis.margin.left + 10)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .style("font-size", "14px")
            .text("Annual Growth Rate");

        // parse date from the data
        vis.parseDate = d3.timeParse("%Y Q%q");

        // Load data from the specified paths
        vis.loadData(vis.parseDate("2011 Q1"), vis.parseDate("2022 Q4"));

    }

    loadData(xMin, xMax) {
        const vis = this;

        // helper function that parses the revenue data from the csv file
        const parseRevenue = value => +value.replace(/,/g, "");

        // extract data from csv for each brand
        d3.csv(vis.dataPath).then(data => {
            vis.data = [];
            data.forEach(row => {
                const date = vis.parseDate(row.Date);
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

        // sort the data by date and put each company's data in its own array
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


        // set the date for minimum possible year
        let date = 2011

        // calculate and push annual growth rates
        for (let i = 4; i < vis.lvmhData.length; i = i+4) {
            // sum up all quarters of this year
            let thisYearLV = vis.lvmhData[i].value + vis.lvmhData[i+1].value + vis.lvmhData[i+2].value + vis.lvmhData[i+3].value
            // sum up all quarters of last year
            let prevYearLV = vis.lvmhData[i-1].value + vis.lvmhData[i-2].value + vis.lvmhData[i-3].value + vis.lvmhData[i-4].value
            // arbitrarily set the date so that the year is correct
            let setDate = new Date(`${date}-9-30`)
            // increment year
            date += 1
            // push information into array
            vis.lvmhRates.push({
                company: "LVMH",
                date: setDate,
                rate: thisYearLV / prevYearLV - 1,
                prevRev: prevYearLV,
                nowRev: thisYearLV,
            })
            // for TJX
            let thisYearTJX = vis.tjxData[i].value + vis.tjxData[i+1].value + vis.tjxData[i+2].value + vis.tjxData[i+3].value
            let prevYearTJX = vis.tjxData[i-4].value + vis.tjxData[i-1].value + vis.tjxData[i-2].value + vis.tjxData[i-3].value
            vis.tjxRates.push({
                company: "TJX",
                date: setDate,
                rate: thisYearTJX / prevYearTJX - 1,
                prevRev: prevYearTJX,
                nowRev: thisYearTJX,
            })
            // for LULU
            let thisYearLU = vis.luluData[i].value + vis.luluData[i+1].value + vis.luluData[i+2].value + vis.luluData[i+3].value
            let prevYearLU = vis.luluData[i-4].value + vis.luluData[i-1].value + vis.luluData[i-2].value + vis.luluData[i-3].value
            vis.luluRates.push({
                company: "LULU",
                date: setDate,
                rate: thisYearLU / prevYearLU - 1,
                prevRev: prevYearLU,
                nowRev: thisYearLU,
            })
            // for GAP
            let thisYearGAP = vis.gapData[i].value + vis.gapData[i+1].value + vis.gapData[i+2].value + vis.gapData[i+3].value
            let prevYearGAP = vis.gapData[i-4].value + vis.gapData[i-1].value + vis.gapData[i-2].value + vis.gapData[i-3].value
            vis.gapRates.push({
                company: "GAP",
                date: setDate,
                rate: thisYearGAP / prevYearGAP - 1,
                prevRev: prevYearGAP,
                nowRev: thisYearGAP,
            })

        }

        // combine all companies' data to one list
        vis.allRates = vis.lvmhRates.concat(vis.tjxRates, vis.luluRates, vis.gapRates)

        // set domains of scales
        vis.minY = d3.min(vis.allRates, d => d.rate)
        vis.maxY = d3.max(vis.allRates, d => d.rate)

        // round the dates so no extra is displayed
        vis.minX = xMin;
        if (vis.parseDate("2022 Q4") < xMax) {
            vis.maxX = vis.parseDate("2022 Q4");
        }
        else {
            vis.maxX = xMax;
        }

        // set domains of x scale based off min and max date
        vis.xScale.domain([vis.minX, vis.maxX])

        // filter data
        vis.filteredData = vis.allRates.filter(d => d.date >= vis.minX && d.date <= vis.maxX)
        console.log(vis.filteredData)

        vis.updateVis();
        }).catch(error => {
            console.error("Error loading data:", error);
        });

    }

    // update visualization
    updateVis() {
        const vis = this;

        // set y scale domain and size of circles' domain
        vis.yScale.domain([vis.minY, vis.maxY])
        vis.sizeScale.domain([vis.minY, vis.maxY])

        // create custom tickValues which are just the years
        vis.customTickValues = []

        // use the dates from this array to display on tick marks
        vis.lvmhRates.forEach( row => {
            if (row.date >= vis.minX && row.date <= vis.maxX) {
                vis.customTickValues.push(row.date)
            }
        })

        // Render the axes
        vis.xAxis = d3.axisBottom(vis.xScale)
            .tickValues(vis.customTickValues)
            .tickFormat(d3.timeFormat("%Y"));
        vis.xAxisGroup
            .transition()
            .duration(500)
            .call(vis.xAxis);
        vis.xAxisGroup.selectAll(".tick")
            .data(vis.customTickValues, d => d)
            .exit()
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove();
        vis.xAxisGroup.selectAll(".tick text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        vis.yAxisGroup.call(d3.axisLeft(vis.yScale)
            .tickFormat(d3.format(".0%")));

        // show chart and render the data points
        vis.chartGroup.selectAll(".dot").remove();
        vis.chartGroup.selectAll(".dot")
            .data(vis.filteredData)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", d => vis.xScale(d.date))
            .attr("cy", d => vis.yScale(d.rate))
            .style("pointer-events", "all")
            // on click update the bottom text to give more information
            .on("click", function (event, d) {
                let formatDate = d3.timeFormat("%Y");
                let formatRate = d3.format(".0%")
                function formatBills(number) {
                    const billions = number / 1e9;
                    return d3.format(".1f")(billions) + "B";
                }
                document.getElementById("explanation").innerHTML = `In ${formatDate(d.date)}, ${d.company} grew ${formatRate(d.rate)}. Last year, ${d.company} reported total revenue of $${formatBills(d.prevRev)}. This year, ${d.company} reported total revenue of $${formatBills(d.nowRev)}`
            })
            // highlight hovered over rates
            .on("mouseover", function (event, d) {
                d3.select(this)
                    .style("stroke", "#63BA6E")
                    .style("stroke-width", 2);
            })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .style("stroke-width", 0);
            })
            .transition()
            .duration(500)
            .attr("r", d => vis.sizeScale(d.rate))
            .attr("fill", d => vis.colorScale(d.company))

        vis.chartGroup.selectAll(".dot")
            .data(vis.filteredData)
            .exit()
            .remove();
    }
}
