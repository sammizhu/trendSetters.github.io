
function checkAnswers() {
    const correctAnswers = {
        LVMH: "Luxury",
        TJX: "Discount",
        GAP: "Full-price",
        LULU: "Athletic",
        Fastest_Brand: "LULU"
    };

    let incorrectAnswers = []; // Array to store incorrect answers

    // Validate the dropdown selections
    for (const [brand, answer] of Object.entries(correctAnswers)) {
        const userAnswer = document.getElementById(brand)?.value;
        if (userAnswer !== answer) {
            incorrectAnswers.push(`${brand} is ${answer}`); // Add only incorrect answers
        }
    }

    const result = document.getElementById("result");
    if (incorrectAnswers.length === 0) {
        // All answers are correct
        result.textContent = "Correct!";
        result.style.color = "green";
    } else {
        // Show only the incorrect answers with styled "Incorrect!"
        result.innerHTML = `
            <span style="color: red; font-weight: bold;">Incorrect!</span><br><br>
            ${incorrectAnswers.join("<br>")}
        `;
        result.style.color = "black"; // Reset color for the rest of the text
    }
}
