
// // Function to show the loader with a loading percentage.
// function showLoader(percentage) {
//     const progressBar = document.getElementById('loading-bar-progress');
//     const loaderText = document.getElementById('loading-items2');

//     progressBar.style.transform = `scaleX(${percentage / 100})`; // Update the width of the progress bar
//     loaderText.textContent = `${percentage}%`; // Update the loading percentage text
// }

// // Function to hide the loader.
// function hideLoader() {
//     const loader = document.getElementById('loading');
//     loader.style.display = 'none'; // Hide the loader
  
// }

// // An array of resource URLs to track loading progress.
// const resources = [
//     // Add your resource URLs here
//     'public/app.js',
//         'public/style.css',
//         'public/script.js',
//         'public/styleop.css',
//         'header.html',
//         'home.html',
//         'about.html',
//         'services.html',
//         'portfolio.html',
//         'education.html',
//         'skills.html',
//         'contact.html',
//         '404.html',
//         'pages/prof2/index.html',
//         'pages/sidenav/index.html',
//         'pages/snake/index.html',
//         'http://op10y.github.io/profile-card/',
//         'pages/privacy.html',
//         'pages/terms.html',
//         'ab.PNG',
//         'files/av.jpg',
//         'images/liteimage.png',
//         'images/proimage.jpg',
//         'images/optyx.png',
//         'images/port1.png',
//         'images/port2.png',
//         'images/port3.png',
//         'images/port4.png',
//         'images/anime1.gif',
//         'public/hud.css',
//         'https://opty.tech',
//         'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
//         'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700;800&display=swap',
//         'https://cdn.jsdelivr.net/npm/typed.js@2.0.12',
//         'https://unpkg.com/scrollreveal',
//         'resume.pdf'
// ];

// let loadedCount = 0;

// // Function to track loading progress and update the loader.
// function trackProgress() {
//     loadedCount++;
//     const percentage = Math.floor((loadedCount / resources.length) * 100);
//     showLoader(percentage);

//     if (loadedCount === resources.length) {
//         // All resources are loaded, hide the loader.
//         // hideLoader();
      

//         // Add your code here that depends on the resources being loaded.
//         // For example, you can call fetchAndInsertAllContent() here to load additional content.
//     }
// }

// // Preload resources and track their loading progress.
// resources.forEach(resourceURL => {
//     const resource = new Image();
//     resource.src = resourceURL;
//     resource.onload = trackProgress;
//     resource.onerror = trackProgress;
// });

 


// Function to show the loader with a loading percentage and a dynamic message.
function showLoader(percentage, message, message2) {
  const progressBar = document.getElementById('loading-bar-progress');
  const loaderText = document.getElementById('loading-items');
  const loaderText2 = document.getElementById('loading-items2');

  progressBar.style.transform = `scaleX(${percentage / 100})`; // Update the width of the progress bar
  loaderText.textContent = `${percentage}% - ${message}`; // Update the loading message
  loaderText2.textContent = message2; // Update the additional loading message
}

// Function to hide the loader.
function hideLoader() {
  const loader = document.getElementById('loading');
  loader.style.display = 'none'; // Hide the loader
}

// An array of resource URLs to track loading progress.
const resources = [
  // Add your resource URLs here
  'public/app.js',
        'public/style.css',
        'public/script.js',
        'public/styleop.css',
        'header.html',
        'home.html',
        'about.html',
        'services.html',
        'portfolio.html',
        'education.html',
        'skills.html',
        'contact.html',
        '404.html',
        'pages/prof2/index.html',
        'pages/sidenav/index.html',
        'pages/snake/index.html',
        'http://op10y.github.io/profile-card/',
        'pages/privacy.html',
        'pages/terms.html',
        'ab.PNG',
        'files/av.jpg',
        'images/liteimage.png',
        'images/proimage.jpg',
        'images/optyx.png',
        'images/port1.png',
        'images/port2.png',
        'images/port3.png',
        'images/port4.png',
        'images/anime1.gif',
        'public/hud.css',
        'https://opty.tech',
        'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css',
        'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;700;800&display=swap',
        'https://unpkg.com/scrollreveal',
        'resume.pdf',
        'https://cdn.jsdelivr.net/npm/typed.js@2.0.12',
        'complete',
  // Add more resource URLs here
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
    // All resources are loaded, hide the loader.
    hideLoader();

    // Add your code here that depends on the resources being loaded.
  }
}

// Preload resources and track their loading progress.
resources.forEach(resourceURL => {
  const resource = new Image();
  resource.src = resourceURL;
  resource.onload = trackProgress;
  resource.onerror = trackProgress;
});



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
// ====================================================================