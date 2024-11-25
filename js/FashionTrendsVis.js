class FashionTrendsVis {
    constructor(_parentElement, _data) {
        this.parentElement = _parentElement;
        this.data = _data;

        this.initVis();
    }

    initVis() {
        const vis = this;

        vis.margin = { top: 40, right: 20, bottom: 20, left: 20 };
        vis.width = 600 - vis.margin.left - vis.margin.right;
        vis.height = 400 - vis.margin.top - vis.margin.bottom;

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
            .attr("y", -10)
            .attr("text-anchor", "middle")
            .style("font-size", "18px")
            .style("font-weight", "bold")
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

        // Enter selection
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
            .attr("fill", "#e0e0e0")
            .attr("rx", 10)
            .attr("ry", 10)
            .style("cursor", "pointer")
            .on("mouseover", (event, d) => {
                // Show tooltip
                vis.tooltip
                    .style("display", "block")
                    .html(`<strong>${d.name}</strong><br>${d.description}`)
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
            })
            .on("mousemove", (event) => {
                vis.tooltip
                    .style("left", `${event.pageX + 10}px`)
                    .style("top", `${event.pageY + 10}px`);
            })
            .on("mouseout", () => {
                vis.tooltip.style("display", "none");
            })
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

const fashionData = [
    {
        name: "Streetwear Revolution",
        description: "Streetwear has reshaped the fashion industry with its blend of casual and luxury.",
        detailedInfo: "Streetwear Revolution: Streetwear has grown from niche urban fashion to a global phenomenon. It blends comfort, functionality, and style, often incorporating elements from skate culture, hip-hop, and high fashion. Collaborations between streetwear brands and luxury designers have further propelled its popularity."
    },
    {
        name: "Sustainability",
        description: "The focus on eco-friendly materials and ethical production has become a central theme.",
        detailedInfo: "Sustainability: As consumers become more environmentally conscious, the fashion industry is prioritizing sustainable practices. This includes using organic and recycled materials, reducing waste through innovative manufacturing processes, and ensuring fair labor practices. Brands are increasingly transparent about their supply chains and are committed to reducing their carbon footprint."
    },
    {
        name: "Digital Runways",
        description: "Virtual fashion shows during the pandemic showcased innovation in digital fashion.",
        detailedInfo: "Digital Runways: The pandemic accelerated the adoption of digital platforms for fashion shows. Virtual runways allow designers to reach a global audience without the constraints of physical venues. Augmented reality (AR) and virtual reality (VR) technologies are being used to create immersive experiences, while digital-only fashion is emerging as a new trend in the metaverse."
    },
    {
        name: "Athleisure Boom",
        description: "Activewear became a dominant category blending comfort with style.",
        detailedInfo: "Athleisure Boom: Athleisure continues to dominate the fashion scene by seamlessly blending athletic wear with everyday clothing. This trend emphasizes versatility, allowing pieces to transition from workouts to casual outings. Innovations in fabric technology provide enhanced comfort and performance, making athleisure a staple in modern wardrobes."
    },
    {
        name: "Gender-Neutral Fashion",
        description: "Breaking barriers with designs that defy traditional gender norms.",
        detailedInfo: "Gender-Neutral Fashion: This trend challenges the traditional binary notions of gender in clothing. Designers are creating collections that are inclusive and accessible to all, regardless of gender identity. This approach promotes diversity and self-expression, with unisex silhouettes, neutral color palettes, and versatile pieces becoming increasingly popular."
    },
    {
        name: "Fast Fashion Critique",
        description: "Growing awareness about the environmental and ethical impact of fast fashion.",
        detailedInfo: "Fast Fashion Critique: The fast fashion industry faces increasing scrutiny for its environmental impact and unethical labor practices. Consumers are demanding more transparency and accountability from brands. As a result, there is a shift towards slow fashion, which emphasizes quality, longevity, and sustainability. Brands are investing in circular fashion models and exploring ways to minimize waste."
    }
];

document.addEventListener('DOMContentLoaded', () => {
    const parentElement = "#fashion-trends-vis";
    const fashionVis = new FashionTrendsVis(parentElement, fashionData);
});
