# 3D Cyber Portfolio Hero Section

Interactive 3D Portfolio Hero Section built with **Three.js**, **Web Audio API**, and **CSS 3D transforms**. Inspired by Cybertronian / Autobot aesthetics and high-tech HUD interfaces.

## 🚀 Features

- **3D WebGL Matrix Scene**: Real-time rotating cyber core with gimbal orbital rings, floating geometric shards, and 1,200 particle field (Three.js r128).
- **Interactive 3D Holographic Card**: Real-time perspective physics tilt with smooth mouse & gyroscope tracking.
- **Pure 3D Z-Depth Hierarchy**: Multi-layer holographic projections using hardware-accelerated CSS `transform-style: preserve-3d` and staggered `translateZ`.
- **Procedural Audio FX**: Cyber synthesizer sounds generated in real-time with Web Audio API (sound pulses, frequency blips, button clicks).
- **Theme Matrix**: 5 dynamic cyber palettes (Matrix Blue, Cyberpunk Amber, Neon Matrix Green, Synthwave Crimson, Void Violet) with WebGL light & material synchronization.
- **Zero-Scroll Desktop Lock & Mobile Responsive**: Pixel-perfect layout tailored for desktops, tablets, and smartphones.

## 📁 Project Structure

```
├── index.html            # Main HTML5 semantic structure & HUD interface
├── css/
│   └── hero-3d.css       # Complete stylesheet with 3D transforms & themes
├── js/
│   ├── three-scene.js    # Three.js WebGL scene, gimbal rings & particles
│   ├── audio-fx.js       # Procedural Web Audio API sound synthesizer
│   └── hero-app.js       # App controller (tilt physics, typewriter, modals)
├── assets/               # Profile avatar, Cybertronian icon
└── public/               # Resume & downloadable documents
```

## 🛠️ Getting Started

To run locally:

```bash
# Using Python
python3 -m http.server 3000

# Using Node.js
npx serve .
```

Open `http://localhost:3000` in any modern browser.

## 👤 Operator

**Abid Hussain (op10y)**  
Front-End Developer & Digital Artist  
Srinagar, Jammu & Kashmir  
Contact: [27aabii@gmail.com](mailto:27aabii@gmail.com)  
Website: [opty.linkpc.net](https://opty.linkpc.net)
