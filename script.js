// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // =========================
    // Loading Screen
    // =========================
    const loading = document.getElementById('loading');
    
    window.addEventListener('load', function() {
        setTimeout(function() {
            loading.classList.add('is-hidden');
            setTimeout(function() {
                loading.style.display = 'none';
            }, 500);
        }, 1000);
    });

    // =========================
    // Mobile Menu Toggle
    // =========================
    const burger = document.getElementById('burger');
    const menu = document.querySelector('.js-menu');
    const menuLinks = document.querySelectorAll('.menu__links a');
    
    if (burger && menu) {
        burger.addEventListener('click', function() {
            this.classList.toggle('is-active');
            menu.classList.toggle('is-open');
            document.body.style.overflow = menu.classList.contains('is-open') ? 'hidden' : '';
        });

        // Close menu when clicking on a link
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                burger.classList.remove('is-active');
                menu.classList.remove('is-open');
                document.body.style.overflow = '';
            });
        });
    }

    // =========================
    // Smooth Scrolling for Anchor Links
    // =========================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const headerHeight = 80;
                    const targetPosition = target.offsetTop - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // =========================
    // Swiper Initialization
    // =========================
    if (typeof Swiper !== 'undefined') {
        // Topics Swiper
        const topicsSwiper = new Swiper('.js-slider-topics', {
            slidesPerView: 'auto',
            spaceBetween: 16,
            freeMode: true,
            breakpoints: {
                1024: {
                    enabled: false,
                    slidesPerView: 3,
                    spaceBetween: 16
                }
            }
        });
    }

    // =========================
    // SNS Auto Scroll
    // =========================
    const snsAuto = document.querySelector('.js-sns-auto');
    if (snsAuto) {
        // Clone the first list for infinite scroll effect
        const firstList = snsAuto.querySelector('.sns-imgs-list');
        if (firstList) {
            const clone = firstList.cloneNode(true);
            snsAuto.appendChild(clone);
        }
    }

    // =========================
    // Intersection Observer for Animations
    // =========================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements with animation classes
    const animatedElements = document.querySelectorAll('.js-mns, .js-main-desc, .js-s-logo, .js-btn');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(el);
    });

    // =========================
    // Modal Functionality
    // =========================
    const modals = document.querySelectorAll('.js-modal');
    const modalTriggers = document.querySelectorAll('.js-trigger-modal');
    const modalCloses = document.querySelectorAll('.modal__close');
    const modalBgs = document.querySelectorAll('.modal__bg');

    // Open Modal
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalName = this.getAttribute('data-modal');
            const modal = document.querySelector(`.modal[data-name="${modalName}"]`);
            
            if (modal) {
                modal.classList.add('is-active');
                document.body.style.overflow = 'hidden';
                
                // Play video if it's a YouTube iframe
                const iframe = modal.querySelector('iframe');
                if (iframe && iframe.src.includes('youtube.com')) {
                    const src = iframe.src;
                    if (!src.includes('autoplay=1')) {
                        iframe.src = src + (src.includes('?') ? '&' : '?') + 'autoplay=1';
                    }
                }
            }
        });
    });

    // Close Modal
    const closeModal = function(modal) {
        modal.classList.remove('is-active');
        document.body.style.overflow = '';
        
        // Stop video if it's a YouTube iframe
        const iframe = modal.querySelector('iframe');
        if (iframe && iframe.src.includes('youtube.com')) {
            const src = iframe.src.replace('&autoplay=1', '').replace('?autoplay=1', '');
            iframe.src = src;
        }
    };

    modalCloses.forEach(close => {
        close.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    modalBgs.forEach(bg => {
        bg.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal);
            }
        });
    });

    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.is-active');
            if (activeModal) {
                closeModal(activeModal);
            }
        }
    });

    // =========================
    // Scroll Progress Bar
    // =========================
    const scrollBar = document.querySelector('.scroll-bar__line');
    if (scrollBar) {
        window.addEventListener('scroll', function() {
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight - windowHeight;
            const scrolled = window.scrollY;
            const progress = (scrolled / documentHeight) * 100;
            
            // Hide scroll bar when near bottom
            if (progress > 90) {
                scrollBar.style.opacity = '0';
            } else {
                scrollBar.style.opacity = '1';
            }
        });
    }

    // =========================
    // Header Background on Scroll
    // =========================
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 50) {
                header.style.backgroundColor = 'rgba(251, 250, 252, 0.95)';
                header.style.backdropFilter = 'blur(10px)';
            } else {
                header.style.backgroundColor = 'transparent';
                header.style.backdropFilter = 'none';
            }
        });
    }

    // =========================
    // Link Hover Effects
    // =========================
    const linkTextElements = document.querySelectorAll('.link-text-01');
    linkTextElements.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.color = 'var(--color-purple-01)';
        });
        
        link.addEventListener('mouseleave', function() {
            this.style.color = '';
        });
    });

    // =========================
    // Button Hover Effects
    // =========================
    const buttons = document.querySelectorAll('.js-btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });
        
        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // =========================
    // Product Entrance Animation
    // =========================
    const products = document.querySelectorAll('.js-prod-01, .js-prod-02, .js-prod-03, .js-prod-04');
    const productObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, { threshold: 0.2 });

    products.forEach(product => {
        product.style.animationPlayState = 'paused';
        productObserver.observe(product);
    });

    // =========================
    // Deco Movie Parallax Effect
    // =========================
    const decoMovies = document.querySelectorAll('.deco-movie');
    window.addEventListener('scroll', function() {
        const scrolled = window.scrollY;
        
        decoMovies.forEach((movie, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            movie.style.transform = `translateY(${yPos}px) rotate(${index % 2 === 0 ? '0deg' : '90deg'})`;
        });
    });

    // =========================
    // Lazy Loading for Images
    // =========================
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    // =========================
    // Console Welcome Message
    // =========================
    console.log('%c Welcome to Qurap! ', 'background: #654ea3; color: white; padding: 10px 20px; font-size: 16px; border-radius: 5px;');
    console.log('%c ツヤ膜ラッピングシャンプー ', 'color: #654ea3; font-size: 14px;');

    // =========================
    // Resize Handler
    // =========================
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function() {
            // Close mobile menu on resize to desktop
            if (window.innerWidth >= 1024) {
                if (burger) burger.classList.remove('is-active');
                if (menu) menu.classList.remove('is-open');
                document.body.style.overflow = '';
            }
        }, 250);
    });

    // =========================
    // Performance Optimization
    // =========================
    // Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle scroll events for better performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Apply throttle to scroll-heavy operations
    const throttledScroll = throttle(function() {
        // Heavy scroll operations here
    }, 100);

    window.addEventListener('scroll', throttledScroll);

    // =========================
    // Accessibility Enhancements
    // =========================
    // Add keyboard navigation support
    const focusableElements = document.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
    
    focusableElements.forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                if (this.tagName === 'A' || this.tagName === 'BUTTON') {
                    this.click();
                }
            }
        });
    });

    // =========================
    // Form Enhancement (if forms exist)
    // =========================
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            console.log('Form submitted');
        });
    });

    // =========================
    // Analytics Tracking (Placeholder)
    // =========================
    function trackEvent(category, action, label) {
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': category,
                'event_label': label
            });
        }
        console.log('Event tracked:', category, action, label);
    }

    // Track button clicks
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            const btnText = this.textContent.trim();
            trackEvent('Button', 'Click', btnText);
        });
    });

    // =========================
    // Easter Egg
    // =========================
    let konamiCode = [];
    const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    document.addEventListener('keydown', function(e) {
        konamiCode.push(e.key);
        konamiCode.splice(-konamiPattern.length - 1, konamiCode.length - konamiPattern.length);
        
        if (konamiCode.join('') === konamiPattern.join('')) {
            console.log('%c 🎉 Konami Code Activated! 🎉 ', 'background: #654ea3; color: white; padding: 20px; font-size: 20px;');
            document.body.style.animation = 'rainbow 2s linear infinite';
            
            setTimeout(() => {
                document.body.style.animation = '';
            }, 5000);
        }
    });

    // Rainbow animation for easter egg
    const style = document.createElement('style');
    style.textContent = `
        @keyframes rainbow {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    // =========================
    // Initialize Complete
    // =========================
    console.log('🎉 Qurap website initialized successfully!');
});

// =========================
// Service Worker Registration (Optional)
// =========================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Uncomment to enable service worker
        // navigator.serviceWorker.register('/sw.js')
        //     .then(registration => console.log('SW registered:', registration))
        //     .catch(err => console.log('SW registration failed:', err));
    });
}
