let correctMatch = false;
let correctGrowth = false;

function submitMatch() {
    if (document.getElementById("LVMHSelect").value === "LVMHSelect" &&
        document.getElementById("TJXSelect").value === "TJXSelect" &&
        document.getElementById("GAPSelect").value === "GAPSelect" &&
        document.getElementById("LULUSelect").value === "LULUSelect") {
        document.getElementById("matchResult").innerText = "Correct!";
        correctMatch = true;
        showDescription()
    }
    else {
        document.getElementById("matchResult").innerText = "Incorrect";
    }
}

function submitGrowth() {
    if (document.getElementById("brandGrowth").value === "LULU") {
        document.getElementById("growthResult").innerText = "Correct!";
        correctGrowth = true;
        showDescription()
    }
    else {
        document.getElementById("growthResult").innerText = "Incorrect";
    }
}

function showDescription () {
    console.log(correctGrowth);
    console.log(correctMatch)
    if (correctGrowth && correctMatch) {
        document.getElementById("brandDescription").innerText = "Description of brands appear";
    }
}