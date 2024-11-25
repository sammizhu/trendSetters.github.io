class FashionTrends10YearsVis {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;

        this.initVis();
    }

    initVis() {
        const vis = this;
        // SVG set up
        vis.margin = { top: 40, right: 20, bottom: 20, left: 20 };
        vis.width = 600 - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;
        vis.svg = d3.select(vis.parentElement)
            .append("svg")
            .attr("class", "fashion-trends-10-years-svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        vis.svg.append("text")
            .attr("class", "fashion-title")
            .attr("x", vis.width / 2)
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")

        vis.tooltip = d3.select(vis.parentElement)
            .append("div")
            .attr("class", "fashion-tooltip");

        vis.updateVis();
    }

    updateVis() {
        const vis = this;

        const cards = vis.svg.selectAll(".fashion-trend-card")
            .data(vis.data, d => d.name);

        const cardEnter = cards.enter()
            .append("g")
            .attr("class", "fashion-trend-card")
            .attr("transform", (d, i) => {
                const cols = 3;
                const x = (i % cols) * 180;
                const y = Math.floor(i / cols) * 120;
                return `translate(${x}, ${y})`;
            });

        cardEnter.append("rect")
            .attr("width", 160)
            .attr("height", 80)
            .attr("fill", "#ffe6e6")
            .attr("rx", 10)
            .attr("ry", 10)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                console.log(`Clicked on: ${d.name}`);
                console.log(`Detailed Info: ${d.detailedInfo}`);
                vis.svg.selectAll(".fashion-trend-card rect")
                    .classed("selected", false);

                d3.select(event.currentTarget)
                    .classed("selected", true);

                d3.select("#fashion-info-text").text(d.detailedInfo || "More information coming soon!");
            });

        cardEnter.append("text")
            .attr("x", 80)
            .attr("y", 45)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "14px")
            .style("font-weight", "bold")
            .text(d => d.name)
            .style("pointer-events", "none");

        cards.exit().remove();
    }
}

const fashionData10Years = [
    {
        name: "Pandemic Impact",
        description: "Reshaped sales and online dominance.",
        detailedInfo: "The pandemic drastically shifted consumer behavior, increasing reliance on online platforms and affecting traditional brick-and-mortar sales. Many brands innovated with digital-first strategies."
    },
    {
        name: "Luxury Revival",
        description: "Surge in premium purchases post-pandemic.",
        detailedInfo: "Luxury goods saw a revival post-pandemic, with consumers splurging on high-end items as a form of indulgence and status symbol."
    },
    {
        name: "Eco-Conscious Buying",
        description: "Eco-awareness shaping buying decisions.",
        detailedInfo: "Environmental concerns have led to a significant increase in demand for sustainable fashion, with brands focusing on eco-friendly materials."
    },
    {
        name: "Rise of AI Trends",
        description: "AI influencing design and personalization.",
        detailedInfo: "Artificial intelligence is playing a pivotal role in trend forecasting, personalizing shopping experiences, and enabling efficient supply chains."
    },
    {
        name: "Inclusive Fashion",
        description: "Embracing diversity in fashion.",
        detailedInfo: "The fashion industry has made strides in inclusivity, with a focus on diverse body types, cultural representation, and gender-neutral collections."
    },
    {
        name: "Fast Fashion Critique",
        description: "Growing awareness of fast fashion's impact.",
        detailedInfo: "Fast fashion faces increasing criticism for environmental and ethical concerns. Consumers are demanding transparency and accountability from brands, encouraging a shift toward sustainable practices and slow fashion."
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const parentElement = "#fashion-trends-10-years-vis";
    const fashionVis10Years = new FashionTrends10YearsVis(parentElement, fashionData10Years);
});
