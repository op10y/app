// async function fetchAndInsertContent(containerId, contentUrl) {
//   try {
//     const response = await fetch(contentUrl);
//     if (response.status === 200) {
//       const htmlContent = await response.text();
//       document.getElementById(containerId).innerHTML = htmlContent;
//     } else {
//       throw new Error(`Failed to load ${contentUrl}`);
//     }
//   } catch (error) {
//     console.error(error);
//   }
// }

// const contentMappings = [
//   // { containerId: "header-container", contentUrl: "public/header.html" },
//   // { containerId: "home-container", contentUrl: "public/home.html" },
//   { containerId: "about-container", contentUrl: "public/about.html" },
//   { containerId: "services-container", contentUrl: "public/services.html" },
//   { containerId: "portfolio-container", contentUrl: "public/portfolio.html" },
//   { containerId: "education-container", contentUrl: "public/education.html" },
//   { containerId: "ext-container", contentUrl: "public/ext.html" },
//   { containerId: "skills-container", contentUrl: "public/skills.html" },
//   { containerId: "contact-container", contentUrl: "public/contact.html" },
//   { containerId: "footer-container", contentUrl: "public/footer.html" }
// ];


// async function fetchAndInsertAllContent() {
//   const promises = contentMappings.map((mapping) =>
//     fetchAndInsertContent(mapping.containerId, mapping.contentUrl)
//   );

//   try {
//     await Promise.all(promises);
//   } catch (error) {
//     console.error("Content loading error:", error);
//   }
// }
//  fetchAndInsertAllContent();

const newChangingTextElement = document.getElementById("changingText2");
const newTextArray = [
  "./-",
  "..|-",
  "...|/-",
  "....|-",
  "...../-",
  "......|-"
];

let newAnimationInterval;

function newChangeTextRandomly() {
  const randomIndex = Math.floor(Math.random() * newTextArray.length);
  newChangingTextElement.textContent = newTextArray[randomIndex];

  // Generate a new random interval between 2 and 5 seconds for the next text change
  const randomInterval = (Math.random() * 30) + 100; // Between 2000ms and 5000ms
  clearInterval(newAnimationInterval);
  newAnimationInterval = setInterval(newChangeTextRandomly, randomInterval);
}


newChangeTextRandomly(); // Start with the initial text change

newChangingTextElement.addEventListener("mouseenter", () => {
  clearInterval(newAnimationInterval);
});

newChangingTextElement.addEventListener("mouseleave", () => {
  newChangeTextRandomly(); // Start with a new random interval when the mouse leaves
});

 
 
      





      // Function to show the loader with a loading percentage and a dynamic message.
      function showLoader(percentage, message, message2) {
        const progressBar = document.getElementById('loading-bar-progress');
        const loaderText = document.getElementById('loading-items');
        const loaderText2 = document.getElementById('loading-items2');
      
        progressBar.style.transform = `scaleX(${percentage / 100})`; 
        loaderText.textContent = `${percentage}% - ${message}`;
        loaderText2.textContent = message2;
      }
      function hideLoader() {
        const loader = document.getElementById('loading');
        loader.style.display = 'none'; // Hide the loader
      }
      
      function showPage() {
        const newPage = document.getElementById('html-content');
        newPage.style.display = 'block';
      }
      function hideLoaderWithDelay() {
        const loader = document.getElementById('loading');
      
        hideLoader();
        
        
        setTimeout(function() {
          showPage();
        }, 500);
        
     
      }
      
      // An array of resource URLs to track loading progress.
      const resources = [
              'static/app.js',
              'static/live.js',
              'static/magic.js',
              'static/styleop.css',
              'public/header.html',
              'public/home.html',
              'public/about.html',
              'public/services.html',
              'public/portfolio.html',
              'public/education.html',
              'public/skills.html',
              'public/contact.html',
              '404.html',
              'static/pages/prof2/index.html',
              'static/pages/sidenav/index.html',
              'static/pages/snake/index.html',
              'static/pages/privacy.html',
              'static/pages/terms.html',
              'ab.PNG',
              'static/files/av.jpg',
              'static/images/liteimage.png',
              'static/images/proimage.jpg',
              'static/images/optyx.png',
              'static/images/port1.png',
              'static/images/port2.png',
              'static/images/port3.png',
              'static/images/port4.png',
              'static/images/anime1.gif',
              'static/hud.css',
              'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
              'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700;800&display=swap',
              'https://unpkg.com/scrollreveal',
              'public/resume.pdf',
              'https://cdn.jsdelivr.net/npm/typed.js@2.0.12'
      ];
      let loadedCount = 0;
      
      // Function to track loading progress and update the loader.
      function trackProgress() {
        loadedCount++;
        const percentage = Math.floor((loadedCount / resources.length) * 100);
        const message = `Loading... ${resources[loadedCount - 1]}`;
        const message2 = `...`;
        showLoader(percentage, message, message2);

      
        if (loadedCount === resources.length) {


          hideLoaderWithDelay();

        }
      }
      
      
      // Preload resources and track their loading progress.
      resources.forEach(resourceURL => {
        const resource = new Image();
        resource.src = resourceURL;
        resource.onload = trackProgress;
        resource.onerror = trackProgress;
      });

     
