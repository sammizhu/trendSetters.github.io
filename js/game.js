function showMenu(menuType) {
    // Get the menus
    const topMenu = document.getElementById('top-menu');
    const bottomMenu = document.getElementById('bottom-menu');
    const shoesMenu = document.getElementById('shoes-menu');

    // Show the selected menu and hide the other
    if (menuType === 'top') {
        topMenu.style.display = 'flex'; // Show top menu
        bottomMenu.style.display = 'none'; // Hide bottom menu
        shoesMenu.style.display = 'none';
    } else if (menuType === 'bottom') {
        topMenu.style.display = 'none'; // Hide top menu
        bottomMenu.style.display = 'flex'; // Show bottom menu
        shoesMenu.style.display = 'none';
    } else if (menuType === 'shoes') {
        shoesMenu.style.display = 'flex';
        topMenu.style.display = 'none';
        bottomMenu.style.display = 'none';
    }

}


// Variables to track selections
let selectedShirt = null;
let selectedPants = null;
let selectedShoes = null;

// Update toggle function to track selections
function toggle(clothingId, type) {
    if (type === 'top') {
        const tops = document.querySelectorAll('.toggle-image-top-image');
        tops.forEach(top => top.classList.add('toggle-image')); // Hide all tops
        selectedShirt = clothingId; // Track selected shirt
    } else if (type === 'bottom') {
        const bottoms = document.querySelectorAll('.toggle-image-bottom-image');
        bottoms.forEach(bottom => bottom.classList.add('toggle-image')); // Hide all bottoms
        selectedPants = clothingId; // Track selected pants
    } else if (type === 'shoes') {
        const shoes = document.querySelectorAll('.toggle-image-shoes-image');
        shoes.forEach(shoe => shoe.classList.add('toggle-image')); // Hide all shoes
        selectedShoes = clothingId; // Track selected shoes
    }

    // Show the selected clothing item
    const clothingElement = document.getElementById(clothingId);
    if (clothingElement) {
        clothingElement.classList.remove('toggle-image');
    } else {
        console.error(`Element with ID ${clothingId} not found.`);
    }
}

function submitStyle() {
    if (!selectedShirt || !selectedPants || !selectedShoes) {
        alert('Please select a shirt, pants, and shoes before submitting.');
        return;
    }

    // Determine the style based on selections
    const styleCounts = { 1: 0, 2: 0, 3: 0, 4: 0 };

    // Increment style counts based on selections
    if (selectedShirt.includes('1')) styleCounts[1]++;
    if (selectedShirt.includes('2')) styleCounts[2]++;
    if (selectedShirt.includes('3')) styleCounts[3]++;
    if (selectedShirt.includes('4')) styleCounts[4]++;

    if (selectedPants.includes('1')) styleCounts[1]++;
    if (selectedPants.includes('2')) styleCounts[2]++;
    if (selectedPants.includes('3')) styleCounts[3]++;
    if (selectedPants.includes('4')) styleCounts[4]++;

    if (selectedShoes.includes('1')) styleCounts[1]++;
    if (selectedShoes.includes('2')) styleCounts[2]++;
    if (selectedShoes.includes('3')) styleCounts[3]++;
    if (selectedShoes.includes('4')) styleCounts[4]++;

    // Determine the style with the highest count
    let maxStyle = 1;
    let maxCount = styleCounts[1];
    for (let style = 2; style <= 4; style++) {
        if (styleCounts[style] > maxCount) {
            maxStyle = style;
            maxCount = styleCounts[style];
        }
    }

    // Display the result in the modal
    const styleMessage = document.getElementById('style-message');
    styleMessage.textContent = `Based on your selection, your style is Style ${maxStyle}!`;
    openModal();
}

// Function to open the modal
function openModal() {
    const modal = document.getElementById('style-modal');
    modal.style.display = 'block';
}

// Function to close the modal
function closeModal() {
    const modal = document.getElementById('style-modal');
    modal.style.display = 'none';
}
