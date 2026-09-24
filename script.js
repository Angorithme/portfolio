document.addEventListener("DOMContentLoaded", () => {
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

  const observeNewBlocks = () => {
    document.querySelectorAll(".portfolio-block:not([data-observed])").forEach(block => {
      block.setAttribute("data-observed", "true");
      revealOnScroll.observe(block);
    });
  };

  observeNewBlocks();
  const bodyObserver = new MutationObserver(observeNewBlocks);
  bodyObserver.observe(document.body, { childList: true, subtree: true });


  // ZOOM IN SHOWCASE - THE CODE
  // -------------------------------------------------------------
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxVideo = document.getElementById("lightbox-video");
  const lightboxVideoSrc = document.getElementById("lightbox-video-src");
  const lightboxClose = document.getElementById("lightbox-close");

  // EVENT DELEGATION: Listen to clicks on both <img> and <video> elements inside <main>
  document.addEventListener("click", (e) => {
    const target = e.target;
    const isMainMedia = (target.tagName === "IMG" || target.tagName === "VIDEO") && target.closest("main");

    // Ignore clicks on background ambient video or the lightbox media itself
    if (isMainMedia && target.id !== "lightbox-img" && target.id !== "lightbox-video") {

      if (target.tagName === "IMG") {
        // Show Image, Hide Video
        lightboxVideo.classList.add("hidden");
        lightboxImg.src = target.src;
        lightboxImg.alt = target.alt || "Expanded Image";
        lightboxImg.classList.remove("hidden");
      } else if (target.tagName === "VIDEO") {
        // Show Video, Hide Image
        lightboxImg.classList.add("hidden");

        // Find current video source URL
        const src = target.currentSrc || target.querySelector("source")?.src;
        lightboxVideoSrc.src = src;
        lightboxVideo.load();
        lightboxVideo.play();
        lightboxVideo.classList.remove("hidden");
      }

      // Display Modal with Animations
      lightbox.classList.remove("hidden");
      setTimeout(() => {
        lightbox.classList.remove("opacity-0");
        lightboxImg.classList.remove("scale-95");
        lightboxImg.classList.add("scale-100");
        lightboxVideo.classList.remove("scale-95");
        lightboxVideo.classList.add("scale-100");
      }, 10);

      document.body.style.overflow = "hidden"; // Pause main page scrolling
    }
  });

  // Function to close lightbox
  const closeLightbox = () => {
    if (!lightbox) return;

    lightbox.classList.add("opacity-0");
    lightboxImg.classList.remove("scale-100");
    lightboxImg.classList.add("scale-95");
    lightboxVideo.classList.remove("scale-100");
    lightboxVideo.classList.add("scale-95");

    setTimeout(() => {
      lightbox.classList.add("hidden");

      // Clean up sources and stop video playback
      lightboxImg.src = "";
      lightboxVideo.pause();
      lightboxVideoSrc.src = "";

      document.body.style.overflow = "auto";
    }, 300);
  };

  // Close triggers
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


document.addEventListener("DOMContentLoaded", async () => {
  const container1 = document.getElementById("section1-container");
  const container2 = document.getElementById("section2-container");
  const containerSocials = document.getElementById("sectionSocials-container");
  const containerDescription = document.getElementById("sectionDescription-container");

  const response1 = await fetch("section1.html");
  const response2 = await fetch("section2.html");
  const response3 = await fetch("sectionSocials.html");
  const response4 = await fetch("sectionDescription.html");


  const html1 = await response1.text();
  const html2 = await response2.text();
  const html3 = await response3.text();
  const html4 = await response4.text();

  container1.innerHTML = html1;
  container2.innerHTML = html2;
  containerSocials.innerHTML = html3;
  containerDescription.innerHTML = html4;
});

// -------------------------------------------------------------
// 3. Audio Player
document.addEventListener("DOMContentLoaded", () => {
  const playerUI = document.getElementById("music-player");

  if (playerUI) {
    const playlist = [
      { title: "It's Raining Somewhere Else", src: "Music/063. It's Raining Somewhere Else (UNDERTALE Soundtrack) - Toby Fox.mp3" },
      { title: "The Place Where it Rained", src: "Music/70. The place where it rained (DELTARUNE Chapter 3+4 Soundtrack) - Toby Fox.mp3" },
    ];

    let currentSongIndex = 0;
    const audio = new Audio();
    let isPlaying = false;
    let hideTimeout;
    let isHovering = false;

    function showPlayer() {
      playerUI.classList.remove("-translate-x-[120%]");
      playerUI.classList.add("translate-x-0");
      resetHideTimer();
    }

    function hidePlayer() {
      if (!isHovering && isPlaying) {
        playerUI.classList.remove("translate-x-0");
        playerUI.classList.add("-translate-x-[120%]");
      }
    }

    function resetHideTimer() {
      clearTimeout(hideTimeout);
      if (isPlaying) {
        hideTimeout = setTimeout(hidePlayer, 3000);
      }
    }

    audio.addEventListener("play", () => {
      isPlaying = true;
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
      if (cdImage) cdImage.classList.add("animate-[spin_4s_linear_infinite]");

      showPlayer();
    });

    // Keep player open if the mouse is on
    playerUI.addEventListener("mouseenter", () => {
      isHovering = true;
      clearTimeout(hideTimeout);
    });

    // Start countdown when mouse leaves, what she said ig
    playerUI.addEventListener("mouseleave", () => {
      isHovering = false;
      resetHideTimer();
    });

    playerUI.addEventListener("mousemove", resetHideTimer);
    playerUI.addEventListener("click", resetHideTimer);

    // DOM Elements
    const playBtn = document.getElementById("play-btn");
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");
    const cdImage = document.getElementById("cd-image");
    const songTitle = document.getElementById("song-title");
    const songTime = document.getElementById("song-time");
    const progressBar = document.getElementById("progress-bar");

    function loadSong(index) {
      audio.src = playlist[index].src;
      songTitle.innerText = playlist[index].title;
    }

    playBtn.addEventListener("click", () => {
      if (isPlaying) audio.pause();
      else audio.play();
    });

    audio.addEventListener("play", () => {
      isPlaying = true;
      playIcon.classList.add("hidden");
      pauseIcon.classList.remove("hidden");
      if (cdImage) cdImage.classList.add("animate-[spin_4s_linear_infinite]");
    });

    audio.addEventListener("pause", () => {
      isPlaying = false;
      playIcon.classList.remove("hidden");
      pauseIcon.classList.add("hidden");
      if (cdImage) cdImage.classList.remove("animate-[spin_4s_linear_infinite]");
    });

    nextBtn.addEventListener("click", () => {
      currentSongIndex = (currentSongIndex + 1) % playlist.length;
      loadSong(currentSongIndex);
      audio.play();
    });

    prevBtn.addEventListener("click", () => {
      currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
      loadSong(currentSongIndex);
      audio.play();
    });

    audio.addEventListener("ended", () => nextBtn.click());

    function formatTime(sec) {
      let min = Math.floor(sec / 60);
      let seconds = Math.floor(sec % 60);
      return `${min}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    audio.addEventListener("timeupdate", () => {
      if (audio.duration) {
        progressBar.value = (audio.currentTime / audio.duration) * 100;
        songTime.innerText = formatTime(audio.currentTime);
      }
    });

    progressBar.addEventListener("input", (e) => {
      audio.currentTime = (e.target.value / 100) * audio.duration;
    });

    loadSong(currentSongIndex);

    // Anywhere-Click Autoplay
    // -------------------------------------------------------------
    let hasStartedMusic = false;

    const startMusicOnFirstInteraction = () => {
      if (!hasStartedMusic) {
        audio.play().then(() => {
          hasStartedMusic = true;
          window.removeEventListener("click", startMusicOnFirstInteraction);
          window.removeEventListener("keydown", startMusicOnFirstInteraction);
        }).catch(err => {
          console.log("Waiting for user interaction to start audio...");
        });
      }
    };

    window.addEventListener("click", startMusicOnFirstInteraction);
    window.addEventListener("keydown", startMusicOnFirstInteraction);
  }
});