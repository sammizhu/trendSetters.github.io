const brandRevenue = new RevenueVis({
    parentElement: "#VisContainer2Top",
    dataPath: "../data/revenue_data.csv"
});

const brandGrowth = new BrandGrowth({
    parentElement: "#VisContainer2Bottom",
    data: "../data/revenue_data.csv"
});



// create slider
slider = document.getElementById('slider');

console.log(brandRevenue)

let formatDate = d3.timeFormat("%Y");
let parseDate = d3.timeParse("%Y");
let xMin = parseDate("2011");
let xMax = parseDate("2023");

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