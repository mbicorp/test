// ===================================
// Three.js Bubble Background with Fresnel & Holographic Effects
// ===================================

class BubbleBackground {
    constructor(container) {
        this.container = container;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.bubbles = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.init();
        this.createBubbles();
        this.setupEventListeners();
        this.animate();
    }
    
    init() {
        // Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xf5f0f5);
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 8;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const pointLight1 = new THREE.PointLight(0xffc0cb, 1, 100);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0xadd8e6, 0.8, 100);
        pointLight2.position.set(-5, -3, 3);
        this.scene.add(pointLight2);
        
        const pointLight3 = new THREE.PointLight(0xdda0dd, 0.9, 100);
        pointLight3.position.set(0, -5, -5);
        this.scene.add(pointLight3);
    }
    
    // Fresnel + Holographic Shader
    createBubbleShader() {
        return {
            uniforms: {
                time: { value: 0 },
                resolution: { value: new THREE.Vector2() },
                mousePos: { value: new THREE.Vector2() },
                color1: { value: new THREE.Color(0xffb6c1) }, // Light pink
                color2: { value: new THREE.Color(0xadd8e6) }, // Light blue
                color3: { value: new THREE.Color(0xdda0dd) }, // Plum
                color4: { value: new THREE.Color(0xffc0cb) }, // Pink
                fresnelPower: { value: 2.5 },
                refractionRatio: { value: 0.98 }
            },
            vertexShader: `
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec3 vViewPosition;
                varying vec2 vUv;
                
                void main() {
                    vUv = uv;
                    vNormal = normalize(normalMatrix * normal);
                    vPosition = position;
                    
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    vViewPosition = -mvPosition.xyz;
                    
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform float time;
                uniform vec2 resolution;
                uniform vec2 mousePos;
                uniform vec3 color1;
                uniform vec3 color2;
                uniform vec3 color3;
                uniform vec3 color4;
                uniform float fresnelPower;
                uniform float refractionRatio;
                
                varying vec3 vNormal;
                varying vec3 vPosition;
                varying vec3 vViewPosition;
                varying vec2 vUv;
                
                // Noise function for organic movement
                float noise(vec3 p) {
                    return fract(sin(dot(p, vec3(12.9898, 78.233, 45.5432))) * 43758.5453);
                }
                
                void main() {
                    // Fresnel effect
                    vec3 viewDirection = normalize(vViewPosition);
                    float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), fresnelPower);
                    
                    // Holographic color cycling
                    float angle = atan(vUv.y - 0.5, vUv.x - 0.5);
                    float radius = length(vUv - 0.5);
                    
                    float colorCycle = sin(time * 0.5 + angle * 3.0 + radius * 5.0) * 0.5 + 0.5;
                    
                    // Mix multiple colors for iridescent effect
                    vec3 color = mix(color1, color2, sin(time * 0.3 + vPosition.y * 2.0) * 0.5 + 0.5);
                    color = mix(color, color3, sin(time * 0.4 + vPosition.x * 2.0) * 0.5 + 0.5);
                    color = mix(color, color4, colorCycle);
                    
                    // Add shimmer based on viewing angle
                    float shimmer = sin(time * 2.0 + vPosition.x * 10.0 + vPosition.y * 10.0) * 0.5 + 0.5;
                    color += vec3(shimmer * 0.2);
                    
                    // Enhanced edge glow
                    float edgeGlow = pow(fresnel, 1.5) * 1.5;
                    color += vec3(edgeGlow * 0.4);
                    
                    // Refraction-like distortion
                    vec3 refractColor = color * (1.0 - fresnel * 0.3);
                    
                    // Final transparency with Fresnel
                    float alpha = 0.3 + fresnel * 0.5;
                    
                    // Pulsating effect
                    alpha *= 0.9 + sin(time * 1.5) * 0.1;
                    
                    gl_FragColor = vec4(refractColor, alpha);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            blending: THREE.AdditiveBlending
        };
    }
    
    createBubbles() {
        const bubbleCount = window.innerWidth < 768 ? 6 : 10;
        
        for (let i = 0; i < bubbleCount; i++) {
            const size = Math.random() * 1.5 + 0.8;
            const geometry = new THREE.SphereGeometry(size, 64, 64);
            const shaderData = this.createBubbleShader();
            
            const material = new THREE.ShaderMaterial({
                uniforms: shaderData.uniforms,
                vertexShader: shaderData.vertexShader,
                fragmentShader: shaderData.fragmentShader,
                transparent: shaderData.transparent,
                side: shaderData.side,
                depthWrite: shaderData.depthWrite,
                blending: shaderData.blending
            });
            
            const bubble = new THREE.Mesh(geometry, material);
            
            // Random positioning
            bubble.position.x = (Math.random() - 0.5) * 15;
            bubble.position.y = (Math.random() - 0.5) * 10;
            bubble.position.z = (Math.random() - 0.5) * 10 - 5;
            
            // Animation properties
            bubble.userData = {
                speedX: (Math.random() - 0.5) * 0.01,
                speedY: (Math.random() - 0.5) * 0.01,
                speedZ: (Math.random() - 0.5) * 0.005,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                floatSpeed: Math.random() * 0.02 + 0.01,
                floatAmplitude: Math.random() * 0.5 + 0.3,
                initialY: bubble.position.y
            };
            
            this.bubbles.push(bubble);
            this.scene.add(bubble);
        }
    }
    
    setupEventListeners() {
        window.addEventListener('resize', () => this.onResize());
        document.addEventListener('mousemove', (e) => this.onMouseMove(e));
    }
    
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    onMouseMove(event) {
        this.targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.time += 0.01;
        
        // Smooth mouse following
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        
        // Animate bubbles
        this.bubbles.forEach((bubble, index) => {
            const userData = bubble.userData;
            
            // Floating motion
            bubble.position.y = userData.initialY + 
                Math.sin(this.time * userData.floatSpeed + index) * userData.floatAmplitude;
            
            // Slow drift
            bubble.position.x += userData.speedX;
            bubble.position.z += userData.speedZ;
            
            // Rotation
            bubble.rotation.x += userData.rotationSpeed;
            bubble.rotation.y += userData.rotationSpeed * 0.7;
            
            // Mouse interaction
            const distance = Math.sqrt(
                Math.pow(bubble.position.x / 8 - this.mouse.x, 2) +
                Math.pow(bubble.position.y / 6 - this.mouse.y, 2)
            );
            
            if (distance < 0.5) {
                bubble.position.x += (bubble.position.x / 8 - this.mouse.x) * 0.02;
                bubble.position.y += (bubble.position.y / 6 - this.mouse.y) * 0.02;
            }
            
            // Boundary wrapping
            if (bubble.position.x > 10) bubble.position.x = -10;
            if (bubble.position.x < -10) bubble.position.x = 10;
            if (bubble.position.z > 5) bubble.position.z = -5;
            if (bubble.position.z < -10) bubble.position.z = 5;
            
            // Update shader uniforms
            bubble.material.uniforms.time.value = this.time;
            bubble.material.uniforms.mousePos.value.set(this.mouse.x, this.mouse.y);
        });
        
        // Camera subtle movement
        this.camera.position.x = this.mouse.x * 0.5;
        this.camera.position.y = this.mouse.y * 0.5;
        this.camera.lookAt(this.scene.position);
        
        this.renderer.render(this.scene, this.camera);
    }
}

// ===================================
// Parallax Effect for Bottles
// ===================================

class ParallaxEffect {
    constructor() {
        this.bottles = document.querySelectorAll('.bottle');
        this.mouseX = 0;
        this.mouseY = 0;
        this.targetX = 0;
        this.targetY = 0;
        
        this.init();
    }
    
    init() {
        document.addEventListener('mousemove', (e) => {
            this.targetX = (e.clientX / window.innerWidth - 0.5) * 2;
            this.targetY = (e.clientY / window.innerHeight - 0.5) * 2;
        });
        
        this.animate();
    }
    
    animate() {
        this.mouseX += (this.targetX - this.mouseX) * 0.05;
        this.mouseY += (this.targetY - this.mouseY) * 0.05;
        
        this.bottles.forEach((bottle) => {
            const speed = parseFloat(bottle.dataset.speed) || 1;
            const x = this.mouseX * speed * 15;
            const y = this.mouseY * speed * 15;
            
            bottle.style.transform = `translate(${x}px, ${y}px)`;
        });
        
        requestAnimationFrame(() => this.animate());
    }
}

// ===================================
// Mobile Menu Toggle
// ===================================

class MobileMenu {
    constructor() {
        this.menuBtn = document.querySelector('.mobile-menu-btn');
        this.nav = document.querySelector('.desktop-nav');
        this.isOpen = false;
        
        if (this.menuBtn) {
            this.menuBtn.addEventListener('click', () => this.toggle());
        }
    }
    
    toggle() {
        this.isOpen = !this.isOpen;
        this.menuBtn.classList.toggle('active', this.isOpen);
    }
}

// ===================================
// Smooth Scroll
// ===================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===================================
// Performance Check
// ===================================

function isMobile() {
    return window.innerWidth <= 768;
}

// ===================================
// Initialize Everything
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('three-container');
    
    if (container) {
        new BubbleBackground(container);
    }
    
    if (!isMobile()) {
        new ParallaxEffect();
    }
    
    new MobileMenu();
    initSmoothScroll();
    
    document.body.classList.add('loaded');
});

// ===================================
// Handle Resize
// ===================================

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        if (!isMobile() && !document.querySelector('.parallax-initialized')) {
            new ParallaxEffect();
            document.body.classList.add('parallax-initialized');
        }
    }, 250);
});
