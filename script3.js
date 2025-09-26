// Image Carousel JavaScript
class ImageCarousel {
  constructor() {
    this.currentSlide = 0;
    this.slides = [
      {
        title: "Mountain Landscape",
        image:
          "https://images.pexels.com/photos/1591061/pexels-photo-1591061.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        title: "Ocean Sunset",
        image:
          "https://images.pexels.com/photos/1366909/pexels-photo-1366909.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        title: "Forest Path",
        image:
          "https://images.pexels.com/photos/1761279/pexels-photo-1761279.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        title: "City Lights",
        image:
          "https://images.pexels.com/photos/1484771/pexels-photo-1484771.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
      {
        title: "Desert Dunes",
        image:
          "https://images.pexels.com/photos/1386604/pexels-photo-1386604.jpeg?auto=compress&cs=tinysrgb&w=800",
      },
    ];
    this.autoSlideInterval = null;
    this.init();
  }

  init() {
    this.createIndicators();
    this.bindEvents();
    this.startAutoSlide();
    this.updateCarousel();
  }

  createIndicators() {
    const indicatorsContainer = document.getElementById("indicators");
    indicatorsContainer.innerHTML = "";

    this.slides.forEach((_, index) => {
      const indicator = document.createElement("button");
      indicator.className = "indicator";
      if (index === 0) indicator.classList.add("active");
      indicator.addEventListener("click", () => this.goToSlide(index));
      indicatorsContainer.appendChild(indicator);
    });
  }

  bindEvents() {
    document
      .getElementById("prevBtn")
      .addEventListener("click", () => this.prevSlide());
    document
      .getElementById("nextBtn")
      .addEventListener("click", () => this.nextSlide());

    // Pause auto-slide on hover
    const carousel = document.getElementById("carousel");
    carousel.addEventListener("mouseenter", () => this.stopAutoSlide());
    carousel.addEventListener("mouseleave", () => this.startAutoSlide());

    // Touch support for mobile
    let startX = 0;
    let isDragging = false;

    carousel.addEventListener(
      "touchstart",
      (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        this.stopAutoSlide();
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        e.preventDefault();
      },
      { passive: false }
    );

    carousel.addEventListener(
      "touchend",
      (e) => {
        if (!isDragging) return;
        isDragging = false;

        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
          if (diff > 0) {
            this.nextSlide();
          } else {
            this.prevSlide();
          }
        }

        this.startAutoSlide();
      },
      { passive: true }
    );
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    this.updateCarousel();
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    this.updateCarousel();
  }

  goToSlide(index) {
    this.currentSlide = index;
    this.updateCarousel();
  }

  updateCarousel() {
    const track = document.getElementById("carouselTrack");
    const title = document.getElementById("carouselTitle");
    const indicators = document.querySelectorAll(".indicator");

    // Update track position
    track.style.transform = 'translateX(-${this.currentSlide * 20}%)';

    // Update title
    title.textContent = this.slides[this.currentSlide].title;

    // Update indicators
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === this.currentSlide);
    });
  }

  startAutoSlide() {
    this.stopAutoSlide();
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 4000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }
}

// API Data Fetching JavaScript
async function fetchJoke() {
  const button = document.getElementById("fetchJokeBtn");
  const display = document.getElementById("jokeDisplay");

  // Show loading state
  button.disabled = true;
  button.innerHTML = '<span class="loading"></span>Loading...';
  display.innerHTML = '<div class="joke-text">Fetching a fresh joke...</div>';

  try {
    const response = await fetch(
      "https://v2.jokeapi.dev/joke/Any?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single,twopart"
    );

    if (!response.ok) {
      throw new Error('HTTP error! status: ${response.status}');
    }

    const data = await response.json();

    if (data.error) {
      throw new Error("API returned an error");
    }

    // Display the joke
    let jokeContent = "";
    if (data.type === "twopart") {
      jokeContent = `
                        <div class="joke-text joke-setup">"${data.setup}"</div>
                        <div class="joke-text joke-punchline">${data.delivery}</div>
                    `;
    } else {
      jokeContent = <div class="joke-text">${data.joke}</div>;
    }

    display.innerHTML = jokeContent;
  } catch (error) {
    console.error("Error fetching joke:", error);
    display.innerHTML = `
                    <div class="joke-text" style="color: #e53e3e;">
                        Oops! Failed to fetch joke. Please try again.
                    </div>
                `;
  } finally {
    // Reset button
    button.disabled = false;
    button.innerHTML = "Get Another Joke";
  }
}

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.animationDelay = "0.2s";
      entry.target.classList.add("fade-in");
    }
  });
}, observerOptions);

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize carousel
  new ImageCarousel();

  // Set up intersection observer for animations
  document.querySelectorAll(".fade-in").forEach((el) => {
    observer.observe(el);
  });

  // Smooth scrolling for any anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });
});

// Add some interactive enhancements
document.addEventListener("DOMContentLoaded", () => {
  // Add click ripple effect to buttons
  const buttons = document.querySelectorAll("button");
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.cssText = `
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.6);
                        transform: scale(0);
                        animation: ripple 0.6s linear;
                        left: ${x}px;
                        top: ${y}px;
                        width: ${size}px;
                        height: ${size}px;
                        pointer-events: none;
                    `;

      this.style.position = "relative";
      this.style.overflow = "hidden";
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
});

// Add CSS for ripple animation
const style = document.createElement("style");
style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
document.head.appendChild(style);