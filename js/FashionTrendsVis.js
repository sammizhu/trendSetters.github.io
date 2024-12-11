// fashion trends vis for page 2
class FashionTrendsVis {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;

        this.initVis();
    }

    initVis() {
        const vis = this;

        vis.margin = { top: 20, right: 20, bottom: 20, left: 20 };
        vis.width = 700 - vis.margin.left - vis.margin.right;
        vis.height = 450 - vis.margin.top - vis.margin.bottom;

        vis.svg = d3.select(vis.parentElement)
            .append("svg")
            .attr("class", "fashion-trends-svg")
            .attr("width", vis.width + vis.margin.left + vis.margin.right)
            .attr("height", vis.height + vis.margin.top + vis.margin.bottom)
            .append("g")
            .attr("transform", `translate(${vis.margin.left}, ${vis.margin.top})`);

        vis.svg.append("text")
            .attr("class", "fashion-title")
            .attr("x", vis.width / 2)
            .attr("y", -40)
            .attr("text-anchor", "middle")
            .style("fill", "#FB9AAC")
            .text("Influential Trends in Fashion");



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
                const x = (i % cols) * 200;
                const y = Math.floor(i / cols) * 220;
                return `translate(${x}, ${y})`;
            });

        cardEnter.append("image")
            .attr("xlink:href", d => `../images/icons/${d.image}.png`)
            .attr("width", 180)
            .attr("height", 120)
            .style("cursor", "pointer")
            .on("mouseover",function (event, d) {
                d3.select(this)
                    .attr("xlink:href", `../images/icons/${d.hoverImage}.png`);
            })
            .on("mouseout", function (event, d) {
                d3.select(this)
                    .attr("xlink:href", `../images/icons/${d.image}.png`);
            })
            .on("click", (event, d) => {
                vis.svg.selectAll(".fashion-trend-card image")
                    .classed("selected", false);

                d3.select(event.currentTarget)
                    .classed("selected", true);

                d3.select("#fashion-info-box h2")
                    .text(d.name)
                    .attr("title", d.name); // Add a tooltip for truncated text

                d3.select("#fashion-info-text")
                    .text(d.detailedInfo || "More information coming soon!")
                    .attr("title", d.detailedInfo); // Add tooltip for overflow content
            });

        cardEnter.append("text")
            .attr("x", 90)
            .attr("y", 150)
            .attr("text-anchor", "middle")
            .attr("alignment-baseline", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .text(d => d.name)
            .style("pointer-events", "none");


        cards.exit().remove();
        d3.select("#fashion-info-box")
            .style("margin-top", "-50px")
            .style("padding-top", "20px");
    }

}

const fashionData = [
    {
        name: "Streetwear Revolution",
        image: "2",
        hoverImage: "3",
        description: "Streetwear has reshaped the fashion industry with its blend of casual and luxury.",
        detailedInfo: "Streetwear Revolution: Streetwear has grown extensively from a niche style to a big global trend. It combines comfort, functionality, and style, often incorporating elements from skate culture, hip-hop, and high fashion. There have been an increasing number of streetwear and luxury collaborations."
    },
    {
        name: "Sustainability",
        image: "6",
        hoverImage: "7",
        description: "The focus on eco-friendly materials and ethical production has become a central theme.",
        detailedInfo: "Sustainability: Consumers have become more aware of their environmental impact, and with that the fashion industry is prioritizing sustainable practices. For the companies, it involves using organic and recycled materials, reducing waste through innovative manufacturing processes, and ensuring fair labor practices. Brands have used transparency around their supply chains and carbon footprint as marketing tools."
    },
    {
        name: "Digital Runways",
        image: "14",
        hoverImage: "15",
        description: "Virtual fashion shows during the pandemic showcased innovation in digital fashion.",
        detailedInfo: "Digital Runways: The pandemic accelerated the adoption of digital platforms for fashion shows. These Virtual runways allow designers to efficiently reach global markets. Augmented reality (AR) and virtual reality (VR) technologies are being used to create immersive experiences, helping consumers shop and admire from the comfort of their own home."
    },
    {
        name: "Athleisure Boom",
        image: "8",
        hoverImage: "9",
        description: "Activewear became a dominant category blending comfort with style.",
        detailedInfo: "Athleisure Boom: Athleisure is a combination athletic wear with everyday clothing, and it continues to dominate the fashion world. This trend is grounded in versatility, allowing pieces to transition from workouts to casual outings. Athleisure provides enhanced comfort and performance, making it a practical but flattering style."
    },
    {
        name: "Gender-Neutral Fashion",
        image: "10",
        hoverImage: "11",
        description: "Breaking barriers with designs that defy traditional gender norms.",
        detailedInfo: "Gender-Neutral Fashion: This trend challenges the traditional binary notions of gender in clothing. Designers have started creating more inclusive and accessible clothes, regardless of gender identity. This approach promotes diversity and self-expression, with unisex silhouettes, neutral color palettes, and versatile pieces becoming increasingly popular."
    },
    {
        name: "Fast Fashion Critique",
        image: "4",
        hoverImage: "5",
        description: "Growing awareness about the environmental and ethical impact of fast fashion.",
        detailedInfo: "Fast Fashion Critique: The fast fashion industry is based upon cheap labor and high quantity. It has faced scrutiny for its environmental impact and unethical labor practices. Consumers are demanding more transparency and accountability from brands, shifting the emphasis on quality, longevity, and sustainability. Brands are investing in circular fashion models and exploring ways to minimize waste."
    }
];


document.addEventListener('DOMContentLoaded', () => {
    const parentElement = "#fashion-trends-vis";
    const fashionVis = new FashionTrendsVis(parentElement, fashionData);
});
