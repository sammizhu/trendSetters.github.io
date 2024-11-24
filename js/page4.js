
function checkAnswers() {
    const correctAnswers = {
        LVMH: "Luxury",
        TJX: "Discount",
        GAP: "Full-price",
        LULU: "Athletic",
        fastestBrand: "LULU"
    };

        let correct = true;

        // Validate the dropdown selections
        for (const [brand, answer] of Object.entries(correctAnswers)) {
        const userAnswer = document.getElementById(brand)?.value;
        if (userAnswer !== answer) {
        correct = false;
    }
    }

        const result = document.getElementById("result");
        if (correct) {
        result.textContent = "Correct!";
        result.style.color = "green";
    } else {
        // Show the correct answers when incorrect
        result.innerHTML = `
                    Incorrect!<br><br>
                    LVMH is ${correctAnswers.LVMH}<br>
                    TJX is ${correctAnswers.TJX}<br>
                    GAP is ${correctAnswers.GAP}<br>
                    LULU is ${correctAnswers.LULU}
                `;
        result.style.color = "red";
    }
}
