// ハンバーガーメニューの開閉
(function initMobileMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const closeBtn = document.getElementById('close-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = document.querySelectorAll('.mobile-menu-link');

    // メニューを開く
    function openMenu() {
        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden'; // スクロール防止
    }

    // メニューを閉じる
    function closeMenu() {
        mobileMenu.classList.remove('active');
        document.body.style.overflow = ''; // スクロール復帰
    }

    // ハンバーガーボタンクリック
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', openMenu);
    }

    // 閉じるボタンクリック
    if (closeBtn) {
        closeBtn.addEventListener('click', closeMenu);
    }

    // メニューリンククリック時に閉じる
    mobileMenuLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMenu();
        });
    });

    // ESCキーでメニューを閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
})();

// スムーズスクロール
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

// ヘッダーのスクロール効果（Hidden on Scroll Navigation）
let lastScroll = 0;
const header = document.querySelector('.header');
const navPill = document.querySelector('.nav-pill');
const SCROLL_THRESHOLD = 100; // スクロール開始の閾値

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // トップ付近（50px未満）では常にヘッダーを表示
    if (currentScroll < 50) {
        header.classList.remove('hidden');

        // ピル型メニューを初期状態に戻す
        if (navPill) {
            navPill.style.background = 'rgba(244, 244, 244, 0.3)';
            navPill.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
        }
    } else {
        // 下スクロール：ヘッダーを隠す
        if (currentScroll > lastScroll && currentScroll > SCROLL_THRESHOLD) {
            header.classList.add('hidden');
        }
        // 上スクロール：ヘッダーを表示
        else if (currentScroll < lastScroll) {
            header.classList.remove('hidden');
        }

        // デスクトップのピル型メニューのスクロール効果
        if (navPill && currentScroll > 50) {
            navPill.style.background = 'rgba(244, 244, 244, 0.4)';
            navPill.style.boxShadow = '0 6px 30px rgba(0, 0, 0, 0.25)';
        }
    }

    lastScroll = currentScroll;
});

// カーソルエフェクト（高級感を追加）
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('mouseenter', function(e) {
        this.style.letterSpacing = '0.2em';
    });

    link.addEventListener('mouseleave', function(e) {
        this.style.letterSpacing = '0.15em';
    });
});

// ページロード時のアニメーション
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.6s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// Golden Lattice Matrix セクションのスクロールアニメーション
(function initGoldenLatticeAnimation() {
    const goldenLatticeSection = document.querySelector('.golden-lattice-section');

    if (!goldenLatticeSection) return;

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    observer.observe(goldenLatticeSection);
})();

// プレミアムグラデーションアニメーション
(function initGradientAnimation() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', {
        alpha: false,
        desynchronized: true,
        willReadFrequently: false
    });

    let baseWidth = 3840;
    let baseHeight = 2160;
    let scale = 1;

    function updateCanvasSize() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;

        scale = Math.min(canvas.width / baseWidth, canvas.height / baseHeight);
        ctx.scale(dpr, dpr);
    }

    updateCanvasSize();

    const GOLDEN_RATIO = 1.618033988749;
    const DURATION = 15;
    const FPS = 60;
    const TOTAL_FRAMES = DURATION * FPS;
    let currentFrame = 0;

    // Perlinノイズクラス
    class PerlinNoise {
        constructor() {
            this.gradients = {};
        }

        rand_vect() {
            let theta = Math.random() * 2 * Math.PI;
            return {x: Math.cos(theta), y: Math.sin(theta)};
        }

        dot_prod_grid(x, y, vx, vy) {
            let g_vect;
            let d_vect = {x: x - vx, y: y - vy};
            let grid_key = `${vx},${vy}`;

            if (this.gradients[grid_key]) {
                g_vect = this.gradients[grid_key];
            } else {
                g_vect = this.rand_vect();
                this.gradients[grid_key] = g_vect;
            }

            return d_vect.x * g_vect.x + d_vect.y * g_vect.y;
        }

        smootherstep(x) {
            return 6*x**5 - 15*x**4 + 10*x**3;
        }

        interp(x, a, b) {
            return a + this.smootherstep(x) * (b-a);
        }

        get(x, y) {
            let xf = Math.floor(x);
            let yf = Math.floor(y);

            let tl = this.dot_prod_grid(x, y, xf, yf);
            let tr = this.dot_prod_grid(x, y, xf+1, yf);
            let bl = this.dot_prod_grid(x, y, xf, yf+1);
            let br = this.dot_prod_grid(x, y, xf+1, yf+1);

            let xt = this.interp(x-xf, tl, tr);
            let xb = this.interp(x-xf, bl, br);
            let v = this.interp(y-yf, xt, xb);

            return v;
        }
    }

    const noise = new PerlinNoise();

    const easing = {
        easeInOutQuint: (t) => {
            return t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2;
        },
        smootherstep: (t) => {
            return t * t * t * (t * (t * 6 - 15) + 10);
        },
        easeInOutCubic: (t) => {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
    };

    class LuxuryGradientOrb {
        constructor(index, total, layer) {
            this.layer = layer;
            this.index = index;
            this.randomStartOffset = Math.random() * Math.PI * 2;

            const goldenAngle = Math.PI * 2 / (GOLDEN_RATIO * GOLDEN_RATIO);
            this.angleOffset = goldenAngle * index + this.randomStartOffset;

            const layerScale = layer === 'foreground' ? 0.25 : (layer === 'midground' ? 0.35 : 0.45);
            this.baseOrbitRadiusX = baseWidth * layerScale;
            this.baseOrbitRadiusY = baseHeight * layerScale;

            this.baseRadius = layer === 'foreground' ? 1000 : (layer === 'midground' ? 800 : 600);
            this.speed = (layer === 'foreground' ? 0.15 : (layer === 'midground' ? 0.25 : 0.35)) * 0.6;

            this.minBrightness = 0;
            this.maxBrightness = layer === 'foreground' ? 80 : (layer === 'midground' ? 60 : 40);

            this.colorTint = index % 3 === 0 ? 'blue' : (index % 3 === 1 ? 'purple' : 'neutral');

            this.noiseOffsetX = Math.random() * 1000;
            this.noiseOffsetY = Math.random() * 1000;
            this.frameOffset = Math.floor(Math.random() * TOTAL_FRAMES);
        }

        getScaledValue(baseValue) {
            return baseValue * scale;
        }

        getPosition(frame) {
            const adjustedFrame = (frame + this.frameOffset) % TOTAL_FRAMES;
            const progress = adjustedFrame / TOTAL_FRAMES;
            const easedProgress = easing.smootherstep(easing.easeInOutQuint(progress));
            const angle = this.angleOffset + easedProgress * Math.PI * 2 * this.speed;

            const orbitRadiusX = this.getScaledValue(this.baseOrbitRadiusX);
            const orbitRadiusY = this.getScaledValue(this.baseOrbitRadiusY);
            const dpr = window.devicePixelRatio || 1;
            const centerX = canvas.width / dpr / 2;
            const centerY = canvas.height / dpr / 2;

            let x = centerX + Math.cos(angle) * orbitRadiusX;
            let y = centerY + Math.sin(angle) * orbitRadiusY;

            const noiseScale = 0.002;
            const noiseX = noise.get((adjustedFrame + this.noiseOffsetX) * noiseScale, 0);
            const noiseY = noise.get((adjustedFrame + this.noiseOffsetY) * noiseScale, 1);

            x += noiseX * this.getScaledValue(150);
            y += noiseY * this.getScaledValue(150);

            return { x, y };
        }

        getBrightness(frame) {
            const adjustedFrame = (frame + this.frameOffset) % TOTAL_FRAMES;
            const progress = adjustedFrame / TOTAL_FRAMES;
            const easedProgress = easing.easeInOutCubic(progress);
            const cycle = Math.sin(easedProgress * Math.PI * 2 + this.angleOffset);
            const range = this.maxBrightness - this.minBrightness;
            return this.minBrightness + (cycle * 0.5 + 0.5) * range;
        }

        getColorWithTint(brightness) {
            let r = brightness, g = brightness, b = brightness;

            if (this.colorTint === 'blue') {
                r = Math.max(0, brightness - 5);
                g = Math.max(0, brightness - 3);
                b = Math.min(255, brightness + 8);
            } else if (this.colorTint === 'purple') {
                r = Math.min(255, brightness + 3);
                g = Math.max(0, brightness - 5);
                b = Math.min(255, brightness + 5);
            }

            return { r, g, b };
        }

        draw(frame) {
            const pos = this.getPosition(frame);
            const brightness = this.getBrightness(frame);
            const color = this.getColorWithTint(brightness);
            const radius = this.getScaledValue(this.baseRadius);
            const dpr = window.devicePixelRatio || 1;

            const gradient = ctx.createRadialGradient(
                pos.x, pos.y, 0,
                pos.x, pos.y, radius
            );

            gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.95)`);
            gradient.addColorStop(0.1, `rgba(${Math.floor(color.r * 0.9)}, ${Math.floor(color.g * 0.9)}, ${Math.floor(color.b * 0.9)}, 0.85)`);
            gradient.addColorStop(0.2, `rgba(${Math.floor(color.r * 0.8)}, ${Math.floor(color.g * 0.8)}, ${Math.floor(color.b * 0.8)}, 0.7)`);
            gradient.addColorStop(0.35, `rgba(${Math.floor(color.r * 0.65)}, ${Math.floor(color.g * 0.65)}, ${Math.floor(color.b * 0.65)}, 0.55)`);
            gradient.addColorStop(0.5, `rgba(${Math.floor(color.r * 0.5)}, ${Math.floor(color.g * 0.5)}, ${Math.floor(color.b * 0.5)}, 0.4)`);
            gradient.addColorStop(0.65, `rgba(${Math.floor(color.r * 0.35)}, ${Math.floor(color.g * 0.35)}, ${Math.floor(color.b * 0.35)}, 0.25)`);
            gradient.addColorStop(0.85, `rgba(${Math.floor(color.r * 0.15)}, ${Math.floor(color.g * 0.15)}, ${Math.floor(color.b * 0.15)}, 0.1)`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

            if (this.layer === 'foreground') {
                const edgeGradient = ctx.createRadialGradient(
                    pos.x, pos.y, radius * 0.85,
                    pos.x, pos.y, radius * 0.98
                );
                edgeGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
                edgeGradient.addColorStop(0.5, `rgba(${Math.min(255, color.r + 20)}, ${Math.min(255, color.g + 20)}, ${Math.min(255, color.b + 25)}, 0.2)`);
                edgeGradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

                ctx.fillStyle = edgeGradient;
                ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
            }
        }
    }

    let orbs = {
        background: [],
        midground: [],
        foreground: []
    };

    function initOrbs() {
        orbs = {
            background: [],
            midground: [],
            foreground: []
        };

        for (let i = 0; i < 3; i++) {
            orbs.background.push(new LuxuryGradientOrb(i, 3, 'background'));
        }
        for (let i = 0; i < 2; i++) {
            orbs.midground.push(new LuxuryGradientOrb(i, 2, 'midground'));
        }
        for (let i = 0; i < 2; i++) {
            orbs.foreground.push(new LuxuryGradientOrb(i, 2, 'foreground'));
        }
    }

    initOrbs();

    function applyFilmGrain() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const imageData = ctx.getImageData(0, 0, rect.width, rect.height);
        const data = imageData.data;
        const grainIntensity = 1.5;

        for (let i = 0; i < data.length; i += 4) {
            const grain = (Math.random() - 0.5) * grainIntensity;
            data[i] = Math.max(0, Math.min(255, data[i] + grain));
            data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + grain));
            data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + grain));
        }

        ctx.putImageData(imageData, 0, 0);
    }

    function applyBloom() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        ctx.globalCompositeOperation = 'screen';
        ctx.filter = 'blur(40px) brightness(1.15)';
        ctx.globalAlpha = 0.25;
        ctx.drawImage(canvas, 0, 0, rect.width, rect.height);
        ctx.filter = 'none';
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    }

    function applyAmbientOcclusion() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const maxDim = Math.max(rect.width, rect.height);

        const occlusionGradient = ctx.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, maxDim * 0.7
        );
        occlusionGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        occlusionGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.08)');
        occlusionGradient.addColorStop(1, 'rgba(0, 0, 0, 0.25)');

        ctx.fillStyle = occlusionGradient;
        ctx.fillRect(0, 0, rect.width, rect.height);
    }

    function animate() {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();

        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, rect.width, rect.height);

        ctx.globalCompositeOperation = 'lighter';

        orbs.background.forEach(orb => orb.draw(currentFrame));
        orbs.midground.forEach(orb => orb.draw(currentFrame));
        orbs.foreground.forEach(orb => orb.draw(currentFrame));

        ctx.globalCompositeOperation = 'source-over';

        applyAmbientOcclusion();
        applyBloom();

        if (currentFrame % 3 === 0) {
            applyFilmGrain();
        }

        currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
        requestAnimationFrame(animate);
    }

    animate();

    let resizeTimeout;
    const handleResize = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            updateCanvasSize();
            initOrbs();
        }, 250);
    };

    window.addEventListener('resize', handleResize);
})();


// ============================================
// FAQ Accordion Functionality - Smooth Animation
// ============================================
(function initFAQAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    if (!faqQuestions.length) {
        console.warn('FAQ questions not found');
        return;
    }

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            const answer = question.nextElementSibling;

            // Close all other FAQ items (single-open behavior)
            faqQuestions.forEach(otherQuestion => {
                if (otherQuestion !== question) {
                    otherQuestion.setAttribute('aria-expanded', 'false');
                    const otherAnswer = otherQuestion.nextElementSibling;
                    if (otherAnswer) {
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.classList.remove('active');
                    }
                }
            });

            // Toggle current FAQ item with smooth animation
            if (isExpanded) {
                question.setAttribute('aria-expanded', 'false');
                answer.style.maxHeight = '0';
                answer.classList.remove('active');
            } else {
                question.setAttribute('aria-expanded', 'true');
                answer.classList.add('active');

                // Calculate exact height for smooth animation
                const contentHeight = answer.scrollHeight;
                answer.style.maxHeight = contentHeight + 'px';
            }
        });

        // Keyboard accessibility (Enter and Space)
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });

    // Update heights on window resize
    window.addEventListener('resize', () => {
        faqQuestions.forEach(question => {
            const isExpanded = question.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                const answer = question.nextElementSibling;
                const contentHeight = answer.scrollHeight;
                answer.style.maxHeight = contentHeight + 'px';
            }
        });
    });

    console.log('✓ FAQ Accordion initialized');
    console.log(`  - ${faqQuestions.length} FAQ items loaded`);
})();


// ============================================
// FAQ Show More Button - Toggle Hidden FAQ Items
// ============================================
(function initFAQShowMore() {
    const showMoreBtn = document.getElementById('faq-show-more-btn');
    const hiddenFaqItems = document.querySelectorAll('.faq-item.hidden');

    if (!showMoreBtn || !hiddenFaqItems.length) {
        console.warn('FAQ show more button or hidden items not found');
        return;
    }

    let isExpanded = false;

    showMoreBtn.addEventListener('click', () => {
        if (isExpanded) {
            // 閉じる: Hide FAQ items 06-10
            hiddenFaqItems.forEach(item => {
                item.classList.add('hidden');
            });
            showMoreBtn.querySelector('.btn-text').textContent = 'もっと見る';
            showMoreBtn.classList.remove('expanded');
        } else {
            // もっと見る: Show FAQ items 06-10
            hiddenFaqItems.forEach(item => {
                item.classList.remove('hidden');
            });
            showMoreBtn.querySelector('.btn-text').textContent = '閉じる';
            showMoreBtn.classList.add('expanded');
        }

        isExpanded = !isExpanded;
    });

    console.log('✓ FAQ Show More Button initialized');
    console.log(`  - ${hiddenFaqItems.length} hidden FAQ items ready to toggle`);
})();


// ============================================
// Hero Sections - Intersection Observer Animation
// ============================================
(function initHeroAnimation() {
    // .hero-sectionセクション自体を取得
    const heroSections = document.querySelectorAll('.hero-section');

    if (!heroSections.length) {
        console.warn('Hero sections not found');
        return;
    }

    // Intersection Observer options
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px 0px -20% 0px', // Trigger when 20% from bottom of viewport
        threshold: 0.3 // Trigger when 30% of element is visible
    };

    // Callback function
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // セクション全体とその中のコンテンツグループにvisibleクラスを追加
                entry.target.classList.add('visible');

                // コンテンツグループにもvisibleクラスを追加（既存のCSSアニメーション用）
                const contentGroup = entry.target.querySelector('.hero-content-group');
                const textOverlay = entry.target.querySelector('.hero-text-overlay');

                if (contentGroup) {
                    contentGroup.classList.add('visible');
                }
                if (textOverlay) {
                    textOverlay.classList.add('visible');
                }

                // Optional: Stop observing after animation triggers (one-time animation)
                // observer.unobserve(entry.target);
            }
        });
    };

    // Create observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe all hero sections
    heroSections.forEach(section => {
        observer.observe(section);
    });

    console.log('✓ Hero Sections Intersection Observer initialized');
    console.log(`  - ${heroSections.length} hero sections being observed`);
})();

// Quality Section Intersection Observer
(function initQualitySection() {
    const qualitySection = document.querySelector('.quality-section');

    if (!qualitySection) {
        console.log('⚠ Quality section not found');
        return;
    }

    // Intersection Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -20% 0px',
        threshold: 0.3
    };

    // Callback function
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger animation
                entry.target.classList.add('visible');

                // Optional: Stop observing after animation triggers
                // observer.unobserve(entry.target);
            }
        });
    };

    // Create observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe quality section
    observer.observe(qualitySection);

    console.log('✓ Quality Section Intersection Observer initialized');
})();


// ============================================
// Golden Lattice Section - Intersection Observer Animation
// ============================================
(function initGoldenLatticeAnimation() {
    const goldenLatticeSection = document.querySelector('.golden-lattice-section');

    if (!goldenLatticeSection) {
        console.log('⚠ Golden Lattice section not found');
        return;
    }

    // Intersection Observer options
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.2
    };

    // Callback function
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add visible class to trigger animation
                entry.target.classList.add('visible');

                // Stop observing after animation triggers (once only)
                observer.unobserve(entry.target);
            }
        });
    };

    // Create observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);

    // Observe golden lattice section
    observer.observe(goldenLatticeSection);

    console.log('✓ Golden Lattice Section Intersection Observer initialized');
})();
