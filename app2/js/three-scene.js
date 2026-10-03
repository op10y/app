/**
 * CYBERTRONIAN 3D CORE & WEBGL PARTICLE MATRIX
 * Interactive Three.js Experience for Abid Hussain Portfolio
 */

class CybertronianScene {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.scene = null;
    this.camera = null;
    this.renderer = null;

    // 3D Objects
    this.coreGroup = null;
    this.innerCore = null;
    this.innerSolid = null;
    this.ringGroup = null;
    this.rings = [];
    this.shards = [];
    this.particles = null;
    this.particlePositions = null;
    this.initialParticlePositions = null;
    this.particleVelocities = null;
    this.particleCount = 1200;

    // Lights
    this.cursorLight = null;
    this.ambientLight = null;
    this.keyLight = null;

    // Mouse & Gyro tracking
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;
    this.gyro = { gamma: 0, beta: 0, active: false };
    this.clock = new THREE.Clock();

    // Scene States
    this.wireframeOnly = false;
    this.isShockwaving = false;
    this.shockwaveProgress = 0;
    this.primaryColor = new THREE.Color(0x00f3ff);
    this.secondaryColor = new THREE.Color(0x0077fe);

    this.init();
  }

  init() {
    // 1. Scene & Camera setup
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x030712, 0.002);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(55, aspect, 0.1, 1000);
    this.camera.position.set(0, 0, 85);

    // 2. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.2;
    this.container.appendChild(this.renderer.domElement);

    // 3. Lighting
    this.ambientLight = new THREE.AmbientLight(0x0a1530, 2.2);
    this.scene.add(this.ambientLight);

    this.keyLight = new THREE.DirectionalLight(this.primaryColor, 3.5);
    this.keyLight.position.set(30, 40, 50);
    this.scene.add(this.keyLight);

    const rimLight = new THREE.DirectionalLight(0xff2a5f, 2.0);
    rimLight.position.set(-40, -30, -30);
    this.scene.add(rimLight);

    this.cursorLight = new THREE.PointLight(this.primaryColor, 4.0, 90);
    this.cursorLight.position.set(0, 0, 40);
    this.scene.add(this.cursorLight);

    // 4. Build 3D Entities
    this.buildCore();
    this.buildGimbalRings();
    this.buildOrbitingShards();
    this.buildParticleField();

    // 5. Event Listeners
    window.addEventListener('resize', this.onWindowResize.bind(this));
    window.addEventListener('mousemove', this.onMouseMove.bind(this));
    window.addEventListener('touchmove', this.onTouchMove.bind(this), { passive: true });
    window.addEventListener('deviceorientation', this.onDeviceOrientation.bind(this));

    // 6. Start Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  buildCore() {
    this.coreGroup = new THREE.Group();
    // Position offset: right on desktop, top halo behind avatar on mobile
    this.coreGroup.position.set(window.innerWidth > 900 ? 16 : 0, window.innerWidth > 900 ? 0 : 8, 0);

    // Inner Glowing Icosahedron
    const coreGeo = new THREE.IcosahedronGeometry(11, 2);
    this.coreWireMat = new THREE.MeshStandardMaterial({
      color: this.primaryColor,
      emissive: this.primaryColor,
      emissiveIntensity: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.85
    });
    this.innerCore = new THREE.Mesh(coreGeo, this.coreWireMat);
    this.coreGroup.add(this.innerCore);

    // Inner Semi-transparent Dark Tech Nucleus
    const nucleusGeo = new THREE.IcosahedronGeometry(8.5, 3);
    this.nucleusMat = new THREE.MeshPhysicalMaterial({
      color: 0x051329,
      roughness: 0.2,
      metalness: 0.9,
      transmission: 0.6,
      thickness: 1.2,
      emissive: 0x002244,
      emissiveIntensity: 0.4
    });
    this.innerSolid = new THREE.Mesh(nucleusGeo, this.nucleusMat);
    this.coreGroup.add(this.innerSolid);

    // Spark of Leadership / Energon Point
    const sparkGeo = new THREE.SphereGeometry(2.5, 16, 16);
    this.sparkMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: false
    });
    const sparkMesh = new THREE.Mesh(sparkGeo, this.sparkMat);
    this.coreGroup.add(sparkMesh);

    this.scene.add(this.coreGroup);
  }

  buildGimbalRings() {
    this.ringGroup = new THREE.Group();

    const ringRadii = [18, 24, 30];
    const ringTubes = [0.25, 0.35, 0.2];

    ringRadii.forEach((r, idx) => {
      const ringGeo = new THREE.TorusGeometry(r, ringTubes[idx], 16, 100);
      const ringMat = new THREE.MeshStandardMaterial({
        color: idx === 1 ? this.secondaryColor : this.primaryColor,
        emissive: idx === 1 ? this.secondaryColor : this.primaryColor,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
        wireframe: true
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);

      // Angle initial orientations
      if (idx === 0) ringMesh.rotation.x = Math.PI / 4;
      if (idx === 1) ringMesh.rotation.y = Math.PI / 3;
      if (idx === 2) ringMesh.rotation.z = Math.PI / 6;

      this.rings.push(ringMesh);
      this.ringGroup.add(ringMesh);
    });

    this.coreGroup.add(this.ringGroup);
  }

  buildOrbitingShards() {
    const shardCount = 14;
    const shardGeo = new THREE.OctahedronGeometry(1.2, 0);

    for (let i = 0; i < shardCount; i++) {
      const shardMat = new THREE.MeshStandardMaterial({
        color: i % 2 === 0 ? this.primaryColor : 0xffffff,
        emissive: this.primaryColor,
        emissiveIntensity: 0.8,
        metalness: 0.9,
        roughness: 0.1
      });
      const shard = new THREE.Mesh(shardGeo, shardMat);
      
      const angle = (i / shardCount) * Math.PI * 2;
      const radius = 20 + Math.sin(i * 3) * 6;
      shard.position.set(
        Math.cos(angle) * radius,
        (Math.random() - 0.5) * 16,
        Math.sin(angle) * radius
      );
      shard.userData = {
        angle: angle,
        radius: radius,
        speed: 0.008 + (i % 3) * 0.005,
        elevationSpeed: 0.015 + (i % 2) * 0.01,
        initialY: shard.position.y
      };

      this.shards.push(shard);
      this.coreGroup.add(shard);
    }
  }

  buildParticleField() {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(this.particleCount * 3);
    const initialPos = new Float32Array(this.particleCount * 3);
    const vels = new Float32Array(this.particleCount * 3);

    for (let i = 0; i < this.particleCount; i++) {
      const idx = i * 3;
      // Distribute in a wide cylindrical cyber-field
      const u = Math.random();
      const r = 25 + Math.random() * 110;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 100;

      const px = Math.cos(theta) * r;
      const py = y;
      const pz = Math.sin(theta) * r;

      pos[idx] = px;
      pos[idx + 1] = py;
      pos[idx + 2] = pz;

      initialPos[idx] = px;
      initialPos[idx + 1] = py;
      initialPos[idx + 2] = pz;

      vels[idx] = 0;
      vels[idx + 1] = 0;
      vels[idx + 2] = 0;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    this.particlePositions = pos;
    this.initialParticlePositions = initialPos;
    this.particleVelocities = vels;

    this.particleMat = new THREE.PointsMaterial({
      size: 1.4,
      color: this.primaryColor,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    this.particles = new THREE.Points(geo, this.particleMat);
    this.scene.add(this.particles);
  }

  triggerShockwave() {
    this.isShockwaving = true;
    this.shockwaveProgress = 0;
  }

  setTheme(themeName) {
    let pColor = 0x00f3ff;
    let sColor = 0x0077fe;

    if (themeName === 'crimson') {
      pColor = 0xff2a5f;
      sColor = 0xff6b35;
    } else if (themeName === 'gold') {
      pColor = 0xffb703;
      sColor = 0xfb8500;
    } else if (themeName === 'emerald') {
      pColor = 0x00ffaa;
      sColor = 0x00b4d8;
    } else if (themeName === 'purple') {
      pColor = 0xb5179e;
      sColor = 0x7209b7;
    }

    this.primaryColor.setHex(pColor);
    this.secondaryColor.setHex(sColor);

    if (this.coreWireMat) {
      this.coreWireMat.color.copy(this.primaryColor);
      this.coreWireMat.emissive.copy(this.primaryColor);
    }
    if (this.particleMat) {
      this.particleMat.color.copy(this.primaryColor);
    }
    if (this.keyLight) {
      this.keyLight.color.copy(this.primaryColor);
    }
    if (this.cursorLight) {
      this.cursorLight.color.copy(this.primaryColor);
    }
    this.rings.forEach((ring, idx) => {
      ring.material.color.copy(idx === 1 ? this.secondaryColor : this.primaryColor);
      ring.material.emissive.copy(idx === 1 ? this.secondaryColor : this.primaryColor);
    });
  }

  toggleWireframe() {
    this.wireframeOnly = !this.wireframeOnly;
    if (this.innerSolid) {
      this.innerSolid.visible = !this.wireframeOnly;
    }
    return this.wireframeOnly;
  }

  onMouseMove(e) {
    this.mouse.targetX = (e.clientX - this.windowHalfX) * 0.05;
    this.mouse.targetY = (e.clientY - this.windowHalfY) * 0.05;

    // Move cursor light in 3D
    const normX = (e.clientX / window.innerWidth) * 2 - 1;
    const normY = -(e.clientY / window.innerHeight) * 2 + 1;
    if (this.cursorLight) {
      this.cursorLight.position.x = normX * 45;
      this.cursorLight.position.y = normY * 30;
    }
  }

  onTouchMove(e) {
    if (e.touches.length > 0) {
      this.mouse.targetX = (e.touches[0].clientX - this.windowHalfX) * 0.06;
      this.mouse.targetY = (e.touches[0].clientY - this.windowHalfY) * 0.06;
    }
  }

  onDeviceOrientation(e) {
    if (e.gamma !== null && e.beta !== null) {
      this.gyro.active = true;
      this.gyro.gamma = e.gamma * 0.6;
      this.gyro.beta = (e.beta - 45) * 0.6;
    }
  }

  onWindowResize() {
    this.windowHalfX = window.innerWidth / 2;
    this.windowHalfY = window.innerHeight / 2;

    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(window.innerWidth, window.innerHeight);

    if (this.coreGroup) {
      this.coreGroup.position.x = window.innerWidth > 900 ? 16 : 0;
      this.coreGroup.position.y = window.innerWidth > 900 ? 0 : 8;
    }
  }

  animate() {
    requestAnimationFrame(this.animate);

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    // Lerp smooth mouse/gyro easing
    if (this.gyro.active) {
      this.mouse.x += (this.gyro.gamma - this.mouse.x) * 0.05;
      this.mouse.y += (this.gyro.beta - this.mouse.y) * 0.05;
    } else {
      this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
      this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;
    }

    // Parallax Camera Drift
    this.camera.position.x += (this.mouse.x * 0.6 - this.camera.position.x) * 0.03;
    this.camera.position.y += (-this.mouse.y * 0.6 - this.camera.position.y) * 0.03;
    this.camera.lookAt(0, 0, 0);

    // Core Rotation & Breathing
    if (this.coreGroup) {
      this.innerCore.rotation.x += 0.008;
      this.innerCore.rotation.y += 0.012;

      this.innerSolid.rotation.x -= 0.005;
      this.innerSolid.rotation.y -= 0.009;

      const scalePulse = 1 + Math.sin(elapsedTime * 2.5) * 0.04;
      this.innerCore.scale.set(scalePulse, scalePulse, scalePulse);

      // Rings counter-rotation
      if (this.rings.length >= 3) {
        this.rings[0].rotation.x += 0.015;
        this.rings[0].rotation.y += 0.008;

        this.rings[1].rotation.y -= 0.018;
        this.rings[1].rotation.z += 0.01;

        this.rings[2].rotation.z += 0.022;
        this.rings[2].rotation.x -= 0.012;
      }

      // Orbiting Shards
      this.shards.forEach((shard) => {
        shard.userData.angle += shard.userData.speed;
        const r = shard.userData.radius;
        shard.position.x = Math.cos(shard.userData.angle) * r;
        shard.position.z = Math.sin(shard.userData.angle) * r;
        shard.position.y = shard.userData.initialY + Math.sin(elapsedTime * 2 + shard.userData.angle) * 3;
        shard.rotation.x += 0.03;
        shard.rotation.y += 0.02;
      });
    }

    // Shockwave or Dynamic Particle drift
    if (this.particles) {
      const pos = this.particles.geometry.attributes.position.array;

      if (this.isShockwaving) {
        this.shockwaveProgress += delta * 1.5;
        const wave = Math.sin(this.shockwaveProgress * Math.PI);

        for (let i = 0; i < this.particleCount; i++) {
          const idx = i * 3;
          const origX = this.initialParticlePositions[idx];
          const origY = this.initialParticlePositions[idx + 1];
          const origZ = this.initialParticlePositions[idx + 2];

          const dist = Math.sqrt(origX * origX + origY * origY + origZ * origZ);
          const push = wave * (dist * 0.6);

          pos[idx] = origX + (origX / dist) * push;
          pos[idx + 1] = origY + (origY / dist) * push;
          pos[idx + 2] = origZ + (origZ / dist) * push;
        }

        if (this.shockwaveProgress >= 1) {
          this.isShockwaving = false;
        }
      } else {
        // Subtle organic floating motion
        for (let i = 0; i < this.particleCount; i += 4) {
          const idx = i * 3;
          pos[idx + 1] = this.initialParticlePositions[idx + 1] + Math.sin(elapsedTime * 0.8 + i) * 2;
        }
      }

      this.particles.geometry.attributes.position.needsUpdate = true;
      this.particles.rotation.y += 0.0008;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.CybertronianScene = CybertronianScene;
