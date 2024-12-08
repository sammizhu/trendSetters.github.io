// Image paths for flipping
const images = [
    '../images/athletic.jpg', // Athletic image
    '../images/casual.jpg',   // Casual image
    '../images/luxury.jpg'    // Luxury image
];

let currentIndex = 0;

document.querySelector('.style-box-right').addEventListener('click', function () {
    // Flip the card
    this.classList.toggle('flipped');

    // Change the image on the back after flipping
    if (this.classList.contains('flipped')) {
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % images.length;
            document.getElementById('brand-image').src = images[currentIndex];
        }, 600); // Matches the CSS transition duration
    }
});
