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
        
        const t = this.time * 0.0001;
        
        // Complex color mixing
        baseGradient.addColorStop(0, `rgba(245, 232, 245, ${0.9 + Math.sin(t) * 0.1})`); // Light pink-purple
        baseGradient.addColorStop(0.3, `rgba(232, 216, 240, ${0.85})`); // Lavender
        baseGradient.addColorStop(0.6, `rgba(216, 232, 248, ${0.8})`); // Light blue
        baseGradient.addColorStop(1, `rgba(240, 220, 235, ${0.9})`); // Pink-purple
        
        return baseGradient;
    }
    
    drawSoftOrbs() {
        // Soft ambient orbs for atmosphere
        const orbs = [
            { x: 0.15, y: 0.25, size: 350, speed: 0.0002, colors: ['rgba(255, 200, 230, 0.15)', 'rgba(255, 255, 255, 0)'] },
            { x: 0.85, y: 0.75, size: 300, speed: 0.00025, colors: ['rgba(210, 200, 240, 0.12)', 'rgba(255, 255, 255, 0)'] },
            { x: 0.5, y: 0.5, size: 400, speed: 0.00015, colors: ['rgba(220, 210, 255, 0.08)', 'rgba(255, 255, 255, 0)'] },
        ];
        
        orbs.forEach((orb, index) => {
            const t = this.time * orb.speed + index * Math.PI * 0.5;
            const x = this.canvas.width * (orb.x + Math.sin(t) * 0.05);
            const y = this.canvas.height * (orb.y + Math.cos(t) * 0.05);
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, orb.size);
            gradient.addColorStop(0, orb.colors[0]);
            gradient.addColorStop(1, orb.colors[1]);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        });
    }
    
    drawHolographicBubble() {
        const t = this.time * 0.0003;
        
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
        
        // Main bubble with holographic gradient
        const bubbleGradient = this.ctx.createRadialGradient(
            bubbleX - bubbleSize * 0.2, 
            bubbleY - bubbleSize * 0.2, 
            0,
            bubbleX, 
            bubbleY, 
            bubbleSize
        );
        
        // Holographic colors with animation
        const hue1 = 300 + Math.sin(t * 2) * 30; // Pink-purple range
        const hue2 = 200 + Math.cos(t * 1.8) * 40; // Blue range
        const hue3 = 20 + Math.sin(t * 2.2) * 20; // Orange range
        
        bubbleGradient.addColorStop(0, `hsla(${hue1}, 70%, 85%, 0.4)`);
        bubbleGradient.addColorStop(0.3, `hsla(${hue2}, 60%, 80%, 0.35)`);
        bubbleGradient.addColorStop(0.6, `hsla(${hue3}, 80%, 75%, 0.3)`);
        bubbleGradient.addColorStop(0.85, `hsla(${hue1}, 65%, 80%, 0.2)`);
        bubbleGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        // Draw main bubble
        this.ctx.fillStyle = bubbleGradient;
        this.ctx.beginPath();
        this.ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Rim light effect (colored edge)
        const rimGradient = this.ctx.createRadialGradient(
            bubbleX, 
            bubbleY, 
            bubbleSize * 0.85,
            bubbleX, 
            bubbleY, 
            bubbleSize
        );
        
        rimGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
        rimGradient.addColorStop(0.7, `rgba(255, 143, 163, ${0.4 + Math.sin(t * 3) * 0.1})`); // Pink
        rimGradient.addColorStop(0.85, `rgba(255, 179, 128, ${0.5 + Math.cos(t * 2.5) * 0.15})`); // Orange
        rimGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = rimGradient;
        this.ctx.beginPath();
        this.ctx.arc(bubbleX, bubbleY, bubbleSize, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Inner highlight (soap bubble effect)
        const highlightGradient = this.ctx.createRadialGradient(
            bubbleX - bubbleSize * 0.3, 
            bubbleY - bubbleSize * 0.3, 
            0,
            bubbleX - bubbleSize * 0.3, 
            bubbleY - bubbleSize * 0.3, 
            bubbleSize * 0.4
        );
        
        highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
        highlightGradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
        highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        this.ctx.fillStyle = highlightGradient;
        this.ctx.beginPath();
        this.ctx.arc(
            bubbleX - bubbleSize * 0.3, 
            bubbleY - bubbleSize * 0.3, 
            bubbleSize * 0.4, 
            0, 
            Math.PI * 2
        );
        this.ctx.fill();
    }
    
    drawLightStreaks() {
        const t = this.time * 0.0004;
        
        // Multiple light streaks
        const streaks = [
            { x: 0.15, y: 0.6, angle: -25, width: 2, length: 300, offset: 0 },
            { x: 0.18, y: 0.55, angle: -25, width: 1.5, length: 250, offset: Math.PI * 0.3 },
            { x: 0.12, y: 0.65, angle: -25, width: 1, length: 200, offset: Math.PI * 0.6 },
        ];
        
        streaks.forEach((streak, index) => {
            const opacity = 0.15 + Math.sin(t * 2 + streak.offset) * 0.08;
            
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
            gradient.addColorStop(0.3, `rgba(255, 255, 255, ${opacity})`);
            gradient.addColorStop(0.7, `rgba(255, 255, 255, ${opacity * 0.6})`);
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
