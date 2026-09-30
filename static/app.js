document.addEventListener('DOMContentLoaded', function () {


var VanillaTilt = (function () {
    'use strict';

    /**
     * Created by Sergiu Șandor (micku7zu) on 1/27/2017.
     * Original idea: https://github.com/gijsroge/tilt.js
     * MIT License.
     * Version 1.7.3
     */

    class VanillaTilt {
        constructor(element, settings = {}) {
            if (!(element instanceof Node)) {
                throw ("Can't initialize VanillaTilt because " + element + " is not a Node.");
            }

            this.width = null;
            this.height = null;
            this.clientWidth = null;
            this.clientHeight = null;
            this.left = null;
            this.top = null;

            // for Gyroscope sampling
            this.gammazero = null;
            this.betazero = null;
            this.lastgammazero = null;
            this.lastbetazero = null;

            this.transitionTimeout = null;
            this.updateCall = null;
            this.event = null;

            this.updateBind = this.update.bind(this);
            this.resetBind = this.reset.bind(this);

            this.element = element;
            this.settings = this.extendSettings(settings);

            this.reverse = this.settings.reverse ? -1 : 1;
            this.glare = VanillaTilt.isSettingTrue(this.settings.glare);
            this.glarePrerender = VanillaTilt.isSettingTrue(this.settings["glare-prerender"]);
            this.fullPageListening = VanillaTilt.isSettingTrue(this.settings["full-page-listening"]);
            this.gyroscope = VanillaTilt.isSettingTrue(this.settings.gyroscope);
            this.gyroscopeSamples = this.settings.gyroscopeSamples;

            this.elementListener = this.getElementListener();

            if (this.glare) {
                this.prepareGlare();
            }

            if (this.fullPageListening) {
                this.updateClientSize();
            }

            this.addEventListeners();
            this.reset();
            this.updateInitialPosition();
        }

        static isSettingTrue(setting) {
            return setting === "" || setting === true || setting === 1;
        }

        /**
         * Method returns element what will be listen mouse events
         * @return {Node}
         */
        getElementListener() {
            if (this.fullPageListening) {
                return window.document;
            }

            if (typeof this.settings["mouse-event-element"] === "string") {
                const mouseEventElement = document.querySelector(this.settings["mouse-event-element"]);

                if (mouseEventElement) {
                    return mouseEventElement;
                }
            }

            if (this.settings["mouse-event-element"] instanceof Node) {
                return this.settings["mouse-event-element"];
            }

            return this.element;
        }

        /**
         * Method set listen methods for this.elementListener
         * @return {Node}
         */
        addEventListeners() {
            this.onMouseEnterBind = this.onMouseEnter.bind(this);
            this.onMouseMoveBind = this.onMouseMove.bind(this);
            this.onMouseLeaveBind = this.onMouseLeave.bind(this);
            this.onWindowResizeBind = this.onWindowResize.bind(this);
            this.onDeviceOrientationBind = this.onDeviceOrientation.bind(this);

            this.elementListener.addEventListener("mouseenter", this.onMouseEnterBind);
            this.elementListener.addEventListener("mouseleave", this.onMouseLeaveBind);
            this.elementListener.addEventListener("mousemove", this.onMouseMoveBind);

            if (this.glare || this.fullPageListening) {
                window.addEventListener("resize", this.onWindowResizeBind);
            }

            if (this.gyroscope) {
                window.addEventListener("deviceorientation", this.onDeviceOrientationBind);
            }
        }

        /**
         * Method remove event listeners from current this.elementListener
         */
        removeEventListeners() {
            this.elementListener.removeEventListener("mouseenter", this.onMouseEnterBind);
            this.elementListener.removeEventListener("mouseleave", this.onMouseLeaveBind);
            this.elementListener.removeEventListener("mousemove", this.onMouseMoveBind);

            if (this.gyroscope) {
                window.removeEventListener("deviceorientation", this.onDeviceOrientationBind);
            }

            if (this.glare || this.fullPageListening) {
                window.removeEventListener("resize", this.onWindowResizeBind);
            }
        }

        destroy() {
            clearTimeout(this.transitionTimeout);
            if (this.updateCall !== null) {
                cancelAnimationFrame(this.updateCall);
            }

            this.reset();

            this.removeEventListeners();
            this.element.vanillaTilt = null;
            delete this.element.vanillaTilt;

            this.element = null;
        }

        onDeviceOrientation(event) {
            if (event.gamma === null || event.beta === null) {
                return;
            }

            this.updateElementPosition();

            if (this.gyroscopeSamples > 0) {
                this.lastgammazero = this.gammazero;
                this.lastbetazero = this.betazero;

                if (this.gammazero === null) {
                    this.gammazero = event.gamma;
                    this.betazero = event.beta;
                } else {
                    this.gammazero = (event.gamma + this.lastgammazero) / 2;
                    this.betazero = (event.beta + this.lastbetazero) / 2;
                }

                this.gyroscopeSamples -= 1;
            }

            const totalAngleX = this.settings.gyroscopeMaxAngleX - this.settings.gyroscopeMinAngleX;
            const totalAngleY = this.settings.gyroscopeMaxAngleY - this.settings.gyroscopeMinAngleY;

            const degreesPerPixelX = totalAngleX / this.width;
            const degreesPerPixelY = totalAngleY / this.height;

            const angleX = event.gamma - (this.settings.gyroscopeMinAngleX + this.gammazero);
            const angleY = event.beta - (this.settings.gyroscopeMinAngleY + this.betazero);

            const posX = angleX / degreesPerPixelX;
            const posY = angleY / degreesPerPixelY;

            if (this.updateCall !== null) {
                cancelAnimationFrame(this.updateCall);
            }

            this.event = {
                clientX: posX + this.left,
                clientY: posY + this.top,
            };

            this.updateCall = requestAnimationFrame(this.updateBind);
        }

        onMouseEnter() {
            this.updateElementPosition();
            this.element.style.willChange = "transform";
            this.setTransition();
        }

        onMouseMove(event) {
            if (this.updateCall !== null) {
                cancelAnimationFrame(this.updateCall);
            }

            this.event = event;
            this.updateCall = requestAnimationFrame(this.updateBind);
        }

        onMouseLeave() {
            this.setTransition();

            if (this.settings.reset) {
                requestAnimationFrame(this.resetBind);
            }
        }

        reset() {
            this.event = {
                clientX: this.left + this.width / 2,
                clientY: this.top + this.height / 2
            };

            if (this.element && this.element.style) {
                this.element.style.transform = `perspective(${this.settings.perspective}px) ` +
                    `rotateX(0deg) ` +
                    `rotateY(0deg) ` +
                    `scale3d(1, 1, 1)`;
            }

            this.resetGlare();
        }

        resetGlare() {
            if (this.glare) {
                this.glareElement.style.transform = "rotate(180deg) translate(-50%, -50%)";
                this.glareElement.style.opacity = "0";
            }
        }

        updateInitialPosition() {
            if (this.settings.startX === 0 && this.settings.startY === 0) {
                return;
            }

            this.onMouseEnter();

            if (this.fullPageListening) {
                this.event = {
                    clientX: (this.settings.startX + this.settings.max) / (2 * this.settings.max) * this.clientWidth,
                    clientY: (this.settings.startY + this.settings.max) / (2 * this.settings.max) * this.clientHeight
                };
            } else {
                this.event = {
                    clientX: this.left + ((this.settings.startX + this.settings.max) / (2 * this.settings.max) * this.width),
                    clientY: this.top + ((this.settings.startY + this.settings.max) / (2 * this.settings.max) * this.height)
                };
            }


            let backupScale = this.settings.scale;
            this.settings.scale = 1;
            this.update();
            this.settings.scale = backupScale;
            this.resetGlare();
        }

        getValues() {
            let x, y;

            if (this.fullPageListening) {
                x = this.event.clientX / this.clientWidth;
                y = this.event.clientY / this.clientHeight;
            } else {
                x = (this.event.clientX - this.left) / this.width;
                y = (this.event.clientY - this.top) / this.height;
            }

            x = Math.min(Math.max(x, 0), 1);
            y = Math.min(Math.max(y, 0), 1);

            let tiltX = (this.reverse * (this.settings.max - x * this.settings.max * 2)).toFixed(2);
            let tiltY = (this.reverse * (y * this.settings.max * 2 - this.settings.max)).toFixed(2);
            let angle = Math.atan2(this.event.clientX - (this.left + this.width / 2), -(this.event.clientY - (this.top + this.height / 2))) * (180 / Math.PI);

            return {
                tiltX: tiltX,
                tiltY: tiltY,
                percentageX: x * 100,
                percentageY: y * 100,
                angle: angle
            };
        }

        updateElementPosition() {
            let rect = this.element.getBoundingClientRect();

            this.width = this.element.offsetWidth;
            this.height = this.element.offsetHeight;
            this.left = rect.left;
            this.top = rect.top;
        }

        update() {
            let values = this.getValues();

            this.element.style.transform = "perspective(" + this.settings.perspective + "px) " +
                "rotateX(" + (this.settings.axis === "x" ? 0 : values.tiltY) + "deg) " +
                "rotateY(" + (this.settings.axis === "y" ? 0 : values.tiltX) + "deg) " +
                "scale3d(" + this.settings.scale + ", " + this.settings.scale + ", " + this.settings.scale + ")";

            if (this.glare) {
                this.glareElement.style.transform = `rotate(${values.angle}deg) translate(-50%, -50%)`;
                this.glareElement.style.opacity = `${values.percentageY * this.settings["max-glare"] / 100}`;
            }

            this.element.dispatchEvent(new CustomEvent("tiltChange", {
                "detail": values
            }));

            this.updateCall = null;
        }

        /**
         * Appends the glare element (if glarePrerender equals false)
         * and sets the default style
         */
        prepareGlare() {
            // If option pre-render is enabled we assume all html/css is present for an optimal glare effect.
            if (!this.glarePrerender) {
                // Create glare element
                const jsTiltGlare = document.createElement("div");
                jsTiltGlare.classList.add("js-tilt-glare");

                const jsTiltGlareInner = document.createElement("div");
                jsTiltGlareInner.classList.add("js-tilt-glare-inner");

                jsTiltGlare.appendChild(jsTiltGlareInner);
                this.element.appendChild(jsTiltGlare);
            }

            this.glareElementWrapper = this.element.querySelector(".js-tilt-glare");
            this.glareElement = this.element.querySelector(".js-tilt-glare-inner");

            if (this.glarePrerender) {
                return;
            }

            Object.assign(this.glareElementWrapper.style, {
                "position": "absolute",
                "top": "0",
                "left": "0",
                "width": "100%",
                "height": "100%",
                "overflow": "hidden",
                "pointer-events": "none",
                "border-radius": "inherit",
            });

            Object.assign(this.glareElement.style, {
                "position": "absolute",
                "top": "50%",
                "left": "50%",
                "pointer-events": "none",
                "background-image": `linear-gradient(0deg, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)`,
                "transform": "rotate(180deg) translate(-50%, -50%)",
                "transform-origin": "0% 0%",
                "opacity": "0",
            });

            this.updateGlareSize();
        }

        updateGlareSize() {
            if (this.glare) {
                const glareSize = (this.element.offsetWidth > this.element.offsetHeight ? this.element.offsetWidth : this.element.offsetHeight) * 2;

                Object.assign(this.glareElement.style, {
                    "width": `${glareSize}px`,
                    "height": `${glareSize}px`,
                });
            }
        }

        updateClientSize() {
            this.clientWidth = window.innerWidth
                || document.documentElement.clientWidth
                || document.body.clientWidth;

            this.clientHeight = window.innerHeight
                || document.documentElement.clientHeight
                || document.body.clientHeight;
        }

        onWindowResize() {
            this.updateGlareSize();
            this.updateClientSize();
        }

        setTransition() {
            clearTimeout(this.transitionTimeout);
            this.element.style.transition = this.settings.speed + "ms " + this.settings.easing;
            if (this.glare) this.glareElement.style.transition = `opacity ${this.settings.speed}ms ${this.settings.easing}`;

            this.transitionTimeout = setTimeout(() => {
                this.element.style.transition = "";
                if (this.glare) {
                    this.glareElement.style.transition = "";
                }
            }, this.settings.speed);

        }

        /**
         * Method return patched settings of instance
         * @param {boolean} settings.reverse - reverse the tilt direction
         * @param {number} settings.max - max tilt rotation (degrees)
         * @param {startX} settings.startX - the starting tilt on the X axis, in degrees. Default: 0
         * @param {startY} settings.startY - the starting tilt on the Y axis, in degrees. Default: 0
         * @param {number} settings.perspective - Transform perspective, the lower the more extreme the tilt gets
         * @param {string} settings.easing - Easing on enter/exit
         * @param {number} settings.scale - 2 = 200%, 1.5 = 150%, etc..
         * @param {number} settings.speed - Speed of the enter/exit transition
         * @param {boolean} settings.transition - Set a transition on enter/exit
         * @param {string|null} settings.axis - What axis should be enabled. Can be "x" or "y"
         * @param {boolean} settings.glare - if it should have a "glare" effect
         * @param {number} settings.max-glare - the maximum "glare" opacity (1 = 100%, 0.5 = 50%)
         * @param {boolean} settings.glare-prerender - false = VanillaTilt creates the glare elements for you, otherwise
         * @param {boolean} settings.full-page-listening - If true, parallax effect will listen to mouse move events on the whole document, not only the selected element
         * @param {string|object} settings.mouse-event-element - String selector or link to HTML-element what will be listen mouse events
         * @param {boolean} settings.reset - false = If the tilt effect has to be reset on exit
         * @param {gyroscope} settings.gyroscope - Enable tilting by deviceorientation events
         * @param {gyroscopeSensitivity} settings.gyroscopeSensitivity - Between 0 and 1 - The angle at which max tilt position is reached. 1 = 90deg, 0.5 = 45deg, etc..
         * @param {gyroscopeSamples} settings.gyroscopeSamples - How many gyroscope moves to decide the starting position.
         */
        extendSettings(settings) {
            let defaultSettings = {
                reverse: false,
                max: 25,
                startX: 0,
                startY: 0,
                perspective: 1000,
                easing: "cubic-bezier(.03,.98,.52,.99)",
                scale: 1.05,
                speed: 1000,
                transition: true,
                axis: null,
                glare: false,
                "max-glare": .5,
                "glare-prerender": false,
                "full-page-listening": false,
                "mouse-event-element": null,
                reset: true,
                gyroscope: false,
                gyroscopeMinAngleX: -45,
                gyroscopeMaxAngleX: 45,
                gyroscopeMinAngleY: -45,
                gyroscopeMaxAngleY: 45,
                gyroscopeSamples: 10
            };

            let newSettings = {};
            for (var property in defaultSettings) {
                if (property in settings) {
                    newSettings[property] = settings[property];
                } else if (this.element.hasAttribute("data-tilt-" + property)) {
                    let attribute = this.element.getAttribute("data-tilt-" + property);
                    try {
                        newSettings[property] = JSON.parse(attribute);
                    } catch (e) {
                        newSettings[property] = attribute;
                    }

                } else {
                    newSettings[property] = defaultSettings[property];
                }
            }

            return newSettings;
        }

        static init(elements, settings) {
            if (elements instanceof Node) {
                elements = [elements];
            }

            if (elements instanceof NodeList) {
                elements = [].slice.call(elements);
            }

            if (!(elements instanceof Array)) {
                return;
            }

            elements.forEach((element) => {
                if (!("vanillaTilt" in element)) {
                    element.vanillaTilt = new VanillaTilt(element, settings);
                }
            });
        }
    }

    if (typeof document !== "undefined") {
        /* expose the class to window */
        window.VanillaTilt = VanillaTilt;

        /**
         * Auto load
         */
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"));

        const profileCard = document.querySelector(".profile-card[data-tilt]");
        const tiltToggle = document.getElementById("tiltModeToggle");
        const tiltModeLabel = document.getElementById("tiltModeLabel");
        const tiltModeStatus = document.getElementById("tiltModeStatus");
        const profileTilt = profileCard && profileCard.vanillaTilt;
        const headerLogo = document.getElementById("changingText");

        if (profileCard && "IntersectionObserver" in window) {
            let startupOrbit = true;

            function pickOrbitSpeed() {
                const speed = Math.random() < 0.45
                    ? 1.6 + Math.random() * 1.1
                    : 3.4 + Math.random() * 3.2;
                return `${speed.toFixed(2)}s`;
            }

            const borderObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        profileCard.classList.remove("border-in-view");
                        return;
                    }

                    const reverseOuter = Math.random() < 0.5;
                    profileCard.style.setProperty("--border-outer-speed", pickOrbitSpeed());
                    profileCard.style.setProperty("--border-outer-direction", reverseOuter ? "reverse" : "normal");
                    profileCard.classList.add("border-in-view");

                    if (startupOrbit) {
                        startupOrbit = false;
                        profileCard.classList.add("border-startup");
                        window.setTimeout(() => profileCard.classList.remove("border-startup"), 1800);
                    }
                });
            }, { threshold: 0.2 });

            borderObserver.observe(profileCard);
        }

        if (headerLogo && "IntersectionObserver" in window) {
            headerLogo.addEventListener("animationend", (event) => {
                if (event.animationName === "home-logo-arrival") {
                    headerLogo.classList.remove("home-logo-arrival");
                }
            });

            const sections = [...document.querySelectorAll("section")];
            const themeColors = ["#65e3d1", "#a3f77b", "#6de7ff", "#ffc857", "#d8e8f0", "#9fb3c8", "#ff6d55", "#40ff8b"];
            const commanderColors = ["#58b7ff", "#ff435b", "#ffd166"];
            let activeSection = null;
            let previousColor = getComputedStyle(document.documentElement).getPropertyValue("--main-color").trim();

            function replayHackerSection(section) {
                sections.forEach((item) => item.classList.remove("hacker-section-enter"));

                const rootClasses = document.documentElement.classList;
                if (!section || (!rootClasses.contains("color-9") && !rootClasses.contains("color-10"))) {
                    return;
                }

                void section.offsetWidth;
                section.classList.add("hacker-section-enter");
            }

            const themeClassObserver = new MutationObserver(() => replayHackerSection(activeSection));
            themeClassObserver.observe(document.documentElement, {
                attributes: true,
                attributeFilter: ["class"]
            });

            const sectionObserver = new IntersectionObserver(() => {
                const viewportCenter = window.innerHeight / 2;
                const currentSection = sections.slice().reverse().find((section) => {
                    const bounds = section.getBoundingClientRect();
                    return bounds.top <= viewportCenter && bounds.bottom > viewportCenter;
                });

                if (!currentSection || currentSection === activeSection) {
                    return;
                }

                activeSection = currentSection;
                replayHackerSection(currentSection);
                const sectionColors = document.documentElement.classList.contains("color-10")
                    ? commanderColors
                    : themeColors;
                const availableColors = sectionColors.filter((color) => color !== previousColor);
                previousColor = availableColors[Math.floor(Math.random() * availableColors.length)];
                headerLogo.style.setProperty("--section-logo-color", previousColor);
                headerLogo.classList.remove("section-logo-pulse", "home-logo-arrival");
                void headerLogo.offsetWidth;
                headerLogo.classList.add("section-logo-pulse");
            }, { rootMargin: "-49% 0px -49% 0px", threshold: 0 });

            sections.forEach((section) => sectionObserver.observe(section));
        }

        if (profileTilt && tiltToggle) {
            function setTiltMode(mode) {
                const useGyroscope = mode === "gyro";
                const listener = profileTilt.elementListener;

                listener.removeEventListener("mouseenter", profileTilt.onMouseEnterBind);
                listener.removeEventListener("mouseleave", profileTilt.onMouseLeaveBind);
                listener.removeEventListener("mousemove", profileTilt.onMouseMoveBind);
                window.removeEventListener("deviceorientation", profileTilt.onDeviceOrientationBind);

                profileTilt.gyroscope = useGyroscope;
                profileTilt.settings.gyroscope = useGyroscope;

                if (useGyroscope) {
                    profileTilt.gammazero = null;
                    profileTilt.betazero = null;
                    profileTilt.gyroscopeSamples = profileTilt.settings.gyroscopeSamples;
                    window.addEventListener("deviceorientation", profileTilt.onDeviceOrientationBind);
                } else {
                    listener.addEventListener("mouseenter", profileTilt.onMouseEnterBind);
                    listener.addEventListener("mouseleave", profileTilt.onMouseLeaveBind);
                    listener.addEventListener("mousemove", profileTilt.onMouseMoveBind);
                }

                profileTilt.reset();
                tiltToggle.setAttribute("aria-pressed", String(useGyroscope));
                const actionLabel = useGyroscope ? "Switch to mouse tilt" : "Switch to gyroscope tilt";
                tiltToggle.setAttribute("aria-label", actionLabel);
                tiltToggle.title = actionLabel;
                tiltModeLabel.textContent = useGyroscope ? "Gyroscope tilt" : "Mouse tilt";
                tiltModeStatus.textContent = "";
                tiltModeStatus.classList.remove("is-visible");
            }

            tiltToggle.addEventListener("click", async function () {
                if (!profileTilt.gyroscope) {
                    try {
                        if (typeof window.DeviceOrientationEvent === "undefined") {
                            throw new Error("Device orientation is unavailable.");
                        }

                        if (typeof window.DeviceOrientationEvent.requestPermission === "function") {
                            const permission = await window.DeviceOrientationEvent.requestPermission();
                            if (permission !== "granted") {
                                throw new Error("Motion access was not granted.");
                            }
                        }
                    } catch (error) {
                        tiltModeStatus.textContent = error.message;
                        tiltModeStatus.classList.add("is-visible");
                        return;
                    }

                    setTiltMode("gyro");
                } else {
                    setTiltMode("mouse");
                }
            });

            let touchPointerId = null;

            function finishTouchTilt(event) {
                if (event.pointerId !== touchPointerId) {
                    return;
                }

                touchPointerId = null;
                profileTilt.setTransition();
                if (profileTilt.settings.reset) {
                    requestAnimationFrame(profileTilt.resetBind);
                }
                if (profileTilt.gyroscope) {
                    window.addEventListener("deviceorientation", profileTilt.onDeviceOrientationBind);
                }
            }

            profileCard.addEventListener("pointerdown", function (event) {
                if ((event.pointerType !== "touch" && event.pointerType !== "pen") || event.target.closest("a, button, input, textarea, select")) {
                    return;
                }

                event.preventDefault();
                touchPointerId = event.pointerId;
                profileCard.setPointerCapture(event.pointerId);
                profileTilt.updateElementPosition();
                profileTilt.setTransition();
                profileTilt.onMouseMove(event);

                if (profileTilt.gyroscope) {
                    window.removeEventListener("deviceorientation", profileTilt.onDeviceOrientationBind);
                }
            });

            profileCard.addEventListener("pointermove", function (event) {
                if (event.pointerId === touchPointerId) {
                    profileTilt.onMouseMove(event);
                }
            });

            profileCard.addEventListener("pointerup", finishTouchTilt);
            profileCard.addEventListener("pointercancel", finishTouchTilt);
            profileCard.addEventListener("lostpointercapture", finishTouchTilt);
        }

        const homeScene = document.getElementById("home");
        const homeCopy = homeScene && homeScene.querySelector(".home-content-2nd");
        const profileStage = homeScene && homeScene.querySelector(".container");
        const profileName = homeScene && homeScene.querySelector(".profile-card__desc h1");
        const siteLogo = document.getElementById("changingText");
        const nextSection = homeScene && homeScene.nextElementSibling;
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

        if (homeScene && homeCopy && profileStage && profileName && siteLogo && nextSection && nextSection.id === "about2" && !reducedMotion.matches) {
            homeScene.classList.add("home-scroll-scene");

            let previousScrollY = window.scrollY;
            let scheduledFrame = null;
            let profileScrollPaused = false;
            let nameFlightStarted = false;
            const nameFlight = document.createElement("span");
            nameFlight.className = "profile-name-flight";
            profileName.textContent.trim().split(/\s+/).forEach((word) => {
                const wordElement = document.createElement("span");
                wordElement.className = "profile-name-flight-word";
                wordElement.dataset.word = word;
                wordElement.textContent = word;
                nameFlight.appendChild(wordElement);
            });
            nameFlight.style.opacity = "0";
            nameFlight.setAttribute("aria-hidden", "true");
            document.body.appendChild(nameFlight);
            nameFlight.addEventListener("animationend", (event) => {
                if (event.animationName === "profile-name-flight-arc") {
                    nameFlight.style.opacity = "0";
                    siteLogo.classList.add("home-logo-arrival");
                }
            });

            function setProfileTiltPaused(paused) {
                if (!profileTilt) {
                    return;
                }

                const listener = profileTilt.elementListener;
                listener.removeEventListener("mouseenter", profileTilt.onMouseEnterBind);
                listener.removeEventListener("mouseleave", profileTilt.onMouseLeaveBind);
                listener.removeEventListener("mousemove", profileTilt.onMouseMoveBind);
                window.removeEventListener("deviceorientation", profileTilt.onDeviceOrientationBind);

                if (paused) {
                    if (profileTilt.updateCall !== null) {
                        cancelAnimationFrame(profileTilt.updateCall);
                        profileTilt.updateCall = null;
                    }
                    profileTilt.reset();
                } else if (profileTilt.gyroscope) {
                    window.addEventListener("deviceorientation", profileTilt.onDeviceOrientationBind);
                } else {
                    listener.addEventListener("mouseenter", profileTilt.onMouseEnterBind);
                    listener.addEventListener("mouseleave", profileTilt.onMouseLeaveBind);
                    listener.addEventListener("mousemove", profileTilt.onMouseMoveBind);
                }
            }

            function updateNameFlight(progress, viewportHeight) {
                const flightStart = 0.68;

                if (progress < flightStart) {
                    nameFlightStarted = false;
                    profileName.style.opacity = "";
                    nameFlight.style.opacity = "0";
                    nameFlight.classList.remove("is-flying");
                    siteLogo.classList.remove("home-logo-arrival");
                    return;
                }

                if (nameFlightStarted) {
                    profileName.style.opacity = "0";
                    return;
                }

                nameFlightStarted = true;
                const sourceRect = profileName.getBoundingClientRect();
                const targetRect = siteLogo.getBoundingClientRect();
                const sourceStyle = getComputedStyle(profileName);
                const sourceFontSize = (parseFloat(sourceStyle.fontSize) || 30)
                    * (sourceRect.width / Math.max(profileName.offsetWidth, 1));
                const targetFontSize = parseFloat(getComputedStyle(siteLogo).fontSize) || 20;
                const rawStartX = sourceRect.left + sourceRect.width / 2;
                const rawStartY = sourceRect.top + sourceRect.height / 2;
                const startX = Math.min(Math.max(rawStartX, 20), window.innerWidth - 20);
                const startY = rawStartY >= 0 && rawStartY <= viewportHeight
                    ? rawStartY
                    : viewportHeight * 0.52;
                const targetX = targetRect.left + targetRect.width / 2;
                const targetY = targetRect.top + targetRect.height / 2;
                const midX = startX + (targetX - startX) * 0.52;
                const midY = startY + (targetY - startY) * 0.52 - viewportHeight * 0.16;
                const endScale = targetFontSize / Math.max(sourceFontSize, 1);

                nameFlight.style.fontFamily = sourceStyle.fontFamily;
                nameFlight.style.fontSize = `${sourceFontSize}px`;
                nameFlight.style.fontWeight = sourceStyle.fontWeight;
                nameFlight.style.setProperty("--flight-start-x", `${startX}px`);
                nameFlight.style.setProperty("--flight-start-y", `${startY}px`);
                nameFlight.style.setProperty("--flight-mid-x", `${midX}px`);
                nameFlight.style.setProperty("--flight-mid-y", `${midY}px`);
                nameFlight.style.setProperty("--flight-target-x", `${targetX}px`);
                nameFlight.style.setProperty("--flight-target-y", `${targetY}px`);
                nameFlight.style.setProperty("--flight-end-scale", String(endScale));
                profileName.style.opacity = "0";
                nameFlight.classList.add("is-flying");
            }

            function updateHomeScene() {
                if (scheduledFrame !== null) {
                    return;
                }

                scheduledFrame = requestAnimationFrame(() => {
                    scheduledFrame = null;

                    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
                    const sceneRect = homeScene.getBoundingClientRect();
                    const sceneDistance = Math.max(homeScene.offsetHeight - viewportHeight, 1);
                    const progress = Math.min(Math.max(-sceneRect.top / sceneDistance, 0), 1);
                    const fadeProgress = Math.min(Math.max((progress - 0.72) / 0.25, 0), 1);
                    const sharedOpacity = 1 - fadeProgress;
                    const handoffProgress = fadeProgress;
                    const centerProgress = Math.min(Math.max((progress - 0.12) / 0.5, 0), 1);
                    const centerEase = centerProgress * centerProgress * (3 - 2 * centerProgress);
                    const stageOffsetParent = profileStage.offsetParent;
                    const stageBaseCenter = (stageOffsetParent ? stageOffsetParent.getBoundingClientRect().left : sceneRect.left)
                        + profileStage.offsetLeft + profileStage.offsetWidth / 2;
                    const cardCenterOffset = (window.innerWidth / 2 - stageBaseCenter) * centerEase;
                    const currentScrollY = window.scrollY;
                    const pauseProfile = progress > 0 && sceneRect.bottom > 0 && sceneRect.top < viewportHeight;

                    if (pauseProfile !== profileScrollPaused) {
                        profileScrollPaused = pauseProfile;
                        homeScene.classList.toggle("home-scroll-active", pauseProfile);
                        setProfileTiltPaused(pauseProfile);
                    }

                    homeScene.classList.toggle("home-name-active", progress >= 0.28 && progress < 0.72);

                    if (currentScrollY !== previousScrollY && sceneRect.bottom > 0 && sceneRect.top < viewportHeight) {
                        homeScene.dataset.scrollDirection = currentScrollY < previousScrollY ? "up" : "down";
                    }

                    previousScrollY = currentScrollY;

                    homeScene.style.setProperty("--home-backdrop-opacity", String(1 - progress * 0.55));
                    homeScene.style.setProperty("--home-backdrop-shift", `${-18 * progress}vh`);
                    homeScene.style.setProperty("--home-scene-opacity", String(1 - handoffProgress));
                    homeScene.style.setProperty("--home-copy-opacity", String(sharedOpacity));
                    homeScene.style.setProperty("--home-copy-shift", `${-8 * progress}vw`);
                    homeScene.style.setProperty("--home-copy-rise", `${-3 * progress}vh`);
                    homeScene.style.setProperty("--home-card-x", `${cardCenterOffset}px`);
                    homeScene.style.setProperty("--home-card-scale", String(1 + progress * 1.15));
                    homeScene.style.setProperty("--home-card-opacity", String(sharedOpacity));
                    homeScene.style.setProperty("--home-card-rise", `${-5 * progress}vh`);
                    nextSection.style.setProperty("--home-next-overlap", `${-sceneDistance * handoffProgress}px`);
                    updateNameFlight(progress, viewportHeight);

                    if (progress >= 0.96 && sceneRect.bottom > -viewportHeight / 2) {
                        const storeLink = document.querySelector('#navLinks a[href="#about2"]');
                        const activeRectangle = document.getElementById("activeRectangle");

                        if (storeLink && activeRectangle) {
                            document.querySelectorAll("#navLinks a").forEach((link) => {
                                link.classList.toggle("active", link === storeLink);
                            });
                            activeRectangle.textContent = storeLink.textContent.trim();
                        }
                    }
                });
            }

            window.addEventListener("scroll", updateHomeScene, { passive: true });
            window.addEventListener("resize", updateHomeScene);
            updateHomeScene();
        }
    }

    return VanillaTilt;

}());

});

