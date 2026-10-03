document.addEventListener("DOMContentLoaded", async function () {
  const loader = document.getElementById("loading");
  const page = document.getElementById("html-content");
  const progressBar = document.getElementById("loading-bar-progress");
  const loaderText = document.getElementById("loading-items");
  const loaderText2 = document.getElementById("loading-items2");

  // =========================================================
  // LOADER TEXT ANIMATION
  // =========================================================

  const changingText = document.getElementById("changingText2");

  const textArray = [
    "./-",
    "..|-",
    "...|/-",
    "....|-",
    "...../-",
    "......|-"
  ];

  let animationInterval = null;

  function changeLoaderText() {
    if (!changingText) return;

    const randomIndex = Math.floor(Math.random() * textArray.length);
    changingText.textContent = textArray[randomIndex];
  }

  changeLoaderText();
  animationInterval = setInterval(changeLoaderText, 200);

  // =========================================================
  // LOADER UI
  // =========================================================

  function updateLoader(percent, message) {
    if (progressBar) {
      progressBar.style.transform = `scaleX(${percent / 100})`;
    }

    if (loaderText) {
      loaderText.textContent = `${percent}% - ${message}`;
    }

    if (loaderText2) {
      loaderText2.textContent = "...";
    }
  }

  function stopLoaderAnimation() {
    if (animationInterval) {
      clearInterval(animationInterval);
      animationInterval = null;
    }
  }
function finishLoading() {

    // STOP changingText2 permanently
    stopLoaderAnimation();

    // Make sure progress reaches 100%
    updateLoader(100, "Done !");

    // Show page
    if (page) {
        page.style.display = "block";
    }

    // Hide loader
    if (loader) {
        loader.style.display = "none";
    }

    // Tell the rest of your JS that everything is ready
    window.dispatchEvent(new Event("page-ready"));

    // ==========================================
    // RANDOM INITIAL HERO MODE
    // ==========================================

    setTimeout(function () {

        // 50% chance of activating whatever
        // your existing toggle activates.
        if (Math.random() < 0.5) {

            const heroToggle =
                document.getElementById("hero-mode-toggle");

            if (heroToggle) {
                heroToggle.click();
            }

        }

    }, 50);
}
  // =========================================================
  // HTML SECTIONS
  // =========================================================

  const contentMappings = [
    {
      containerId: "header-container",
      contentUrl: "public/header.html"
    },
    {
      containerId: "home-container",
      contentUrl: "public/home.html"
    },
    {
      containerId: "about-container",
      contentUrl: "public/about.html"
    },
    {
      containerId: "services-container",
      contentUrl: "public/services.html"
    },
    {
      containerId: "portfolio-container",
      contentUrl: "public/portfolio.html"
    },
    {
      containerId: "education-container",
      contentUrl: "public/education.html"
    },
    {
      containerId: "ext-container",
      contentUrl: "public/ext.html"
    },
    {
      containerId: "skills-container",
      contentUrl: "public/skills.html"
    },
    {
      containerId: "contact-container",
      contentUrl: "public/contact.html"
    },
    {
      containerId: "footer-container",
      contentUrl: "public/footer.html"
    }
  ];

  async function loadHTML(mapping) {
    const container = document.getElementById(mapping.containerId);

    // Some containers may not exist because your current
    // index.html has some sections directly inside it.
    if (!container) {
      return;
    }

    try {
      const response = await fetch(mapping.contentUrl, {
        cache: "no-cache"
      });

      if (!response.ok) {
        throw new Error(
          `Failed to load ${mapping.contentUrl}: ${response.status}`
        );
      }

      const html = await response.text();

      container.innerHTML = html;

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }

  // =========================================================
  // IMAGE PRELOADING
  // =========================================================

  function preloadImages() {
    const images = Array.from(document.images);

    const promises = images.map((img) => {
      return new Promise((resolve) => {

        // Already loaded
        if (img.complete) {
          resolve();
          return;
        }

        img.addEventListener("load", resolve, { once: true });
        img.addEventListener("error", resolve, { once: true });
      });
    });

    return Promise.all(promises);
  }

  // =========================================================
  // LOAD ALL HTML CONTENT
  // =========================================================

  updateLoader(10, "Initializing system");

  await Promise.all(
    contentMappings.map(async (mapping, index) => {
      await loadHTML(mapping);

      const percent = 10 + Math.floor(
        ((index + 1) / contentMappings.length) * 45
      );

      updateLoader(
        percent,
        `Loading ${mapping.contentUrl}`
      );
    })
  );

  // =========================================================
  // WAIT FOR IMAGES
  // =========================================================

  updateLoader(60, "Loading images");

  await preloadImages();

  updateLoader(80, "Loading interface");

  // Give the browser one frame to finish inserting/rendering
  await new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve);
    });
  });

  // =========================================================
  // FINISH
  // =========================================================

  updateLoader(100, "Done !");

  // Small delay so 100% is visible
  await new Promise((resolve) => setTimeout(resolve, 250));

  finishLoading();
});