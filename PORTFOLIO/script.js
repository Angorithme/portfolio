document.addEventListener("DOMContentLoaded", () => {
  // -------------------------------------------------------------
  // 1. Scroll-reveal animation (Intersection Observer)
  // -------------------------------------------------------------
  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.15
  };

  const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Use MutationObserver or delegate observing so dynamically fetched blocks get observed
  const observeNewBlocks = () => {
    document.querySelectorAll(".portfolio-block:not([data-observed])").forEach(block => {
      block.setAttribute("data-observed", "true");
      revealOnScroll.observe(block);
    });
  };

  // Run initial observe check and observe dynamically injected DOM nodes
  observeNewBlocks();
  const bodyObserver = new MutationObserver(observeNewBlocks);
  bodyObserver.observe(document.body, { childList: true, subtree: true });

  // -------------------------------------------------------------
  // 2. Lightbox Modal Functionality (Event Delegation Fix)
  // -------------------------------------------------------------
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxClose = document.getElementById("lightbox-close");

  // EVENT DELEGATION: Listen to ALL clicks on the page, even dynamically fetched content
  document.addEventListener("click", (e) => {
    // Check if the clicked element is an image inside <main>
    if (e.target.tagName === "IMG" && e.target.closest("main")) {
      lightboxImg.src = e.target.src;
      lightboxImg.alt = e.target.alt || "Expanded Image";
      
      lightbox.classList.remove("hidden");
      setTimeout(() => {
        lightbox.classList.remove("opacity-0");
        lightboxImg.classList.remove("scale-95");
        lightboxImg.classList.add("scale-100");
      }, 10);
      
      document.body.style.overflow = "hidden";
    }
  });

  // Function to close lightbox
  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.add("opacity-0");
    lightboxImg.classList.remove("scale-100");
    lightboxImg.classList.add("scale-95");

    setTimeout(() => {
      lightbox.classList.add("hidden");
      lightboxImg.src = "";
      document.body.style.overflow = "auto";
    }, 300);
  };

  // Lightbox Close Events
  if (lightbox) {
    if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
    
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.parentElement === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lightbox.classList.contains("hidden")) {
        closeLightbox();
      }
    });
  }
});






// sections setup
document.addEventListener("DOMContentLoaded", async () => {
  // 1. Fetch and inject section2.html
  const container1 = document.getElementById("section1-container");
  const container2 = document.getElementById("section2-container");
  const container3 = document.getElementById("section3-container");
  
  const response1 = await fetch("section1.html");
  const response2 = await fetch("section2.html");
  const response3 = await fetch("section3.html");

  const html1 = await response1.text();
  const html2 = await response2.text();
  const html3 = await response3.text();

  container1.innerHTML = html1;
  container2.innerHTML = html2;
  container3.innerHTML = html3;

  // 2. Initialize Lightbox & Scroll Effects (after content is loaded)
  // initPortfolioFeatures();
});

// function initPortfolioFeatures() {
//   // Lightbox click listeners and IntersectionObserver code goes here...
//   const lightbox = document.getElementById("lightbox");
//   const lightboxImg = document.getElementById("lightbox-img");
//   const lightboxClose = document.getElementById("lightbox-close");

//   document.querySelectorAll("main img").forEach(img => {
//     img.addEventListener("click", () => {
//       lightboxImg.src = img.src;
//       lightbox.classList.remove("hidden");
//       setTimeout(() => lightbox.classList.remove("opacity-0"), 10);
//       document.body.style.overflow = "hidden";
//     });
//   });

//   if (lightboxClose) {
//     lightboxClose.addEventListener("click", () => {
//       lightbox.classList.add("opacity-0");
//       setTimeout(() => {
//         lightbox.classList.add("hidden");
//         document.body.style.overflow = "auto";
//       }, 300);
//     });
//   }
// }