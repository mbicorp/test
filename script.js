// Animated Gradient Background with Holographic Bubble
class GradientBackground {
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
    
    createComplexGradient() {
        // Multiple radial gradients for depth
        const gradients = [];
        
        // Base gradient - top left to bottom right
        const baseGradient = this.ctx.createLinearGradient(
            0, 0, 
            this.canvas.width, 
            this.canvas.height
        );
        
        // FASTER color shifts
        const t = this.time * 0.0003; // Increased from 0.0001
        
        // Complex color mixing with more variation
        baseGradient.addColorStop(0, `rgba(245, 232, 245, ${0.88 + Math.sin(t * 2) * 0.12})`); // Light pink-purple
        baseGradient.addColorStop(0.3, `rgba(232, 216, 240, ${0.82 + Math.cos(t * 2.5) * 0.1})`); // Lavender
        baseGradient.addColorStop(0.6, `rgba(216, 232, 248, ${0.78 + Math.sin(t * 1.8) * 0.12})`); // Light blue
        baseGradient.addColorStop(1, `rgba(240, 220, 235, ${0.88 + Math.cos(t * 2.2) * 0.1})`); // Pink-purple
        
        return baseGradient;
    }
    
    drawSoftOrbs() {
        // Soft ambient orbs for atmosphere - FASTER MOVEMENT
        const orbs = [
            { x: 0.15, y: 0.25, size: 380, speed: 0.0008, colors: ['rgba(255, 200, 230, 0.18)', 'rgba(255, 255, 255, 0)'] }, // Increased from 0.0002
            { x: 0.85, y: 0.75, size: 320, speed: 0.001, colors: ['rgba(210, 200, 240, 0.15)', 'rgba(255, 255, 255, 0)'] }, // Increased from 0.00025
            { x: 0.5, y: 0.5, size: 420, speed: 0.0006, colors: ['rgba(220, 210, 255, 0.12)', 'rgba(255, 255, 255, 0)'] }, // Increased from 0.00015
        ];
        
        orbs.forEach((orb, index) => {
            const t = this.time * orb.speed + index * Math.PI * 0.5;
            // Larger movement range
            const x = this.canvas.width * (orb.x + Math.sin(t) * 0.12); // Increased from 0.05
            const y = this.canvas.height * (orb.y + Math.cos(t) * 0.12); // Increased from 0.05
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, orb.size);
            gradient.addColorStop(0, orb.colors[0]);
            gradient.addColorStop(1, orb.colors[1]);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        });
    }
    
    drawHolographicBubble() {
        // FASTER ANIMATION - 5x speed increase
        const t = this.time * 0.002; // Changed from 0.0003 to 0.002
        
        // Position based on screen size (responsive)
        const isMobile = window.innerWidth <= 768;
        
        let bubbleX, bubbleY, bubbleSize;
        
        if (isMobile) {
            // Mobile: bottom center
            bubbleX = this.canvas.width * 0.5;
            bubbleY = this.canvas.height * 0.85 + Math.sin(t * 2) * 20;
            bubbleSize = Math.min(this.canvas.width, this.canvas.height) * 0.6;
        } else {
            // Desktop: top right
            bubbleX = this.canvas.width * 0.75 + Math.sin(t * 1.5) * 30;
            bubbleY = this.canvas.height * 0.35 + Math.cos(t * 1.5) * 25;
            bubbleSize = Math.min(this.canvas.width, this.canvas.height) * 0.5;
        }
        
        // WAVE EFFECT 1: First moving gradient layer (Pink to Blue)
        const wave1CenterX = bubbleX + Math.cos(t * 1.5) * bubbleSize * 0.4;
        const wave1CenterY = bubbleY + Math.sin(t * 1.5) * bubbleSize * 0.4;
        
        const wave1Gradient = this.ctx.createRadialGradient(
            wave1CenterX, 
            wave1CenterY, 
            0,
            bubbleX, 
            bubbleY, 
            bubbleSize
        );
        
        const hue1 = 320 + Math.sin(t * 1.2) * 40; // Pink-purple range (dynamic)
        const hue2 = 200 + Math.cos(t * 1.5) * 50; // Blue range (dynamic)
        
        wave1Gradient.addColorStop(0, `hsla(${hue1}, 75%, 88%, 0.45)`);
        wave1Gradient.addColorStop(0.4, `hsla(${hue2}, 65%, 85%, 0.35)`);
        wave1Gradient.addColorStop(0.7, `hsla(${hue1 - 20}, 60%, 80%, 0.25)`);
        wave1Gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = wave1Gradient;
        this.ctx.beginPath();
        this.ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // WAVE EFFECT 2: Second moving gradient layer (Blue to Purple)
        const wave2CenterX = bubbleX + Math.cos(t * 2 + Math.PI * 0.6) * bubbleSize * 0.5;
        const wave2CenterY = bubbleY + Math.sin(t * 2 + Math.PI * 0.6) * bubbleSize * 0.5;
        
        const wave2Gradient = this.ctx.createRadialGradient(
            wave2CenterX, 
            wave2CenterY, 
            0,
            bubbleX, 
            bubbleY, 
            bubbleSize
        );
        
        const hue3 = 260 + Math.sin(t * 1.8) * 35; // Purple range
        const hue4 = 190 + Math.cos(t * 1.3) * 45; // Cyan-blue range
        
        wave2Gradient.addColorStop(0, `hsla(${hue3}, 70%, 82%, 0.4)`);
        wave2Gradient.addColorStop(0.35, `hsla(${hue4}, 68%, 85%, 0.32)`);
        wave2Gradient.addColorStop(0.65, `hsla(${hue3 + 15}, 65%, 78%, 0.22)`);
        wave2Gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = wave2Gradient;
        this.ctx.beginPath();
        this.ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // WAVE EFFECT 3: Third moving gradient layer (Orange to Pink)
        const wave3CenterX = bubbleX + Math.cos(t * 1.7 + Math.PI) * bubbleSize * 0.45;
        const wave3CenterY = bubbleY + Math.sin(t * 1.7 + Math.PI) * bubbleSize * 0.45;
        
        const wave3Gradient = this.ctx.createRadialGradient(
            wave3CenterX, 
            wave3CenterY, 
            0,
            bubbleX, 
            bubbleY, 
            bubbleSize
        );
        
        const hue5 = 20 + Math.sin(t * 1.6) * 25; // Orange range
        const hue6 = 340 + Math.cos(t * 1.4) * 30; // Pink-red range
        
        wave3Gradient.addColorStop(0, `hsla(${hue5}, 85%, 80%, 0.35)`);
        wave3Gradient.addColorStop(0.4, `hsla(${hue6}, 75%, 82%, 0.28)`);
        wave3Gradient.addColorStop(0.75, `hsla(${hue5 + 10}, 70%, 75%, 0.18)`);
        wave3Gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = wave3Gradient;
        this.ctx.beginPath();
        this.ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Rim light effect (colored edge) - ENHANCED
        const rimGradient = this.ctx.createRadialGradient(
            bubbleX, 
            bubbleY, 
            bubbleSize * 0.85,
            bubbleX, 
            bubbleY, 
            bubbleSize
        );
        
        rimGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        rimGradient.addColorStop(0.65, `rgba(255, 143, 163, ${0.45 + Math.sin(t * 2) * 0.15})`); // Pink
        rimGradient.addColorStop(0.82, `rgba(255, 179, 128, ${0.55 + Math.cos(t * 1.8) * 0.2})`); // Orange
        rimGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = rimGradient;
        this.ctx.beginPath();
        this.ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Inner highlight (soap bubble effect) - MOVING
        const highlightX = bubbleX - bubbleSize * 0.3 + Math.cos(t * 1.2) * 30;
        const highlightY = bubbleY - bubbleSize * 0.3 + Math.sin(t * 1.2) * 30;
        
        const highlightGradient = this.ctx.createRadialGradient(
            highlightX, 
            highlightY, 
            0,
            highlightX, 
            highlightY, 
            bubbleSize * 0.4
        );
        
        highlightGradient.addColorStop(0, `rgba(255, 255, 255, ${0.35 + Math.sin(t * 2.5) * 0.1})`);
        highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.12)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = highlightGradient;
        this.ctx.beginPath();
        this.ctx.arc(
            highlightX, 
            highlightY, 
            bubbleSize * 0.4, 
            0, 
            Math.PI * 2
        );
        this.ctx.fill();
    }
    
    drawLightStreaks() {
        // FASTER ANIMATION - 3x speed
        const t = this.time * 0.0012; // Changed from 0.0004 to 0.0012
        
        // Multiple light streaks
        const streaks = [
            { x: 0.15, y: 0.6, angle: -25, width: 2.5, length: 350, offset: 0 },
            { x: 0.18, y: 0.55, angle: -25, width: 2, length: 280, offset: Math.PI * 0.3 },
            { x: 0.12, y: 0.65, angle: -25, width: 1.5, length: 230, offset: Math.PI * 0.6 },
        ];
        
        streaks.forEach((streak, index) => {
            // Higher opacity range for more visibility
            const opacity = 0.2 + Math.sin(t * 2 + streak.offset) * 0.12;
            
            this.ctx.save();
            this.ctx.translate(
                this.canvas.width * streak.x, 
                this.canvas.height * streak.y
            );
            this.ctx.rotate((streak.angle * Math.PI) / 180);
            
            const gradient = this.ctx.createLinearGradient(
                0, 0, 
                streak.length, 0
            );
            
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
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 1. Draw base complex gradient
        this.ctx.fillStyle = this.createComplexGradient();
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 2. Draw soft ambient orbs
        this.drawSoftOrbs();
        
        // 3. Draw light streaks
        this.drawLightStreaks();
        
        // 4. Draw main holographic bubble (on top)
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
        // Smooth interpolation
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
        
        // You can add mobile menu overlay here if needed
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

// Intersection Observer for Fade-in Animation
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.bottle').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });
}

// Performance optimization for mobile
function isMobile() {
    return window.innerWidth <= 768;
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize gradient background
    const canvas = document.getElementById('backgroundCanvas');
    if (canvas) {
        new GradientBackground(canvas);
    }
    
    // Initialize parallax only on desktop for performance
    if (!isMobile()) {
        new ParallaxEffect();
    }
    
    // Initialize mobile menu
    new MobileMenu();
    
    // Initialize smooth scroll
    initSmoothScroll();
    
    // Initialize scroll animations
    setTimeout(() => {
        initScrollAnimations();
    }, 100);
    
    // Add loaded class for animations
    document.body.classList.add('loaded');
});

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Reinitialize parallax if switching from mobile to desktop
        if (!isMobile() && !document.querySelector('.parallax-initialized')) {
            new ParallaxEffect();
            document.body.classList.add('parallax-initialized');
        }
    }, 250);
});
