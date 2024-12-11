// This file sets up the brand visualizations

// Store in a variable, revenue by quarter visualization on top
const brandRevenue = new RevenueVis({
    parentElement: "#VisContainer2Top",
    dataPath: "../data/revenue_data.csv"
});

// Store in a variable, revenue growth visualization on bottom
const brandGrowth = new BrandGrowth({
    parentElement: "#VisContainer2Bottom",
    data: "../data/revenue_data.csv"
});

// create slider and store in a variable
slider = document.getElementById('slider');

let formatDate = d3.timeFormat("%Y");
let parseDate = d3.timeParse("%Y");
let xMin = parseDate("2011");
let xMax = parseDate("2023");

// initialize slider
noUiSlider.create(slider, {
    start: [xMin, xMax],
    connect: true,
    range: {
        'min': Number(xMin),
        'max': Number(xMax)
    },
    tooltips: true,
    format: {
        from: Number,
        to: function(value) {
            return formatDate(value);
        }
    },
    pips: {
        mode: 'steps',
        stepped: true,
        density: 4,
        format: {
            from: Number,
            to: function(value) {
                return formatDate(value);
            }
        }
    },
    behaviour: 'tap-drag',
    // set minimum range
    margin: (xMax - xMin)/10
});

// event listener so visualization updates on chance
slider.noUiSlider.on('slide', function (values, handle) {
    // get new date range from slider and save them
    xMin = parseDate(values[0])
    xMax = parseDate(values[1])
    // update chart
    brandGrowth.loadData(xMin, xMax)
    brandRevenue.loadData(xMin, xMax)
});

// create button that you can click through for key takeaways from the page
const button = document.getElementById("actionButtonBrand");

// List of questions to cycle through
const takeaways = [
    "Athletic wear / athleisure, especially high-end athleisure, has been getting more popular, as shown by Lululemon's revenue growth",
    "Fashion sales experience seasonality with more purchases during the end of the year and holiday season, leading to a spike in sales then",
    "The Covid-19 pandemic affected all fashion brands, and it seemed like discount retail took the biggest hit with TJ Maxx having the largest loss",
    "Revenue growth rates in 2021 were inflated from revenue recovering after an especially poor 2020 due to the pandemic",
    ""
];

// Index to keep track of the current takeaway
let clickCount = 0;

// Add event listener to the button
button.addEventListener("click", () => {
    document.getElementById("takeawayBrand").innerText = takeaways[clickCount];
    clickCount++;
    // If the button has been clicked more than takeaway number, reset
    if (clickCount === takeaways.length) {
        // Reset the counter and index
        clickCount = 0;
    }
});