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
            .style("fill", "#D63484")
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
            .on("click", (event, d) =>{
                vis.svg.selectAll(".fashion-trend-card image")
                    .classed("selected", false);

                d3.select(event.currentTarget)
                    .classed("selected", true);

                d3.select("#fashion-info-box h2").text(d.name);
                d3.select("#fashion-info-text").text(d.detailedInfo||"More information coming soon!");
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
        detailedInfo: "Streetwear Revolution: Streetwear has grown from niche urban fashion to a global phenomenon. It blends comfort, functionality, and style, often incorporating elements from skate culture, hip-hop, and high fashion. Collaborations between streetwear brands and luxury designers have further propelled its popularity."
    },
    {
        name: "Sustainability",
        image: "6",
        hoverImage: "7",
        description: "The focus on eco-friendly materials and ethical production has become a central theme.",
        detailedInfo: "Sustainability: As consumers become more environmentally conscious, the fashion industry is prioritizing sustainable practices. This includes using organic and recycled materials, reducing waste through innovative manufacturing processes, and ensuring fair labor practices. Brands are increasingly transparent about their supply chains and are committed to reducing their carbon footprint."
    },
    {
        name: "Digital Runways",
        image: "14",
        hoverImage: "15",
        description: "Virtual fashion shows during the pandemic showcased innovation in digital fashion.",
        detailedInfo: "Digital Runways: The pandemic accelerated the adoption of digital platforms for fashion shows. Virtual runways allow designers to reach a global audience without the constraints of physical venues. Augmented reality (AR) and virtual reality (VR) technologies are being used to create immersive experiences, while digital-only fashion is emerging as a new trend in the metaverse."
    },
    {
        name: "Athleisure Boom",
        image: "8",
        hoverImage: "9",
        description: "Activewear became a dominant category blending comfort with style.",
        detailedInfo: "Athleisure Boom: Athleisure continues to dominate the fashion scene by seamlessly blending athletic wear with everyday clothing. This trend emphasizes versatility, allowing pieces to transition from workouts to casual outings. Innovations in fabric technology provide enhanced comfort and performance, making athleisure a staple in modern wardrobes."
    },
    {
        name: "Gender-Neutral Fashion",
        image: "10",
        hoverImage: "11",
        description: "Breaking barriers with designs that defy traditional gender norms.",
        detailedInfo: "Gender-Neutral Fashion: This trend challenges the traditional binary notions of gender in clothing. Designers are creating collections that are inclusive and accessible to all, regardless of gender identity. This approach promotes diversity and self-expression, with unisex silhouettes, neutral color palettes, and versatile pieces becoming increasingly popular."
    },
    {
        name: "Fast Fashion Critique",
        image: "4",
        hoverImage: "5",
        description: "Growing awareness about the environmental and ethical impact of fast fashion.",
        detailedInfo: "Fast Fashion Critique: The fast fashion industry faces increasing scrutiny for its environmental impact and unethical labor practices. Consumers are demanding more transparency and accountability from brands. As a result, there is a shift towards slow fashion, which emphasizes quality, longevity, and sustainability. Brands are investing in circular fashion models and exploring ways to minimize waste."
    }
];


document.addEventListener('DOMContentLoaded', () => {
    const parentElement = "#fashion-trends-vis";
    const fashionVis = new FashionTrendsVis(parentElement, fashionData);
});
