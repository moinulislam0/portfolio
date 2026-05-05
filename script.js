const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const revealItems = document.querySelectorAll(".reveal");
const year = document.querySelector("#year");
const sliders = document.querySelectorAll("[data-slider]");

if (year) {
  year.textContent = new Date().getFullYear();
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    document.body.classList.toggle("menu-open", isOpen);
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      document.body.classList.remove("menu-open");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

sliders.forEach((slider) => {
  const track = slider.querySelector(".project-gallery-track");
  const slides = Array.from(track?.querySelectorAll("img") ?? []);
  const prevButton = slider.querySelector(".slider-arrow-prev");
  const nextButton = slider.querySelector(".slider-arrow-next");
  const dotsContainer = slider.querySelector(".slider-dots");

  if (!track || slides.length === 0 || !dotsContainer) {
    return;
  }

  let currentIndex = 0;

  const dots = slides.map((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "slider-dot";
    dot.setAttribute("aria-label", `Go to image ${index + 1}`);
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateSlider();
    });
    dotsContainer.appendChild(dot);
    return dot;
  });

  const updateSlider = () => {
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    dots.forEach((dot, index) => {
      dot.classList.toggle("is-active", index === currentIndex);
    });
  };

  prevButton?.addEventListener("click", () => {
    currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    updateSlider();
  });

  nextButton?.addEventListener("click", () => {
    currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    updateSlider();
  });

  let startX = 0;
  let endX = 0;

  track.addEventListener("touchstart", (event) => {
    startX = event.changedTouches[0].clientX;
  });

  track.addEventListener("touchend", (event) => {
    endX = event.changedTouches[0].clientX;
    const delta = startX - endX;

    if (Math.abs(delta) < 40) {
      return;
    }

    if (delta > 0) {
      currentIndex = currentIndex === slides.length - 1 ? 0 : currentIndex + 1;
    } else {
      currentIndex = currentIndex === 0 ? slides.length - 1 : currentIndex - 1;
    }

    updateSlider();
  });

  updateSlider();
});
