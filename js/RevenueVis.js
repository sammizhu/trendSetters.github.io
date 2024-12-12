// This class displays the Revenue Visualization on the top of the fourth page on the right side

class RevenueVis {
    constructor({ parentElement, dataPath }) {
        this.parentElement = parentElement;
        this.dataPath = dataPath;
        this.initVis();
    }

    initVis() {
        const vis = this;

        // set up scale to show different colors for different lines
        vis.colorScale = d3.scaleOrdinal()
            .domain(["MC", "TJX", "LULU", "GAP"])
            .range(["#ffb3b3", "#CE93D8", "#B39EB5", "#FF6961"]);

        // set up the margins
        vis.margin = { top: 30, right: 50, bottom: 100, left: 50 };
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 300 - vis.margin.top - vis.margin.bottom;

        // set up the canvas
        vis.svg = d3
            .select(vis.parentElement)
            .append("svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        // set up scales for axes
        vis.xScale = d3.scaleTime().range([0, vis.width - vis.margin.left]);
        vis.yScale = d3.scaleLinear().range([vis.height, 0]);

        // set up groups for axes
        vis.xAxisGroup = vis.svg.append("g").attr("transform", `translate(0, ${vis.height})`);
        vis.yAxisGroup = vis.svg.append("g");

        // add chart title
        vis.svg
            .append("text")
            .attr("class", "chart-title")
            .attr("x", vis.width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .text("Revenue by Quarter for Brands (hover over me!)");

        // y-axis label
        vis.svg.append("text")
            .attr("x", -vis.height / 2)
            .attr("y", -vis.margin.left + 10)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90)")
            .style("font-size", "14px")
            .text("Revenue per Quarter");

        // x-axis label
        vis.svg.append("text")
            .attr("x", (vis.width - vis.margin.left) / 2)
            .attr("y", vis.height + vis.margin.top + 35)
            .attr("text-anchor", "middle")
            .text("Quarter of the Year");

        // create line
        vis.lineGenerator = d3.line()
            .x(d => vis.xScale(d.date))
            .y(d => vis.yScale(d.value));

        // vertical tool tip group
        vis.toolGroup = vis.svg.append("g")
            .style("display","none")
            .attr("class", "mytooltip")

        // create the line of the tooltip
        vis.tooltip = vis.toolGroup.append("line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", vis.height)
            .attr("stroke", "#63B6AE")
            .attr("stroke-width", 3)
            .style("opacity", 1)

        // parse date from the data
        vis.parseDate = d3.timeParse("%Y Q%q");
        vis.loadData(vis.parseDate("2011 Q1"), vis.parseDate("2023 Q1"));

        // initialize legend
        vis.legendGroup = vis.svg.append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

        // form legend to appear at bottom
        vis.brands = ["LVMH", "TJX", "LULU", "GAP"]
        vis.legendGroup.selectAll(".dot").remove();
        // create colored circles
        vis.legendGroup.selectAll(".dot")
            .data(vis.brands)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("cx", (d,i) => -vis.margin.left + 10 + i * 50)
            .attr("cy", vis.height + vis.margin.top - 5)
            .attr("r", 5)
            .attr("fill", d => vis.colorScale(d));
        // create text next to circles
        vis.legendGroup.selectAll("text")
            .data(vis.brands)
            .enter()
            .append("text")
            .attr("x", (d,i) => -vis.margin.left + 20 + i * 50)
            .attr("y", vis.height + vis.margin.top)
            .attr("r", 5)
            .text(d => d)
            .style("font-size", "10px")
    }

    // load data given the time period from slider
    loadData(xMin, xMax) {
        const vis = this;

        // parse date from the data
        const parseRevenue = value => +value.replace(/,/g, "");

        // read csv file and store data
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

            // save min and max values of date
            vis.minX = xMin
            vis.maxX = xMax

            // filter the data based on min and max values of date
            vis.filteredData = vis.data.filter(d => d.date >= vis.minX && d.date <= vis.maxX)
            console.log(vis.filteredData)

            vis.updateVis();
        });
    }

    // update visualization
    updateVis() {
        const vis = this;

        const nestedData = d3.group(vis.filteredData, d => d.company);

        // update scales based on min and max date values
        vis.xScale.domain([vis.minX, vis.maxX]);
        vis.yScale.domain([0, d3.max(vis.filteredData, d => d.value)]);

        // call x axis and format text from ticks
        vis.xAxisGroup
            .transition()
            .duration(500)
            .call(d3.axisBottom(vis.xScale).tickFormat(d3.timeFormat("%Y-Q%q")));

        vis.xAxisGroup.selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // format ticks from y axis
        vis.yaxis = d3.axisLeft(vis.yScale)
            .ticks(8)
            .tickFormat(d => {
                if (d >= 1e9) {
                    return `${(d / 1e9).toFixed(0)}B`;
                } else if (d >= 1e6) {
                    return `${(d / 1e6).toFixed(0)}M`;
                } else {
                    return d;
                }
            });

        // call y axis
        vis.yAxisGroup
            .transition()
            .duration(500)
            .call(vis.yaxis);

        // show companies
        const companies = vis.svg.selectAll(".line-group")
            .data(nestedData, d => d[0]);

        companies.enter()
            .append("path")
            .attr("class", "line-group")
            .merge(companies)
            .transition()
            .duration(500)
            .attr("fill", "none")
            .attr("stroke", d => vis.colorScale(d[0]))
            .attr("stroke-width", 2)
            .attr("d", ([company, values]) => vis.lineGenerator(values));

        companies.exit().remove();

        // remove all existing tooltip elements
        vis.toolGroup.selectAll(".toolcompany").remove();
        vis.toolGroup.selectAll(".toolrect").remove();

        // show rectangle that sits behind the text
        vis.tooltiprect = vis.toolGroup.append("rect")
            .attr("x", 10)
            .attr("y", 20)
            .attr("width", 100)
            .attr("height", 90)
            .attr("class","toolrect")
            .attr("fill", "white")

        vis.tooltiprect.exit().remove();

        // add text to the tooltip group including population and date for each brand
        vis.tooltipLVMH = vis.toolGroup.append("text").data(vis.filteredData)
            .attr("x", 10)
            .attr("y", 40)
            .attr("class", "toolcompany")

        vis.tooltipTJX = vis.toolGroup.append("text").data(vis.filteredData)
            .attr("x", 10)
            .attr("y", 60)
            .attr("class", "toolcompany")

        vis.tooltipGAP = vis.toolGroup.append("text").data(vis.filteredData)
            .attr("x", 10)
            .attr("y", 80)
            .attr("class", "toolcompany")

        vis.tooltipLULU = vis.toolGroup.append("text").data(vis.filteredData)
            .attr("x", 10)
            .attr("y", 100)
            .attr("class", "toolcompany")

        // functions to help with tool tip generation
        vis.bisectDate = d3.bisector(d => d.date).left;
        vis.formatToolTipDate = d3.timeFormat("%B %d %Y");
        vis.formatToolTipPop = d3.format(",");

        // helper function to format revenue
        function formatBills(number) {
            const billions = number / 1e9;
            return d3.format(".1f")(billions) + "B";
        }

        // helper function that rounds a date to the nearest quarter
        function roundDateToQuarter(dateVal) {
            const year = dateVal.getFullYear();
            const month = dateVal.getMonth() + 1;

            const quarterDates = [
                new Date(year, 0, 1),  // January 1
                new Date(year, 3, 1),  // April 1
                new Date(year, 6, 1),  // July 1
                new Date(year, 9, 1)   // October 1
            ];

            // Determine the closest quarter date by checking the month
            if (month < 4) {
                return quarterDates[0];  // Before April, return January 1
            } else if (month < 7) {
                return quarterDates[1];  // Before July, return April 1
            } else if (month < 10) {
                return quarterDates[2];  // Before October, return July 1
            } else {
                return quarterDates[3];  // After October, return October 1
            }
        }

        // helper function that returns the index at which the date is
        function findIndex(dateVal) {
            for (let i = 0; i < vis.filteredData.length; i++) {
                if (vis.filteredData[i].date.getTime() === dateVal.getTime()) {
                    return i;
                }
            }
            return -1;
        }

        vis.toolGroup.raise();

        // function to display the tooltip when mouse moves
        function mousemove(event){
            // show tooltip group
            vis.toolGroup.style("display", "inline")
            // get element by tracking mouse position
            let xPos = d3.pointer(event)[0]
            let dateVal = vis.xScale.invert(xPos)
            // from before
            let index = vis.bisectDate(vis.filteredData, dateVal)
            // actually used to find index using helper function
            let secondIndex = findIndex(roundDateToQuarter(dateVal))
            let lvmhElement = vis.filteredData[secondIndex]
            let tjxElement = vis.filteredData[secondIndex + 1]
            let luluElement = vis.filteredData[secondIndex + 2]
            let gapElement = vis.filteredData[secondIndex + 3]
            // change revenue texts
            vis.tooltipLVMH.text(`LVMH: $${formatBills(lvmhElement.value)}`)
            vis.tooltipTJX.text(`TJX: $${formatBills(tjxElement.value)}`)
            vis.tooltipGAP.text(`GAP: $${formatBills(gapElement.value)}`)
            vis.tooltipLULU.text(`LULU: $${formatBills(luluElement.value)}`)
            // have the tooltip group follow the cursor
            vis.toolGroup.attr("transform", "translate(" + xPos + ",0)")
            // change positioning of text to avoid being cut off by chart border
            if (xPos > 275) {
                vis.tooltiprect.exit().remove();
                vis.tooltipLVMH.attr("transform", "translate(" + -120 + ",0)")
                vis.tooltipTJX.attr("transform", "translate(" + -120 + ",0)")
                vis.tooltipGAP.attr("transform", "translate(" + -120 + ",0)")
                vis.tooltipLULU.attr("transform", "translate(" + -120 + ",0)")
                vis.tooltiprect.attr("transform", "translate(" + -120 + ",0)")
            }
            else {
                vis.tooltiprect.exit().remove();
                vis.tooltipLVMH.attr("transform", "translate(" + 0 + ",0)")
                vis.tooltipTJX.attr("transform", "translate(" + 0 + ",0)")
                vis.tooltipGAP.attr("transform", "translate(" + 0 + ",0)")
                vis.tooltipLULU.attr("transform", "translate(" + 0 + ",0)")
                vis.tooltiprect.attr("transform", "translate(" + 0 + ",0)")
            }
        }

        // create a rectangle to track mouse movements
        vis.rectEvent = vis.svg.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", vis.width-vis.margin.left)
            .attr("height", vis.height)
            .attr("fill", "transparent")
            .style("pointer-events", "all")
            // have tooltip group disappear on mouse out
            .on("mouseout", () => {
                console.log("Mouse out!");
                vis.toolGroup.style("display", "none");
            })
            .on("mousemove", (event) => {
                mousemove(event);
            });
    }

}

