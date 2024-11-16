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

        // set up the margins
        vis.margin = { top: 30, right: 120, bottom: 40, left: 120 };
        vis.width = 800 - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

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
            .text("Revenue by Quarter for MC, TJX, LULU, and GAP");

        vis.lineGenerator = d3.line()
            .x(d => vis.xScale(d.date))
            .y(d => vis.yScale(d.value));

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

            vis.updateVis();
        });
    }

    updateVis() {
        const vis = this;

        const nestedData = d3.group(vis.data, d => d.company);

        vis.xScale.domain(d3.extent(vis.data, d => d.date));
        vis.yScale.domain([0, d3.max(vis.data, d => d.value)]);

        vis.xAxisGroup.call(d3.axisBottom(vis.xScale).tickFormat(d3.timeFormat("%Y-Q%q")));

        vis.xAxisGroup.selectAll("text")
            .attr("transform", "rotate(-45)") // rotate the x axis so it looks better
            .style("text-anchor", "end");
        vis.yAxisGroup.call(d3.axisLeft(vis.yScale));

        const companies = vis.svg.selectAll(".line-group")
            .data(nestedData, d => d[0]); // company name

        companies.enter()
            .append("path")
            .attr("class", "line-group")
            .merge(companies)
            .attr("fill", "none")
            .attr("stroke", d => vis.colorScale(d[0]))
            .attr("stroke-width", 2)
            .attr("d", ([company, values]) => vis.lineGenerator(values));

        companies.exit().remove();

        // add the cute legend
        const legend = vis.svg.selectAll(".legend")
            .data(Array.from(nestedData.keys()));

        const legendGroup = legend.enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(${vis.width + 20}, ${i * 25})`);

        legendGroup.append("rect")
            .attr("x", 0)
            .attr("y", -10)
            .attr("width", 15)
            .attr("height", 15)
            .attr("fill", d => vis.colorScale(d));

        legendGroup.append("text")
            .attr("x", 20)
            .attr("y", 0)
            .attr("dy", "0.35em")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text(d => d);

        legend.exit().remove();
    }
}
