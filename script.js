// Pattern B: Fluid Wave + Holographic Bubble Hybrid
class HybridBackground {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.time = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        
        this.resize();
        this.setupMouseTracking();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }
    
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    setupMouseTracking() {
        document.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX / window.innerWidth;
            this.mouseY = e.clientY / window.innerHeight;
        });
    }
    
    createBaseGradient() {
        const gradient = this.ctx.createLinearGradient(
            0, 0, 
            this.canvas.width, 
            this.canvas.height
        );
        
        const t = this.time * 0.0002;
        
        gradient.addColorStop(0, `rgba(245, 235, 245, ${0.95 + Math.sin(t) * 0.05})`);
        gradient.addColorStop(0.5, `rgba(235, 225, 240, ${0.9 + Math.cos(t * 1.2) * 0.05})`);
        gradient.addColorStop(1, `rgba(240, 230, 245, ${0.92 + Math.sin(t * 0.8) * 0.05})`);
        
        return gradient;
    }
    
    drawFluidWave(waveConfig) {
        const { 
            yOffset, 
            amplitude, 
            frequency, 
            speed, 
            color1, 
            color2, 
            opacity,
            height 
        } = waveConfig;
        
        const t = this.time * speed;
        const points = 100;
        
        const gradient = this.ctx.createLinearGradient(
            0, 
            this.canvas.height * yOffset, 
            this.canvas.width, 
            this.canvas.height * yOffset + height
        );
        
        const hue1 = color1 + Math.sin(t * 0.5) * 20;
        const hue2 = color2 + Math.cos(t * 0.6) * 25;
        
        gradient.addColorStop(0, `hsla(${hue1}, 75%, 85%, ${opacity})`);
        gradient.addColorStop(0.5, `hsla(${hue2}, 70%, 80%, ${opacity * 0.8})`);
        gradient.addColorStop(1, `hsla(${hue1 + 10}, 65%, 75%, ${opacity * 0.6})`);
        
        this.ctx.fillStyle = gradient;
        this.ctx.beginPath();
        
        for (let i = 0; i <= points; i++) {
            const x = (i / points) * this.canvas.width;
            const baseY = this.canvas.height * yOffset;
            
            const wave1 = Math.sin((x / this.canvas.width) * frequency * Math.PI * 2 + t) * amplitude;
            const wave2 = Math.sin((x / this.canvas.width) * frequency * Math.PI * 2 * 1.5 + t * 1.3) * amplitude * 0.5;
            const wave3 = Math.sin((x / this.canvas.width) * frequency * Math.PI * 2 * 0.8 + t * 0.7) * amplitude * 0.3;
            
            const y = baseY + wave1 + wave2 + wave3;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
        }
        
        this.ctx.lineTo(this.canvas.width, this.canvas.height * yOffset + height);
        this.ctx.lineTo(0, this.canvas.height * yOffset + height);
        this.ctx.closePath();
        this.ctx.fill();
    }
    
    drawFluidWaves() {
        // Wave 1: Blue wave (back)
        this.drawFluidWave({
            yOffset: 0.35,
            amplitude: 60,
            frequency: 2,
            speed: 0.0008,
            color1: 200,
            color2: 220,
            opacity: 0.3,
            height: 400
        });
        
        // Wave 2: Purple wave (middle)
        this.drawFluidWave({
            yOffset: 0.4,
            amplitude: 70,
            frequency: 1.8,
            speed: 0.001,
            color1: 280,
            color2: 300,
            opacity: 0.35,
            height: 450
        });
        
        // Wave 3: Pink wave (middle-front)
        this.drawFluidWave({
            yOffset: 0.45,
            amplitude: 55,
            frequency: 2.2,
            speed: 0.0012,
            color1: 320,
            color2: 340,
            opacity: 0.33,
            height: 380
        });
    }
    
    drawHolographicBubble() {
        const t = this.time * 0.002;
        const isMobile = window.innerWidth <= 768;
        
        let bubbleX, bubbleY, bubbleSize;
        
        if (isMobile) {
            bubbleX = this.canvas.width * 0.5;
            bubbleY = this.canvas.height * 0.85 + Math.sin(t * 2) * 20;
            bubbleSize = Math.min(this.canvas.width, this.canvas.height) * 0.5;
        } else {
            bubbleX = this.canvas.width * 0.75 + Math.sin(t * 1.5) * 30;
            bubbleY = this.canvas.height * 0.35 + Math.cos(t * 1.5) * 25;
            bubbleSize = Math.min(this.canvas.width, this.canvas.height) * 0.45;
        }
        
        // Wave effect inside bubble
        const wave1CenterX = bubbleX + Math.cos(t * 1.5) * bubbleSize * 0.4;
        const wave1CenterY = bubbleY + Math.sin(t * 1.5) * bubbleSize * 0.4;
        
        const wave1Gradient = this.ctx.createRadialGradient(
            wave1CenterX, wave1CenterY, 0,
            bubbleX, bubbleY, bubbleSize
        );
        
        const hue1 = 320 + Math.sin(t * 1.2) * 40;
        const hue2 = 200 + Math.cos(t * 1.5) * 50;
        
        wave1Gradient.addColorStop(0, `hsla(${hue1}, 75%, 88%, 0.4)`);
        wave1Gradient.addColorStop(0.4, `hsla(${hue2}, 65%, 85%, 0.3)`);
        wave1Gradient.addColorStop(0.7, `hsla(${hue1 - 20}, 60%, 80%, 0.2)`);
        wave1Gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = wave1Gradient;
        this.ctx.beginPath();
        this.ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Rim light
        const rimGradient = this.ctx.createRadialGradient(
            bubbleX, bubbleY, bubbleSize * 0.85,
            bubbleX, bubbleY, bubbleSize
        );
        
        rimGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        rimGradient.addColorStop(0.65, `rgba(255, 143, 163, ${0.45 + Math.sin(t * 2) * 0.15})`);
        rimGradient.addColorStop(0.82, `rgba(255, 179, 128, ${0.55 + Math.cos(t * 1.8) * 0.2})`);
        rimGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = rimGradient;
        this.ctx.beginPath();
        this.ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
        this.ctx.fill();
    }
    
    drawLightStreaks() {
        const t = this.time * 0.0012;
        
        const streaks = [
            { x: 0.15, y: 0.6, angle: -25, width: 2.5, length: 350, offset: 0 },
            { x: 0.18, y: 0.55, angle: -25, width: 2, length: 280, offset: Math.PI * 0.3 },
            { x: 0.12, y: 0.65, angle: -25, width: 1.5, length: 230, offset: Math.PI * 0.6 },
        ];
        
        streaks.forEach((streak) => {
            const opacity = 0.2 + Math.sin(t * 2 + streak.offset) * 0.12;
            
            this.ctx.save();
            this.ctx.translate(
                this.canvas.width * streak.x, 
                this.canvas.height * streak.y
            );
            this.ctx.rotate((streak.angle * Math.PI) / 180);
            
            const gradient = this.ctx.createLinearGradient(0, 0, streak.length, 0);
            gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
            gradient.addColorStop(0.25, `rgba(255, 255, 255, ${opacity * 0.5})`);
            gradient.addColorStop(0.5, `rgba(255, 255, 255, ${opacity})`);
            gradient.addColorStop(0.75, `rgba(255, 255, 255, ${opacity * 0.6})`);
            gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, -streak.width / 2, streak.length, streak.width);
            this.ctx.restore();
        });
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 1. Base gradient
        this.ctx.fillStyle = this.createBaseGradient();
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 2. Fluid waves (back)
        this.drawFluidWaves();
        
        // 3. Light streaks
        this.drawLightStreaks();
        
        // 4. Holographic bubble (front)
        this.drawHolographicBubble();
        
        this.time++;
        requestAnimationFrame(() => this.animate());
    }
}

// Parallax Effect for Bottles
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

// Mobile Menu Toggle
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

// Smooth Scroll
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

// Performance optimization for mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('backgroundCanvas');
    if (canvas) {
        new HybridBackground(canvas);
    }
    
    if (!isMobile()) {
        new ParallaxEffect();
    }
    
    new MobileMenu();
    initSmoothScroll();
    
    document.body.classList.add('loaded');
});

// Handle window resize
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
