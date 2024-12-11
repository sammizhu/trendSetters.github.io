// Array to store page content dynamically
const pages = [
    { type: 'text', content: 'If you were CEO of a company, would your branding be recognizable? Click to flip through iconic branding moments' },
    { type: 'image', content: '../images/athletic.jpg' },
    { type: 'image', content: '../images/casual.jpg' },
    { type: 'image', content: '../images/luxury.jpg' },
    { type: 'text', content: '<a href="last.html" class="last-page-link">Click to Find Your Style Lookbook</a>' },
];

let currentIndex = 0;

// Select book container and pages
const bookContainer = document.querySelector('.book-container');
const leftPageContent = document.querySelector('.left-page');
const rightPageContent = document.querySelector('.right-page');

// Function to update page content
function updatePageContent() {
    // Get current pages
    const leftPage = pages[currentIndex % pages.length];
    const rightPage = pages[(currentIndex + 1) % pages.length];

    // Update left page
    if (leftPage.type === 'image') {
        leftPageContent.innerHTML = `<img src="${leftPage.content}" alt="Page Image">`;
    } else {
        leftPageContent.innerHTML = `<p>${leftPage.content}</p>`;
    }

    // Update right page
    if (rightPage.type === 'image') {
        rightPageContent.innerHTML = `<img src="${rightPage.content}" alt="Page Image">`;
    } else {
        rightPageContent.innerHTML = rightPage.content;
    }
}

function flipPage() {
    currentIndex += 2; // Move to the next pair of pages
    bookContainer.classList.add('flipping');
    setTimeout(() => {
        updatePageContent();
        bookContainer.classList.remove('flipping');
    }, 200); // Matches the reduced CSS transition duration (0.2s)
}

// Event listener for flipping
bookContainer.addEventListener('click', flipPage);



// Initialize first pages
updatePageContent();
