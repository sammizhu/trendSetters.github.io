// // create slider
// slider = document.getElementById('slider');
//
// console.log(brandRevenue)
//
// let xMin = brandRevenue.getMinX()
// let xMax = 0
// let formatDate = d3.timeFormat("%Y");
// let parseDate = d3.timeParse("%Y");
//
// noUiSlider.create(slider, {
//     start: [xMin, xMax],
//     connect: true,
//     range: {
//         'min': Number(xMin),
//         'max': Number(xMax)
//     },
//     tooltips: true,
//     format: {
//         from: Number,
//         to: function(value) {
//             return formatDate(value);
//         }
//     },
//     pips: {
//         mode: 'steps',
//         stepped: true,
//         density: 4,
//         format: {
//             from: Number,
//             to: function(value) {
//                 return formatDate(value);
//             }
//         }
//     },
//     behaviour: 'tap-drag',
//     // set minimum range
//     margin: (xMax - xMin)/10
// });
//
// // event listener so visualization updates on chance
// slider.noUiSlider.on('slide', function (values, handle) {
//     // get new date range from slider and save them
//     xMin = parseDate(values[0])
//     xMax = parseDate(values[1])
//     // set new domain of x scale based on new date range
//     brandRevenue.xScale.domain([xMin, xMax]);
//     console.log(xMin, xMax)
//     // update chart
//     brandRevenue.updateVis()
// });