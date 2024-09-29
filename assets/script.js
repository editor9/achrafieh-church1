// Array of slides from 1 to 331
const slides = Array.from({ length: 331 }, (_, i) => {
    return {
        "image": `https://hymnary.org/page/fetch/TM1960s/${i + 1}`
    };
});

const carouselInner = document.querySelector(".carousel-inner");
const categorySelect = document.getElementById("category-select");
const frameNumberInput = document.getElementById("frame-number");
const downloadImageButton = document.getElementById("download-image");
const sendWhatsAppButton = document.getElementById("send-whatsapp");

let currentIndex = 0;

// Map to hold category ranges and frame adjustments
const categories = {
    1: { min: 1, max: 56, adjustment: 0 },     // No adjustment for Category 1
    2: { min: 57, max: 105, adjustment: 2 },    // Category 2: frame + 2
    3: { min: 106, max: 114, adjustment: 5 },   // Category 3: frame + 5
    4: { min: 115, max: 150, adjustment: 8 },   // Category 4: frame + 8
    5: { min: 151, max: 256, adjustment: 10 },  // Category 5: frame + 10
    6: { min: 257, max: 293, adjustment: 12 },  // Category 6: frame + 12
    7: { min: 294, max: 300, adjustment: 15 },  // Category 7: frame + 15
    8: { min: 301, max: 315, adjustment: 16 }   // Category 8: frame + 16
};

// Function to update the carousel slides
function updateCarousel() {
    carouselInner.innerHTML = "";

    slides.forEach((slide, index) => {
        const slideElement = document.createElement("div");
        slideElement.classList.add("carousel-slide");
        slideElement.innerHTML = `
            <img class="banner-img" src="${slide.image}" alt="Banner Image">
        `;
        carouselInner.appendChild(slideElement);
    });

    showSlide(0); // Show the first slide by default
}

// Function to display the correct slide
function showSlide(index) {
    const slides = document.querySelectorAll(".carousel-slide");

    slides.forEach((slide, i) => {
        if (i === index) {
            slide.style.display = "block";
        } else {
            slide.style.display = "none";
        }
    });
    currentIndex = index;
}

// Calculate the adjusted index based on the frame number
function getAdjustedIndex(frameNumber) {
    let adjustedIndex = frameNumber - 1; // Start with zero-based index

    // Loop through categories to find which range the frameNumber falls into and apply the correct adjustment
    for (const category in categories) {
        const { min, max, adjustment } = categories[category];
        if (frameNumber >= min && frameNumber <= max) {
            adjustedIndex = frameNumber + adjustment - 1;
            break;
        }
    }

    // Ensure the adjusted index stays within valid bounds (1 to 315 -> index 0 to 330)
    if (adjustedIndex < 0) adjustedIndex = 0;
    if (adjustedIndex > 330) adjustedIndex = 330;
    
    return adjustedIndex;
}

// Handle input change for frame number
frameNumberInput.addEventListener("input", (event) => {
    const frameNumber = parseInt(event.target.value, 10);

    // Ensure the frame number stays within 1 to 315 range
    let validatedFrameNumber = frameNumber;
    if (validatedFrameNumber < 1) validatedFrameNumber = 1;
    if (validatedFrameNumber > 315) validatedFrameNumber = 315;

    // Get the adjusted index based on the frame number
    const adjustedIndex = getAdjustedIndex(validatedFrameNumber);

    // Display the correct slide based on the adjusted frame number
    showSlide(adjustedIndex);
});

// Initialize the carousel
updateCarousel();

// Function to capture the current displayed slide
function captureSlide() {
    const currentSlide = document.querySelector('.carousel-slide[style*="display: block"] .banner-img');

    if (currentSlide) {
        const imgSrc = currentSlide.src;
        return imgSrc;  // Return the current slide image source URL
    }
    return null;
}

// Function to download the image as PNG or JPG
downloadImageButton.addEventListener("click", function (event) {
    event.preventDefault();  // Prevent any default behavior (like page navigation)
    const imgSrc = captureSlide();

    if (imgSrc) {
        // Create a hidden anchor tag to download the image
        const link = document.createElement("a");
        link.href = imgSrc;
        link.download = 'slide-image.png'; // You can change this to .jpg if needed
        link.style.display = 'none'; // Hide the link

        document.body.appendChild(link);
        link.click();  // Trigger the download
        document.body.removeChild(link);  // Clean up
    } else {
        alert("No image to download.");
    }
});

// Function to send the image via WhatsApp (without the link)
sendWhatsAppButton.addEventListener("click", function () {
    const imgSrc = captureSlide();

    if (imgSrc) {
        // Open the image in a new tab for download
        window.open(imgSrc, '_blank');  // Opens the image in a new tab
    } else {
        alert("No image to download.");
    }
});
