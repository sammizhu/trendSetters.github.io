class RevenueVis {
    constructor({ parentElement, dataPath }) {
        this.parentElement = parentElement;
        this.dataPath = dataPath;
        this.initVis();
    }

    initVis() {
        const vis = this;

        vis.colorScale = d3.scaleOrdinal()
            .domain(["MC", "TJX", "LULU", "GAP"])
            .range(["#AEC6CF", "#FFB347", "#B39EB5", "#FF6961"]);

        // vis.size = document.getElementById(vis.parentElement).getBoundingClientRect();
        console.log(vis.size)

        // set up the margins
        vis.margin = { top: 100, right: 120, bottom: 40, left: 120 };
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3
            .select(vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        vis.xScale = d3.scaleTime().range([0, vis.width]);
        vis.yScale = d3.scaleLinear().range([vis.height, 0]);

        vis.xAxisGroup = vis.svg.append("g").attr("transform", `translate(0, ${vis.height})`);
        vis.yAxisGroup = vis.svg.append("g");

        vis.svg
            .append("text")
            .attr("class", "chart-title")
            .attr("x", vis.width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text("Revenue by Quarter for Brands");

        vis.lineGenerator = d3.line()
            .x(d => vis.xScale(d.date))
            .y(d => vis.yScale(d.value));

        // vertical tool tip group
        vis.toolGroup = vis.svg.append("g")
            .style("display","inline")
            .attr("class", "mytooltip")

        // create the line of the tooltip
        vis.tooltip = vis.toolGroup.append("line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", vis.height)
            .attr("stroke", "red")
            .attr("stroke-width", 3)
            .style("opacity", 1)

        // parse date from the data
        vis.parseDate = d3.timeParse("%Y Q%q");
        vis.loadData(vis.parseDate("2011 Q1"), vis.parseDate("2023 Q4"));
    }

    loadData(xMin, xMax) {
        const vis = this;

        // parse date from the data
        const parseRevenue = value => +value.replace(/,/g, "");

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

            vis.minX = xMin
            vis.maxX = xMax

            vis.filteredData = vis.data.filter(d => d.date >= vis.minX && d.date <= vis.maxX)
            console.log(vis.filteredData)


            vis.updateVis();
        });
    }

    updateVis() {
        const vis = this;

        const nestedData = d3.group(vis.filteredData, d => d.company);

        vis.xScale.domain([vis.minX, vis.maxX]);
        vis.yScale.domain([0, d3.max(vis.filteredData, d => d.value)]);

        vis.xAxisGroup
            .transition()
            .duration(500)
            .call(d3.axisBottom(vis.xScale).tickFormat(d3.timeFormat("%Y-Q%q")));

        vis.xAxisGroup.selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        vis.yAxisGroup
            .transition()
            .duration(500)
            .call(d3.axisLeft(vis.yScale));

        const companies = vis.svg.selectAll(".line-group")
            .data(nestedData, d => d[0]);

        companies.enter()
            .append("path")
            .attr("class", "line-group")
            .merge(companies)
            .attr("fill", "none")
            .attr("stroke", d => vis.colorScale(d[0]))
            .attr("stroke-width", 2)
            .transition()
            .duration(500)
            .attr("d", ([company, values]) => vis.lineGenerator(values));

        companies.exit().remove();


        // add text to the tooltip group including population and date
        vis.tooltipPop = vis.toolGroup.append("text").data(vis.filteredData)
            .attr("x", 10)
            .attr("y", 40)
            .attr("id", "tooltiptext")

        vis.tooltipDate = vis.toolGroup.append("text").data(vis.filteredData)
            .attr("x", 10)
            .attr("y", 60)
            .attr("id", "tooltipdate")

        // functions to help with tool tip generation
        vis.bisectDate = d3.bisector(d => d.date).left;
        vis.formatToolTipDate = d3.timeFormat("%B %d %Y");
        vis.formatToolTipPop = d3.format(",");

        // function to display the tooltip when mouse moves
        function mousemove(event){
            // show tooltip group
            vis.toolGroup.style("display", "inline")
            // get element by tracking mouse position
            let xPos = d3.pointer(event)[0]
            let dateVal = timeScale.invert(xPos)
            let index = bisectDate(data, dateVal)
            let dataElement = vis.filteredData[index]
            console.log(dataElement)
            // change population text
            // vis.tooltipPop.text(formatToolTipPop(dataElement.population))
            // change date text
            // vis.tooltipDate.text(formatToolTipDate(dataElement.date))
            // have the tooltip group follow the cursor
            vis.toolGroup.attr("transform", "translate(" + xPos + ",0)")
            // change positioning of text to avoid being cut off by chart border
            if (xPos > 275) {
                vis.tooltipPop.attr("transform", "translate(" + -170 + ",0)")
                vis.tooltipDate.attr("transform", "translate(" + -170 + ",0)")
            }
            else {
                vis.tooltipPop.attr("transform", "translate(" + 0 + ",0)")
                vis.tooltipDate.attr("transform", "translate(" + 0 + ",0)")
            }
        }

        // create a rectangle to track mouse movements
        vis.rectEvent = vis.svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", vis.width)
            .attr("height", vis.height)
            .attr("fill", "transparent")
            .style("pointer-events", "all")
            .on("mouseout", () => {
                console.log("Mouse out!");
                vis.toolGroup.style("display", "none");
            })
            .on("mousemove", (event) => {
                console.log("Mouse is moving!");
                mousemove(event);
            });
    }
}
//
// document.addEventListener("DOMContentLoaded", () => {
//     const brandRevenue = new RevenueVis({
//         parentElement: "#VisContainer2Top",
//         dataPath: "data/revenue_data.csv"
//     });
// });
