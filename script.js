// Animated Gradient Background
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
    
    createGradient() {
        const gradient = this.ctx.createLinearGradient(
            0, 
            0, 
            this.canvas.width, 
            this.canvas.height
        );
        
        // Time-based color shifts
        const t = this.time * 0.0002;
        const mouseInfluence = 0.1;
        
        // Color stops with animation
        const color1 = {
            r: 240 + Math.sin(t) * 10,
            g: 220 + Math.sin(t + 1) * 15,
            b: 235 + Math.sin(t + 2) * 10
        };
        
        const color2 = {
            r: 220 + Math.cos(t * 1.2) * 15 + this.mouseX * mouseInfluence * 255,
            g: 200 + Math.cos(t * 1.5) * 20 + this.mouseY * mouseInfluence * 255,
            b: 230 + Math.cos(t * 1.8) * 15
        };
        
        const color3 = {
            r: 210 + Math.sin(t * 0.8) * 20,
            g: 190 + Math.sin(t * 1.1) * 15,
            b: 225 + Math.sin(t * 1.3) * 20
        };
        
        gradient.addColorStop(0, `rgb(${color1.r}, ${color1.g}, ${color1.b})`);
        gradient.addColorStop(0.5, `rgb(${color2.r}, ${color2.g}, ${color2.b})`);
        gradient.addColorStop(1, `rgb(${color3.r}, ${color3.g}, ${color3.b})`);
        
        return gradient;
    }
    
    drawOrbs() {
        // Floating orb effects
        const orbs = [
            { x: 0.2, y: 0.3, size: 300, speed: 0.0003 },
            { x: 0.7, y: 0.6, size: 250, speed: 0.0004 },
            { x: 0.5, y: 0.8, size: 200, speed: 0.0002 },
        ];
        
        orbs.forEach((orb, index) => {
            const t = this.time * orb.speed + index * 2;
            const x = this.canvas.width * (orb.x + Math.sin(t) * 0.1);
            const y = this.canvas.height * (orb.y + Math.cos(t) * 0.1);
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, orb.size);
            gradient.addColorStop(0, `rgba(255, 200, 220, ${0.15 + Math.sin(t) * 0.05})`);
            gradient.addColorStop(0.5, `rgba(200, 180, 230, ${0.1 + Math.cos(t) * 0.03})`);
            gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        });
    }
    
    animate() {
        // Draw base gradient
        this.ctx.fillStyle = this.createGradient();
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw floating orbs
        this.drawOrbs();
        
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
