// Carousel 
$(document).ready(function () {
const $carousel = $(".carousel");
const $slides = $(".carousel-slide");
let currentIndex = 0;

function showSlide(index) {
if (index < 0) {
currentIndex = $slides.length - 1;
} else if (index >= $slides.length) {
currentIndex = 0;
}
$carousel.css("transform", `translateX(-${currentIndex * 100}%)`);
}

  // Auto-advance every 3 seconds
  setInterval(function () {
    currentIndex++;
    showSlide(currentIndex);
  }, 3000);
})
