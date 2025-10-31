// Three.js Soap Bubble Effect
// Realistic bubble with Fresnel shader and iridescence

class BubbleScene {
    constructor() {
        this.container = document.getElementById('canvas-container');
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.bubbles = [];
        this.mouse = { x: 0, y: 0 };
        this.targetMouse = { x: 0, y: 0 };
        
        this.init();
        this.createBubbles();
        this.addEventListeners();
        this.animate();
    }
    
    init() {
        // Scene
        this.scene = new THREE.Scene();
        
        // Camera
        this.camera = new THREE.PerspectiveCamera(
            60,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 5;
        
        // Renderer
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.container.appendChild(this.renderer.domElement);
        
        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        this.scene.add(directionalLight);
        
        const directionalLight2 = new THREE.DirectionalLight(0xffc0cb, 0.3);
        directionalLight2.position.set(-5, -5, -5);
        this.scene.add(directionalLight2);
    }
    
    createBubbleMaterial() {
        // Custom Fresnel Shader for bubble effect
        const vertexShader = `
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec2 vUv;
            
            void main() {
                vUv = uv;
                vNormal = normalize(normalMatrix * normal);
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                vViewPosition = -mvPosition.xyz;
                gl_Position = projectionMatrix * mvPosition;
            }
        `;
        
        const fragmentShader = `
            uniform float time;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform vec3 color3;
            uniform float fresnelPower;
            uniform float opacity;
            
            varying vec3 vNormal;
            varying vec3 vViewPosition;
            varying vec2 vUv;
            
            void main() {
                // Fresnel effect
                vec3 viewDir = normalize(vViewPosition);
                float fresnel = pow(1.0 - abs(dot(viewDir, vNormal)), fresnelPower);
                
                // Iridescent color based on angle and time
                float angle = dot(vNormal, viewDir);
                float colorShift = angle * 3.0 + time * 0.5;
                
                vec3 iridescent = mix(
                    mix(color1, color2, sin(colorShift) * 0.5 + 0.5),
                    color3,
                    cos(colorShift * 1.3) * 0.5 + 0.5
                );
                
                // Add some variation based on UV
                float pattern = sin(vUv.x * 10.0 + time) * sin(vUv.y * 10.0 + time * 1.3);
                iridescent += pattern * 0.05;
                
                // Combine fresnel with iridescence
                vec3 finalColor = iridescent * fresnel;
                
                // Edge glow
                float edgeGlow = pow(fresnel, 0.5) * 0.8;
                finalColor += vec3(1.0, 0.95, 1.0) * edgeGlow;
                
                // Output with transparency
                gl_FragColor = vec4(finalColor, opacity * fresnel);
            }
        `;
        
        return new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                color1: { value: new THREE.Color(0xffb6d9) },  // Pink
                color2: { value: new THREE.Color(0xb4d4ff) },  // Light blue
                color3: { value: new THREE.Color(0xffd4a3) },  // Peach
                fresnelPower: { value: 2.5 },
                opacity: { value: 0.6 }
            },
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            transparent: true,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
    }
    
    createBubbles() {
        const bubbleConfigs = [
            {
                size: 1.8,
                position: { x: 2, y: 1, z: 0 },
                speed: 0.0003,
                color1: new THREE.Color(0xffc4e1),
                color2: new THREE.Color(0xc4d4ff),
                color3: new THREE.Color(0xffe4c4)
            },
            {
                size: 1.2,
                position: { x: -1.5, y: -0.5, z: -1 },
                speed: 0.0005,
                color1: new THREE.Color(0xffb6d9),
                color2: new THREE.Color(0xb6d4ff),
                color3: new THREE.Color(0xffd6b6)
            },
            {
                size: 0.8,
                position: { x: 1, y: -1.5, z: -0.5 },
                speed: 0.0007,
                color1: new THREE.Color(0xffd4e1),
                color2: new THREE.Color(0xd4e4ff),
                color3: new THREE.Color(0xfff4d4)
            }
        ];
        
        bubbleConfigs.forEach(config => {
            const geometry = new THREE.SphereGeometry(config.size, 64, 64);
            const material = this.createBubbleMaterial();
            material.uniforms.color1.value = config.color1;
            material.uniforms.color2.value = config.color2;
            material.uniforms.color3.value = config.color3;
            
            const bubble = new THREE.Mesh(geometry, material);
            bubble.position.set(config.position.x, config.position.y, config.position.z);
            
            bubble.userData = {
                originalPosition: { ...config.position },
                speed: config.speed,
                offset: Math.random() * Math.PI * 2
            };
            
            this.scene.add(bubble);
            this.bubbles.push(bubble);
        });
    }
    
    addEventListeners() {
        window.addEventListener('resize', () => this.onResize());
        window.addEventListener('mousemove', (e) => this.onMouseMove(e));
        window.addEventListener('touchmove', (e) => this.onTouchMove(e));
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
    
    onTouchMove(event) {
        if (event.touches.length > 0) {
            this.targetMouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
            this.targetMouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const time = performance.now() * 0.001;
        
        // Smooth mouse following
        this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
        this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;
        
        // Animate bubbles
        this.bubbles.forEach((bubble, index) => {
            const userData = bubble.userData;
            const t = time * userData.speed + userData.offset;
            
            // Floating animation
            bubble.position.x = userData.originalPosition.x + Math.sin(t) * 0.3 + this.mouse.x * 0.5;
            bubble.position.y = userData.originalPosition.y + Math.cos(t * 1.2) * 0.3 + this.mouse.y * 0.5;
            bubble.position.z = userData.originalPosition.z + Math.sin(t * 0.8) * 0.2;
            
            // Gentle rotation
            bubble.rotation.x = time * 0.1 + index;
            bubble.rotation.y = time * 0.15 + index;
            
            // Update shader time uniform
            bubble.material.uniforms.time.value = time;
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new BubbleScene();
});
