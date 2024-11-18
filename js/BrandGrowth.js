class BrandGrowth {
    constructor(parentElement) {
        this.parentElement = parentElement;
        console.log("Initializing Brand Growth Vis...");
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

        // parse date from the data
        const parseDate = d3.timeParse("%Y Q%q");
        const parseRevenue = value => +value.replace(/,/g, "");

        d3.csv(vis.dataPath).then(data => {
            vis.data = [];
            data.forEach(row => {
                const date = parseDate(row.Date);
                vis.data.push(
                    { date, company: "MC", value: parseRevenue(row["MC.Revenue"]) },
                    { date, company: "TJX", value: parseRevenue(row["TJX.Revenue"]) },
                    { date, company: "LULU", value: parseRevenue(row["LULU.Revenue"]) },
                    { date, company: "GAP", value: parseRevenue(row["GAP.Revenue"]) }
                );
            });

        console.log(vis.data)
        vis.updateVis();
        }).catch(error => {
            console.error("Error loading data:", error);
        });


    }


    updateVis() {
        const vis = this;
    }
}
