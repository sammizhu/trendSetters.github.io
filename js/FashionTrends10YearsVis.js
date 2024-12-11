class FashionTrends10YearsVis {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;
        this.initVis();
    }

    initVis() {
        const vis = this;
        vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        vis.width = 600 - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select(vis.parentElement)
            .append("svg")
            .attr("class", "fashion-trends-10-years-svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left},${vis.margin.top})`);

        vis.tooltip = d3.select(vis.parentElement)
            .append("div")
            .attr("class", "fashion-tooltip");

        vis.updateVis();
    }

    updateVis() {
        const vis = this;
        const cols = 3;
        const cardWidth = 160;
        const cardHeight = 80;
        const cardPadding = 20;
        const cardAreaY = 70;

        const cards = vis.svg.selectAll(".fashion-trend-card")
            .data(vis.data, d => d.name);

        const cardEnter = cards.enter()
            .append("g")
            .attr("class", "fashion-trend-card")
            .attr("transform", (d, i) => {
                const x = (i % cols) * (cardWidth + cardPadding);
                const y = cardAreaY + Math.floor(i / cols) * (cardHeight + cardPadding);
                return `translate(${x}, ${y})`;
            });

        cardEnter.append("rect")
            .attr("width", cardWidth)
            .attr("height", cardHeight)
            .attr("fill", "#ffe6e6")
            .attr("rx", 10)
            .attr("ry", 10)
            .style("cursor", "pointer")
            .on("click", (event, d) => {
                d3.select("#fashion-info-box h2").text(d.name);
                d3.select("#fashion-info-box p").text(d.detailedInfo || "More information coming soon!");
            });

        cardEnter.append("text")
            .attr("x", cardWidth / 2)
            .attr("y", cardHeight / 2)
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
        detailedInfo: "The pandemic led to a sharp decline in physical retail sales due to widespread store closures. However, e-commerce saw an unprecedented surge as consumers shifted to online shopping. Categories like athleisure and loungewear experienced strong growth, while demand for formalwear plummeted."
    },
    {
        name: "Luxury Revival",
        description: "Surge in premium purchases post-pandemic.",
        detailedInfo: "Post-pandemic, pent-up demand led to a strong rebound in luxury sales. Affluent consumers spent on high-end goods as a form of indulgence and to celebrate the return to normalcy. The trend was driven by increased spending on handbags, jewelry, and premium clothing as in-person events resumed. This revival boosted revenue for the luxury sector significantly."
    },
    {
        name: "Eco-Conscious Buying",
        description: "Eco-awareness shaping buying decisions.",
        detailedInfo: "The growing awareness of environmental issues has pushed consumers to prioritize sustainability in their purchases. This has led to increased demand for eco-friendly materials, second-hand clothing, and brands that demonstrate transparency in their supply chains. Sales of sustainable fashion have grown, though often at a premium price point."
    },
    {
        name: "Rise of AI Trends",
        description: "AI influencing design and personalization.",
        detailedInfo: "AI has transformed the shopping experience by enabling personalized recommendations and predicting consumer trends. Brands that have integrated AI into their operations have seen improved sales efficiency and customer satisfaction. AI also facilitates dynamic pricing and trend forecasting."
    },
    {
        name: "Inclusive Fashion",
        description: "Embracing diversity in fashion.",
        detailedInfo: "The emphasis on inclusivity has broadened the appeal of many fashion brands, leading to increased sales among underrepresented groups. Expanded size ranges, gender-neutral clothing, and diverse marketing campaigns have driven higher engagement and conversions. This shift has particularly resonated with younger consumers."
    },
    {
        name: "Fast Fashion Critique",
        description: "Growing awareness of fast fashion's impact.",
        detailedInfo: "Criticism of fast fashion has led to a relative decline in sales for some low-cost, high-volume retailers. It has also driven growth for sustainable alternatives and brands emphasizing quality and longevity. Consumers are increasingly willing to spend more on durable items and support brands that align with their ethical values, reshaping demand within the industry."
    }
];

document.addEventListener("DOMContentLoaded", () => {
    const parentElement = "#fashion-trends-10-years-vis";
    const fashionVis10Years = new FashionTrends10YearsVis(parentElement, fashionData10Years);
});
