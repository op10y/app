
document.addEventListener('DOMContentLoaded', function () {


          // Trigger your other CSS animations
          function startRevealAnimations() {
            const elementsToAnimate = document.querySelectorAll('.animate, .animate2, .animate3, .new-animate');
            const homeSection = document.getElementById('home');

            homeSection?.classList.add('home-effects-preview');

            if (homeSection && 'IntersectionObserver' in window) {
              const revealEffects = [
                'home-reveal-fade',
                'home-reveal-slide',
                'home-reveal-blur',
                'home-reveal-scale'
              ];
              const revealTargets = homeSection.querySelectorAll('.home-content-2nd > *, .container');

              revealTargets.forEach(function (element, index) {
                const effect = revealEffects[Math.floor(Math.random() * revealEffects.length)];
                element.classList.add('home-random-target', effect);
                element.style.setProperty('--home-reveal-delay', `${index * 80}ms`);
                element.dataset.parallaxDirection = Math.random() < 0.5 ? '-1' : '1';
                element.dataset.parallaxSpeed = String(8 + Math.floor(Math.random() * 13));
              });

              // Home reveal: fires once on load. Resets when home scrolls fully out
              // so the animation replays the next time the user scrolls back up.
              var homeHasBeenSeen = false;

              const revealObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                  if (entry.isIntersecting) {
                    entry.target.classList.add('home-random-visible');
                    homeHasBeenSeen = true;
                  }
                });
              }, { threshold: 0.2 });

              // A section-level observer that resets all home items once the
              // home section is fully out of view (user scrolled past it)
              const homeSectionObserver = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                  if (!entry.isIntersecting && homeHasBeenSeen) {
                    // Home left the viewport — reset so re-entry replays animation
                    revealTargets.forEach(function (el) {
                      el.classList.remove('home-random-visible');
                    });
                    homeHasBeenSeen = false;
                    // Re-observe items so they fire again on re-entry
                    revealTargets.forEach(function (element) {
                      revealObserver.observe(element);
                    });
                  }
                });
              }, { threshold: 0 });

              revealTargets.forEach(function (element) {
                revealObserver.observe(element);
              });
              homeSectionObserver.observe(homeSection);

            }

            const sections = document.querySelectorAll('section:not(#home)');
            const sectionEffects = [
              'section-reveal-up',
              'section-reveal-left',
              'section-reveal-right',
              'section-reveal-blur',
              'section-reveal-scale'
            ];
            const sectionTargets = [];

            sections.forEach(function (section, sectionIndex) {
              const effect = sectionEffects[sectionIndex % sectionEffects.length];

              // For the store section (#about2), reveal children of dh-store-wrap
              // so each card/block animates in rather than the whole wrapper at once
              var directChildren;
              if (section.id === 'about2') {
                const storeWrap = section.querySelector('.dh-store-wrap');
                directChildren = storeWrap
                  ? Array.from(storeWrap.children)
                  : Array.from(section.children);
              } else {
                directChildren = Array.from(section.children);
              }

              const targets = directChildren.filter(function (element) {
                return !element.classList.contains('dh-contact')
                  && !element.classList.contains('about-img');
              });

              section.classList.add('section-scroll-effects');
              targets.forEach(function (element, targetIndex) {
                element.classList.add('section-reveal-target', effect);
                element.style.setProperty('--section-reveal-delay', `${targetIndex * 90}ms`);
                element.dataset.parallaxDirection = sectionIndex % 2 === 0 ? '1' : '-1';
                element.dataset.parallaxSpeed = String(5 + (sectionIndex % 3) * 3);
                sectionTargets.push(element);
              });
            });

            if (sectionTargets.length && 'IntersectionObserver' in window) {
              const sectionObserver = new IntersectionObserver(function (entries, observer) {
                entries.forEach(function (entry) {
                  if (!entry.isIntersecting) {
                    return;
                  }

                  entry.target.classList.add('section-reveal-visible');
                  observer.unobserve(entry.target);
                });
              }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });

              sectionTargets.forEach(function (element) {
                sectionObserver.observe(element);
              });

            }

            elementsToAnimate.forEach(function (element, index) {
              element.style.animationDelay = `calc(.5s * ${index})`;
            });
          }

          const pageContent = document.getElementById('html-content');
          if (pageContent && pageContent.style.display === 'none') {
            window.addEventListener('page-ready', startRevealAnimations, { once: true });
          } else {
            startRevealAnimations();
          }
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
  "color-9",
  "color-10",
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
// let scrollAnimationTimeout;

// window.addEventListener("scroll", () => {
//   document.documentElement.classList.add("is-scrolling");
//   clearTimeout(scrollAnimationTimeout);
//   scrollAnimationTimeout = setTimeout(() => {
//     document.documentElement.classList.remove("is-scrolling");
//   }, 120);
// }, { passive: true });

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
  activeRectangle.addEventListener("click", (event) => {
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
  document.querySelector(".footer-iconTop a")?.addEventListener("click", (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", "#home");
  }),
  document.querySelector(".footer-iconTop")?.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.replaceState(null, "", "#home");
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
    document.querySelectorAll('.expand-text-button').forEach((button) => {
      const text = button.closest('.about-content, .services-box').querySelector('.expandable-text');
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        button.textContent = expanded ? 'Read More' : 'Read Less';
        text.style.maxHeight = expanded ? '10rem' : 'none';
      });
    });

    const contactForm = document.querySelector('.contact-form');
    const contactFormStatus = document.getElementById('contactStatus');
    const contactEmail = document.getElementById('contactEmail');
    const emailFeedback = document.getElementById('emailFeedback');
    const countryCode = document.getElementById('countryCode');
    const customCountryCode = document.getElementById('customCountryCode');
    const mobileNumber = document.getElementById('mobileNumber');
    const phoneFeedback = document.getElementById('phoneFeedback');

    function validateContactEmail(showEmptyMessage = false) {
      if (!contactEmail || !emailFeedback) {
        return true;
      }

      const value = contactEmail.value.trim();
      const isValid = contactEmail.validity.valid && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);

      if (!value && !showEmptyMessage) {
        emailFeedback.textContent = '';
        contactEmail.classList.remove('is-valid', 'is-invalid');
        return false;
      }

      emailFeedback.textContent = isValid ? 'Valid email format' : 'Enter a valid email address';
      contactEmail.classList.toggle('is-valid', isValid);
      contactEmail.classList.toggle('is-invalid', !isValid);
      return isValid;
    }

    contactEmail?.addEventListener('input', () => validateContactEmail());
    contactEmail?.addEventListener('blur', () => validateContactEmail(true));

    function validatePhone(showEmptyMessage = false) {
      if (!countryCode || !customCountryCode || !mobileNumber || !phoneFeedback) {
        return true;
      }

      const digits = mobileNumber.value.replace(/\D/g, '');
      const customCode = customCountryCode.value.replace(/\D/g, '');
      const selectedCode = countryCode.value === 'custom'
        ? `+${customCode}`
        : countryCode.value;
      if (!digits && !showEmptyMessage) {
        phoneFeedback.textContent = '';
        mobileNumber.classList.remove('is-valid', 'is-invalid');
        return true;
      }

      const combinedLength = selectedCode.replace(/\D/g, '').length + digits.length;
      const isValid = /^\+\d{1,3}$/.test(selectedCode)
        && digits.length >= 7 && digits.length <= 12
        && combinedLength <= 15
        && !/^([0-9])\1+$/.test(digits)
        && !/^0+$/.test(digits);

      phoneFeedback.textContent = isValid
        ? `Format looks valid: ${selectedCode} ${digits}`
        : 'Enter a valid phone number for the selected country';
      mobileNumber.classList.toggle('is-valid', isValid);
      mobileNumber.classList.toggle('is-invalid', !isValid);
      return isValid;
    }

    mobileNumber?.addEventListener('input', () => validatePhone());
    mobileNumber?.addEventListener('blur', () => validatePhone(true));
    countryCode?.addEventListener('change', () => {
      countryCode.hidden = countryCode.value === 'custom';
      customCountryCode.hidden = countryCode.value !== 'custom';
      if (countryCode.value === 'custom') {
        customCountryCode.focus();
      }
      validatePhone(true);
    });
    customCountryCode?.addEventListener('input', () => validatePhone());

    const contactDraftKey = 'portfolio-contact-draft';
    const contactDraftFields = [contactEmail, countryCode, customCountryCode, mobileNumber, document.querySelector('[name="full_name"]'), document.getElementById('message')];

    if (contactForm) {
      try {
        const savedDraft = JSON.parse(localStorage.getItem(contactDraftKey) || 'null');
        if (savedDraft) {
          contactDraftFields.forEach((field) => {
            if (field && typeof savedDraft[field.name] === 'string') {
              field.value = savedDraft[field.name];
            }
          });
          countryCode.hidden = countryCode.value === 'custom';
          customCountryCode.hidden = countryCode.value !== 'custom';
          validateContactEmail();
          validatePhone();
        }
      } catch (error) {
        localStorage.removeItem(contactDraftKey);
      }

      contactForm.addEventListener('input', () => {
        const draft = {};
        contactDraftFields.forEach((field) => {
          if (field?.name) {
            draft[field.name] = field.value;
          }
        });

        try {
          localStorage.setItem(contactDraftKey, JSON.stringify(draft));
        } catch (error) {
          // Storage may be unavailable in private browsing.
        }
      });
    }

    if (contactForm) {
      contactForm.addEventListener('submit', (event) => {
        if (!validateContactEmail(true)) {
          event.preventDefault();
          contactEmail?.focus();
          return;
        }

        if (mobileNumber?.value.trim() && !validatePhone(true)) {
          event.preventDefault();
          mobileNumber.focus();
          return;
        }

        const nextInput = contactForm.querySelector('[name="_next"]');
        if (nextInput) {
          const isLocalhost = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname);
          const returnBase = isLocalhost ? 'https://abid.linkpc.net/' : window.location.origin + window.location.pathname;
          nextInput.value = `${returnBase}?contact=sent#contact`;
        }
        if (contactFormStatus) {
          contactFormStatus.textContent = 'TRANSMITTING / PLEASE WAIT';
          contactFormStatus.classList.remove('is-success');
        }
      });
    }

    const legalTriggers = document.querySelectorAll('[data-legal]');
    const legalModals = document.querySelectorAll('.legal-modal');
    let activeLegalModal = null;

    function closeLegalModal() {
      if (!activeLegalModal) {
        return;
      }

      activeLegalModal.hidden = true;
      activeLegalModal = null;
      document.body.classList.remove('legal-modal-open');
    }

    legalTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (event) => {
        event.preventDefault();
        closeLegalModal();
        activeLegalModal = document.getElementById(`${trigger.dataset.legal}Modal`);
        if (!activeLegalModal) {
          return;
        }

        activeLegalModal.hidden = false;
        document.body.classList.add('legal-modal-open');
        activeLegalModal.querySelector('.legal-modal__close')?.focus();
      });
    });

    legalModals.forEach((modal) => {
      modal.querySelectorAll('[data-legal-close]').forEach((closeButton) => {
        closeButton.addEventListener('click', closeLegalModal);
      });
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeLegalModal();
      }
    });



  
  const contactStatus = document.getElementById("contactStatus");
  if (contactStatus && new URLSearchParams(window.location.search).get("contact") === "sent") {
    localStorage.removeItem('portfolio-contact-draft');
    contactStatus.textContent = "TRANSMISSION RECEIVED / MESSAGE DELIVERED";
    contactStatus.classList.add("is-success");
    window.history.replaceState(null, "", `${window.location.pathname}#contact`);
  }
      

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
window.location.assign(e);
return false;
}
   
//////////////////////////////////////////////////////////////
});





      
        










  
