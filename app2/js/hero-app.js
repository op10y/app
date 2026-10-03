/**
 * HERO APP CONTROLLER
 * Main logic, 3D Tilt, Glitch Logo, Typewriter, Telemetry, and Modals
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Audio Synthesizer
  const audio = new CybertronianAudio();

  // 2. Initialize 3D Three.js WebGL Scene
  let scene3D = null;
  try {
    scene3D = new CybertronianScene('webgl-canvas-container');
  } catch (err) {
    console.warn('WebGL initialization fallback:', err);
  }

  // 3. Audio & Hover Sound FX Binders
  const interactiveElements = document.querySelectorAll('button, a, .tech-pill, .theme-dot, .social-node');
  interactiveElements.forEach((el) => {
    el.addEventListener('mouseenter', () => audio.playHoverBlip());
    el.addEventListener('click', () => audio.playClick());
  });

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundLabel = document.getElementById('soundLabel');
  if (soundToggleBtn && soundLabel) {
    soundToggleBtn.addEventListener('click', () => {
      const active = audio.toggleSound();
      soundLabel.textContent = active ? 'SFX ON' : 'SFX OFF';
      soundToggleBtn.classList.toggle('active', active);
    });
  }

  // 4. Hacker Matrix Typo & Glitch Animation for Brand (Single Size Locked Container)
  const changingText = document.getElementById('changingLogoText');
  const logoVariants = [
    'ABID HUSSAIN',
    'OP10Y',
    'OPTY',
    'op!0y_X',
    'OP-T',
    'ABID'
  ];
  let logoIndex = 0;

  if (changingText) {
    setInterval(() => {
      logoIndex = (logoIndex + 1) % logoVariants.length;
      glitchDecodeText(changingText, logoVariants[logoIndex]);
    }, 4200);

    changingText.addEventListener('mouseenter', () => {
      if (typeof audio !== 'undefined' && !audio.isMuted) {
        audio.playHoverBlip();
      }
      logoIndex = (logoIndex + 1) % logoVariants.length;
      glitchDecodeText(changingText, logoVariants[logoIndex]);
    });
  }

  function glitchDecodeText(element, targetText) {
    const chars = '!@#$%^&*()_+~|}{[]:;?><01';
    let iteration = 0;
    const interval = setInterval(() => {
      element.innerText = targetText
        .split('')
        .map((letter, index) => {
          if (index < iteration) {
            return targetText[index];
          }
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= targetText.length) {
        clearInterval(interval);
      }
      iteration += 1 / 2;
    }, 30);
  }

  // 5. Dynamic Typewriter
  const typedTarget = document.getElementById('typedHeroRole');
  const roles = [
    'Software Engineer',
    'Front-End Developer',
    'Digital Artist',
    'System Engineer',
    'Creative Technologist'
  ];
  let currentRoleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typeSpeed = 90;

  function typeEffect() {
    if (!typedTarget) return;
    const fullRole = roles[currentRoleIdx];

    if (isDeleting) {
      charIdx--;
      typeSpeed = 45;
    } else {
      charIdx++;
      typeSpeed = 90;
    }

    typedTarget.textContent = fullRole.substring(0, charIdx);

    if (!isDeleting && charIdx === fullRole.length) {
      isDeleting = true;
      typeSpeed = 1600; // Hold at full string
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      currentRoleIdx = (currentRoleIdx + 1) % roles.length;
      typeSpeed = 400; // Pause before typing next
    }

    setTimeout(typeEffect, typeSpeed);
  }
  typeEffect();

  // 6. Interactive 3D Cyber Card Tilt with Specular Glare & Gyroscope
  const cardWrapper = document.getElementById('cyberCardWrapper');
  const card = document.getElementById('cyberCard');
  let tiltMode = 'mouse'; // 'mouse' or 'gyro'

  if (cardWrapper && card) {
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;
    let isHovered = false;

    window.addEventListener('mousemove', (e) => {
      if (tiltMode !== 'mouse') return;
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;

      const normX = (e.clientX - cardCenterX) / (window.innerWidth / 2);
      const normY = (e.clientY - cardCenterY) / (window.innerHeight / 2);

      targetX = Math.max(-1, Math.min(1, normX));
      targetY = Math.max(-1, Math.min(1, normY));

      // Update card glare hotspot
      const glareX = ((e.clientX - rect.left) / rect.width) * 100;
      const glareY = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', `${glareX}%`);
      card.style.setProperty('--mouse-y', `${glareY}%`);
    });

    // Touch support for card tilt
    window.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = card.getBoundingClientRect();
        const normX = (touch.clientX - (rect.left + rect.width / 2)) / (window.innerWidth / 2);
        const normY = (touch.clientY - (rect.top + rect.height / 2)) / (window.innerHeight / 2);
        targetX = Math.max(-1, Math.min(1, normX));
        targetY = Math.max(-1, Math.min(1, normY));
      }
    }, { passive: true });

    // Gyroscope listener
    window.addEventListener('deviceorientation', (e) => {
      if (tiltMode === 'gyro' && e.gamma !== null && e.beta !== null) {
        targetX = Math.max(-1, Math.min(1, e.gamma / 30));
        targetY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      }
    });

    // Smooth physics loop for card tilt
    function updateCardTilt() {
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      const rotateY = currentX * 18; // Max 18 deg Y rotation
      const rotateX = -currentY * 18; // Max 18 deg X rotation

      cardWrapper.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
      requestAnimationFrame(updateCardTilt);
    }
    updateCardTilt();
  }

  // 7. Tilt Mode Toggle (Mouse vs Gyroscope - inspired by original site)
  const tiltModeToggle = document.getElementById('tiltModeToggle');
  const tiltModeLabel = document.getElementById('tiltModeLabel');
  if (tiltModeToggle && tiltModeLabel) {
    tiltModeToggle.addEventListener('click', () => {
      if (tiltMode === 'mouse') {
        if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
          DeviceOrientationEvent.requestPermission()
            .then((permissionState) => {
              if (permissionState === 'granted') {
                tiltMode = 'gyro';
                tiltModeLabel.textContent = 'Gyro tilt';
                tiltModeToggle.classList.add('active');
              }
            })
            .catch(console.warn);
        } else {
          tiltMode = 'gyro';
          tiltModeLabel.textContent = 'Gyro tilt';
          tiltModeToggle.classList.add('active');
        }
      } else {
        tiltMode = 'mouse';
        tiltModeLabel.textContent = 'Mouse tilt';
        tiltModeToggle.classList.remove('active');
      }
    });
  }

  // 8. 3D Shockwave Burst interaction
  const shockwaveBtn = document.getElementById('shockwaveBtn');
  if (shockwaveBtn) {
    shockwaveBtn.addEventListener('click', () => {
      if (scene3D) {
        scene3D.triggerShockwave();
      }
      audio.playShockwaveSound();
    });
  }

  // 9. Wireframe / Solid Core Toggle
  const wireframeToggleBtn = document.getElementById('wireframeToggleBtn');
  if (wireframeToggleBtn) {
    wireframeToggleBtn.addEventListener('click', () => {
      if (scene3D) {
        const isWire = scene3D.toggleWireframe();
        wireframeToggleBtn.classList.toggle('active', isWire);
      }
    });
  }

  // 10. Theme Switching Matrix
  const themeDots = document.querySelectorAll('.theme-dot');
  themeDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      const selectedTheme = dot.getAttribute('data-pick');
      document.body.setAttribute('data-theme', selectedTheme);
      themeDots.forEach((d) => d.classList.remove('active'));
      dot.classList.add('active');

      if (scene3D) {
        scene3D.setTheme(selectedTheme);
      }
      try {
        localStorage.setItem('opty_theme', selectedTheme);
      } catch (e) {}
    });
  });

  // Restore saved theme if any
  try {
    const savedTheme = localStorage.getItem('opty_theme');
    if (savedTheme) {
      const matchDot = document.querySelector(`.theme-dot[data-pick="${savedTheme}"]`);
      if (matchDot) matchDot.click();
    }
  } catch (e) {}

  // 11. Uplink Comms Modal
  const uplinkModal = document.getElementById('uplinkModal');
  const openUplinkBtns = document.querySelectorAll('[data-open-uplink]');
  const closeUplinkBtns = document.querySelectorAll('[data-close-uplink]');

  function openUplink() {
    if (!uplinkModal) return;
    uplinkModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    audio.playUplinkConfirm();
  }

  function closeUplink() {
    if (!uplinkModal) return;
    uplinkModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  openUplinkBtns.forEach((btn) => btn.addEventListener('click', openUplink));
  closeUplinkBtns.forEach((btn) => btn.addEventListener('click', closeUplink));
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeUplink();
      closeProjectModal();
    }
  });

  // 12. Project Telemetry Modal
  const projectModal = document.getElementById('projectModal');
  const projectTitle = document.getElementById('projectModalTitle');
  const projectCategory = document.getElementById('projectModalCategory');
  const projectDesc = document.getElementById('projectModalDesc');
  const projectSpecs = document.getElementById('projectModalSpecs');
  const projectDemoLink = document.getElementById('projectModalLink');

  const projectDossiers = {
    motion: {
      title: '3D Motion Morphism',
      category: 'Visual Alchemy & WebGL',
      desc: 'An advanced 3D motion morphism animation exploring topological transformations, dynamic shaders, and real-time vertex displacement.',
      specs: ['Three.js', 'Custom Vertex Shaders', '60 FPS Physics', 'Morph Targets'],
      url: 'https://opty.linkpc.net#portfolio'
    },
    physics: {
      title: 'Game Physics Engine',
      category: 'Interactive Realism',
      desc: 'Interactive rigid body simulation and collision detection engine built natively in JavaScript, demonstrating real-world kinetic properties.',
      specs: ['Verlet Integration', 'Elastic Collisions', 'Canvas 2D / WebGL', 'Spatial Hashing'],
      url: 'https://opty.linkpc.net#portfolio'
    },
    cybertronian: {
      title: 'Cybertronian Interface Deck',
      category: 'Sci-Fi HUD & Audio Matrix',
      desc: 'Optimus Prime command deck aesthetics featuring live telemetry gauges, energy link indicators, and high-frequency auditory feedbacks.',
      specs: ['Modern CSS Grid', 'SVG Waveform Filters', 'Web Audio API', 'Theme Synchronization'],
      url: 'https://opty.linkpc.net#services'
    },
    profile: {
      title: 'Modern Profile Hologram',
      category: '3D Perspective & Sheen',
      desc: 'Contemporary 3D tilt presentation with multi-layered depth parallax, holographic scanlines, and gyroscope device orientation.',
      specs: ['CSS 3D Transforms', 'DeviceOrientation API', 'Dynamic Specular Glare', 'Adaptive Blur'],
      url: 'https://opty.linkpc.net#about'
    }
  };

  const projectPills = document.querySelectorAll('[data-project-key]');
  projectPills.forEach((pill) => {
    pill.addEventListener('click', () => {
      const key = pill.getAttribute('data-project-key');
      const dossier = projectDossiers[key];
      if (dossier && projectModal) {
        projectTitle.textContent = dossier.title;
        projectCategory.textContent = dossier.category;
        projectDesc.textContent = dossier.desc;
        projectDemoLink.href = dossier.url;

        projectSpecs.innerHTML = dossier.specs
          .map((s) => `<span class="tech-pill">${s}</span>`)
          .join('');

        projectModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        audio.playClick();
      }
    });
  });

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
  }

  const closeProjectBtns = document.querySelectorAll('[data-close-project]');
  closeProjectBtns.forEach((btn) => btn.addEventListener('click', closeProjectModal));

  // 13. Live FPS & Telemetry Clock
  let frameCount = 0;
  let lastTime = performance.now();
  const fpsDisplay = document.getElementById('fpsCounter');

  function calculateFps() {
    frameCount++;
    const now = performance.now();
    if (now - lastTime >= 1000) {
      const fps = Math.round((frameCount * 1000) / (now - lastTime));
      if (fpsDisplay) {
        fpsDisplay.textContent = `${fps} FPS`;
      }
      frameCount = 0;
      lastTime = now;
    }
    requestAnimationFrame(calculateFps);
  }
  calculateFps();
});
