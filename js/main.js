document.addEventListener("DOMContentLoaded", function () {
    const revenueVis = new RevenueVis({
        parentElement: "#VisContainer2", // The container for the visualization
        dataPath: "data/revenue_data.csv", // Path to the CSV file
    });
});

brandGrowthVis = new BrandGrowth({
    parentElement: "#VisContainer1",
    data: "data/revenue_data.csv"});