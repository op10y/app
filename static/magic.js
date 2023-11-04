
document.addEventListener('DOMContentLoaded', function () {


          // Trigger your other CSS animations
          const elementsToAnimate = document.querySelectorAll('.animate, .animate2, .animate3, .new-animate');
        
          elementsToAnimate.forEach(function (element, index) {
            // Apply your animations using CSS classes
            element.classList.add('animate');
            element.style.animationDelay = `calc(.5s * ${index})`;
          });
        // ==============================================================================================



        const typed = new Typed('.multiple-text', {
          strings: [" Software Dev.!", " Digital Artist", " System Eng.! "],
          typeSpeed: 100,
          backSpeed: 100,
          backDelay: 1000,
          loop: true
        });


// ===============================logochanging text============================
const changingTextElement = document.getElementById("changingText");
const textArray = [
  "OPTY",
  "ABID",
  "OP10Y",
  "ABID HUSSAIN",
  "OP-T",
  "Abid..."
];

let animationInterval;

function changeTextRandomly() {
  const randomIndex = Math.floor(Math.random() * textArray.length);
  changingTextElement.textContent = textArray[randomIndex];

  // Generate a new random interval between 2 and 5 seconds for the next text change
  const randomInterval = (Math.random() * 3000) + 2000; // Between 2000ms and 5000ms
  clearInterval(animationInterval);
  animationInterval = setInterval(changeTextRandomly, randomInterval);
}


changeTextRandomly(); // Start with the initial text change

changingTextElement.addEventListener("mouseenter", () => {
  clearInterval(animationInterval);
});

changingTextElement.addEventListener("mouseleave", () => {
  changeTextRandomly(); // Start with a new random interval when the mouse leaves
});

// =====================color switcher=================


const colorSwitch = document.getElementById("colorSwitch"),
  root = document.documentElement;
let currentColorSchemeIndex = 0;
const colorSchemes = [
  "color-1",
  "color-2",
  "color-3",
  "color-4",
  "color-5",
  "color-6",
  "color-7",
  "color-8",
];
function setCurrentColorScheme() {
  const e = localStorage.getItem("currentColorScheme");
  e &&
    ((currentColorSchemeIndex = colorSchemes.indexOf(e)),
    -1 === currentColorSchemeIndex && (currentColorSchemeIndex = 0)),
    applyColorScheme();
}
function applyColorScheme() {
  const e = colorSchemes[currentColorSchemeIndex];
  root.classList.remove(...colorSchemes),
    root.classList.add(e),
    localStorage.setItem("currentColorScheme", e);
}
colorSwitch.addEventListener("change", function () {
  (currentColorSchemeIndex =
    (currentColorSchemeIndex + 1) % colorSchemes.length),
    applyColorScheme();
}),
  setCurrentColorScheme();



// ==========================active section tracker================================================


const activeRectangle = document.getElementById("activeRectangle"),
  navLinks = document.getElementById("navLinks");
let activeLinkIndex = 0;
function updateActiveLinkText() {
  const e = navLinks.getElementsByTagName("a");
  e.length > 0 && (activeRectangle.innerText = e[activeLinkIndex].innerText);
}
function scrollActiveLinkIntoView() {
  const e = navLinks.getElementsByTagName("a");
  if (e.length > 0) {
    const t = e[activeLinkIndex].getAttribute("href").substring(1);
    document.getElementById(t).scrollIntoView({ behavior: "smooth"});
  }
}
function activateDropdownLink(e) {
  const t = navLinks.getElementsByTagName("a");
  t[e].classList.add("active");
  for (let n = 0; n < t.length; n++) n !== e && t[n].classList.remove("active");
}
activeRectangle.addEventListener("wheel", (e) => {
  e.preventDefault();
  const t = navLinks.getElementsByTagName("a");
  t.length > 0 &&
    ((activeLinkIndex =
      e.deltaY > 0
        ? (activeLinkIndex + 1) % t.length
        : (activeLinkIndex - 1 + t.length) % t.length),
    updateActiveLinkText(),
    scrollActiveLinkIntoView(),
    activateDropdownLink(activeLinkIndex));
}),
  activeRectangle.addEventListener("click", () => {
    "block" === navLinks.style.display
      ? (navLinks.style.display = "none")
      : (navLinks.style.display = "block"),
      event.stopPropagation();
  }),
  navLinks.addEventListener("click", (e) => {
    const t = e.target;
    "A" === t.tagName &&
      ((activeLinkIndex = Array.from(navLinks.children).indexOf(t)),
      updateActiveLinkText(),
      (navLinks.style.display = "none"),
      scrollActiveLinkIntoView(),
      activateDropdownLink(activeLinkIndex));
  }),
  updateActiveLinkText(),
  window.addEventListener("scroll", () => {
    const e = window.scrollY,
      t = window.innerHeight / 2;
    document.querySelectorAll("section").forEach((n, o) => {
      const c = n.offsetTop,
        i = c + n.clientHeight;
      e >= c - t &&
        e <= i - t &&
        ((activeLinkIndex = o),
        updateActiveLinkText(),
        activateDropdownLink(activeLinkIndex));
    });
  }),
  document.addEventListener("click", () => {
    navLinks.style.display = "none";
  });
const navbarLinks = document.querySelectorAll(".navbar a");
navbarLinks.forEach((e) => {
  e.addEventListener("click", function (e) {
    e.preventDefault(),
      navbarLinks.forEach((e) => {
        e.classList.remove("active");
      }),
      this.classList.add("active");
    const t = this.getAttribute("href").slice(1),
      n = document.getElementById(t);
    n && n.scrollIntoView({ behavior: "smooth" });
  });
}),
  (window.onscroll = () => {
    document
      .querySelector("header")
      .classList.toggle("sticky", window.scrollY > 100);
  });



  
  // ===============================================================================================

// Your existing code for other purposes remains here
function isElementInViewport(e) {
  const t = e.getBoundingClientRect();
  return (
    t.top >= 0 &&
    t.left >= 0 &&
    t.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    t.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function updateActiveSection() {
  document.querySelectorAll("section").forEach((e) => {
    isElementInViewport(e)
      ? e.classList.add("show-animate")
      : e.classList.remove("show-animate");
  });
}
  function animatePercentages() {
    const percentageSpans = document.querySelectorAll(".skills-content .progress h3 span");

    percentageSpans.forEach((span) => {
      const targetPercentage = parseInt(span.textContent);
      let currentPercentage = 0;

      const interval = setInterval(() => {
        if (currentPercentage >= targetPercentage) {
          clearInterval(interval);
        } else {
          currentPercentage++;
          span.textContent = currentPercentage + "%";
        }
      }, 10);
    });
  }

  animatePercentages();

  const skillsSection = document.querySelector(".progress");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animatePercentages();
      }
    });
  });

  observer.observe(skillsSection);


          //animating skils bars again and agin on view
        
          function handleIntersect(entries, observer) {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const bar = entry.target;
                bar.style.animation = "none"; // Reset the animation
                bar.offsetHeight; // Trigger reflow to apply the reset
                bar.style.animation = "fill 1s ease-out"; // Start the animation again
              }
            });
          }
        
          const skillsBars = document.querySelectorAll(".skills-content .progress .bar span");
        
          skillsBars.forEach((bar) => {
            bar.style.animation = "fill 3s ease-out"; // Apply animation to each bar
            const observer = new IntersectionObserver(handleIntersect);
            observer.observe(bar);
          });


    //readmorebuttons
    const expandableText = document.getElementById('expandable-text');
    const readMoreButton = document.getElementById('read-more-button');
    const aboutSection = document.getElementById('about');

    let isExpanded = false;

    readMoreButton.addEventListener('click', function() {
        if (isExpanded) {
            expandableText.style.maxHeight = '100px'; // Collapse the text
            readMoreButton.textContent = 'Read More';
            aboutSection.scrollIntoView({ behavior: 'smooth' }); // Scroll to the "About" section
        } else {
            expandableText.style.maxHeight = 'none'; // Fully expand
            readMoreButton.textContent = 'Read Less';
            expandableText.scrollIntoView({ behavior: 'smooth' });
        }
        isExpanded = !isExpanded;
    });

    const serviceBoxes = document.querySelectorAll('.services-box');
let currentlyExpanded = null;

serviceBoxes.forEach(function(serviceBox) {
   

serviceBoxes.forEach(function(serviceBox) {
    const expandableText = serviceBox.querySelector('#expandable-text');
    const readMoreButton = serviceBox.querySelector('.btn');
    const maxHeight = '100px';

    readMoreButton.addEventListener('click', function() {
        if (currentlyExpanded === expandableText) {
            expandableText.style.maxHeight = maxHeight;
            readMoreButton.textContent = 'Read More';
            currentlyExpanded = null;
        } else {
            if (currentlyExpanded) {
                currentlyExpanded.style.maxHeight = maxHeight;
                const currentlyExpandedButton = currentlyExpanded.parentElement.querySelector('.btn');
                if (currentlyExpandedButton) {
                    currentlyExpandedButton.textContent = 'Read More';
                }
            }
            expandableText.style.maxHeight = 'none';
            readMoreButton.textContent = 'Read Less';
            currentlyExpanded = expandableText;
        }
    });
});

});

  //end


  
  function e() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
  document.querySelector("form").addEventListener("submit", function (t) {
    t.preventDefault(),
      (function () {
        const t = document.getElementById("pop");
        document.querySelector("form").reset(),
          (t.style.display = "block"),
          setTimeout(function () {
            (t.style.display = "none"), e();
          }, 3e3);
      })();
  }),
    document
      .getElementById("close-pop")
      .addEventListener("click", function () {
        (document.getElementById("pop").style.display = "none"), e();
      });
      

updateActiveSection();

// ========================================
    
const navbarLinks2 = document.querySelectorAll(".navbar2 a");
navbarLinks2.forEach((e) => {
e.addEventListener("click", function (e) {
  e.preventDefault(),
    navbarLinks2.forEach((e) => {
      e.classList.remove("active");
    }),
    this.classList.add("active");
  const t = this.getAttribute("href").slice(1),
    n = document.getElementById(t);
  n && n.scrollIntoView({ behavior: "smooth" });
});
});

////////////////////////////////////////////////////////////////////

function openLink(e) {
const link = e.replace(".html", "");
window.open(link, "_blank");
return false; // Prevent the default action
}
   
//////////////////////////////////////////////////////////////
const downloadButton = document.getElementById('downloadButton');
let downloadCount = localStorage.getItem('downloadCount') || 0;

// Check if the user has already downloaded the file three times
if (downloadCount >= 3) {
downloadButton.innerText = 'oh!';
downloadButton.style.pointerEvents = 'none'; // Disable the button
}

// Add an event listener to the Download button
downloadButton.addEventListener('click', function(event) {
if (downloadCount < 3) {
    // Increment the download count and update local storage
    downloadCount++;
    localStorage.setItem('downloadCount', downloadCount);

    if (downloadCount >= 3) {
        downloadButton.innerText = 'oh!';
        downloadButton.style.pointerEvents = 'none'; // Disable the button
    }
}
});

const resumeButton = document.getElementById('resumeButton');
let viewCount = parseInt(localStorage.getItem('viewCount')) || 0;

// Check if the user has viewed the PDF more than three times
if (viewCount >= 3) {
resumeButton.innerText = 'Oh!'; // Change the button text to 'Oh!'
resumeButton.style.pointerEvents = 'none'; // Disable the button
} else {
resumeButton.innerText = 'Resume'; // Restore the button label
}

// Add an event listener to the Resume button
resumeButton.addEventListener('click', function(event) {
if (viewCount < 3) {
// Increment the view count and update local storage
viewCount++;
localStorage.setItem('viewCount', viewCount);

if (viewCount >= 3) {
resumeButton.innerText = 'Oh!'; // Change the button text to 'Oh!'
resumeButton.style.pointerEvents = 'none'; // Disable the button
}
}
});

// Listen for the page refresh event and clear the view count only when it reaches the limit
window.addEventListener('beforeunload', function() {
if (viewCount >= 3) {
localStorage.removeItem('viewCount');
}
});



});





      
        










  