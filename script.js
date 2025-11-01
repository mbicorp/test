// TSUGIMI - Qurap Style Demo
// Loading & Video Control

class SiteController {
    constructor() {
        this.loading = document.getElementById('loading');
        this.videos = document.querySelectorAll('video');
        this.burger = document.getElementById('burger');
        
        this.init();
    }
    
    init() {
        // ページロード時の処理
        window.addEventListener('load', () => {
            this.hideLoading();
            this.initVideos();
            this.initAnimations();
        });
        
        // バーガーメニュー
        if (this.burger) {
            this.burger.addEventListener('click', () => {
                this.toggleMenu();
            });
        }
        
        // スムーススクロール
        this.initSmoothScroll();
    }
    
    // ローディング画面を非表示
    hideLoading() {
        setTimeout(() => {
            this.loading.classList.add('hidden');
            setTimeout(() => {
                this.loading.style.display = 'none';
            }, 500);
        }, 1500);
    }
    
    // 動画の初期化と自動再生
    initVideos() {
        this.videos.forEach(video => {
            // 動画を確実に再生
            const playPromise = video.play();
            
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        console.log('動画再生成功:', video.src);
                    })
                    .catch(error => {
                        console.log('動画再生エラー:', error);
                        // エラー時はポスター画像を表示
                        video.style.opacity = '0';
                    });
            }
            
            // 動画が読み込まれたら表示
            video.addEventListener('loadeddata', () => {
                video.style.opacity = '1';
                video.style.transition = 'opacity 0.5s';
            });
            
            // 動画読み込みエラー時の処理
            video.addEventListener('error', (e) => {
                console.error('動画読み込みエラー:', e);
                // ポスター画像を背景として表示
                const poster = video.getAttribute('poster');
                if (poster && video.parentElement) {
                    video.parentElement.style.backgroundImage = `url(${poster})`;
                    video.parentElement.style.backgroundSize = 'cover';
                    video.parentElement.style.backgroundPosition = 'center';
                    video.style.display = 'none';
                }
            });
        });
    }
    
    // スクロールアニメーション
    initAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        // アニメーション対象の要素
        const animateElements = document.querySelectorAll('.concept-content, .product-card');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            observer.observe(el);
        });
    }
    
    // バーガーメニューの切り替え
    toggleMenu() {
        alert('メニューの実装はデモでは省略されています');
    }
    
    // スムーススクロール
    initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// 動画フォールバック処理
class VideoFallback {
    constructor() {
        this.initFallback();
    }
    
    initFallback() {
        // Qurapの動画が読み込めない場合の代替処理
        const videos = document.querySelectorAll('video');
        
        videos.forEach((video, index) => {
            const sources = video.querySelectorAll('source');
            
            sources.forEach(source => {
                const originalSrc = source.src;
                
                // 動画読み込みテスト
                fetch(originalSrc, { method: 'HEAD' })
                    .then(response => {
                        if (!response.ok) {
                            console.warn(`動画が読み込めません: ${originalSrc}`);
                            this.createFallbackElement(video, index);
                        }
                    })
                    .catch(() => {
                        console.warn(`動画が読み込めません: ${originalSrc}`);
                        this.createFallbackElement(video, index);
                    });
            });
        });
    }
    
    createFallbackElement(video, index) {
        // 代替グラデーションアニメーションを作成
        const fallback = document.createElement('div');
        fallback.className = 'video-fallback';
        fallback.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                135deg,
                rgba(232, 216, 240, 0.8) 0%,
                rgba(216, 232, 248, 0.8) 25%,
                rgba(240, 216, 240, 0.8) 50%,
                rgba(216, 232, 248, 0.8) 75%,
                rgba(232, 216, 240, 0.8) 100%
            );
            background-size: 400% 400%;
            animation: gradientFlow ${10 + index * 2}s ease infinite;
        `;
        
        // アニメーション定義を追加
        if (!document.getElementById('fallback-styles')) {
            const style = document.createElement('style');
            style.id = 'fallback-styles';
            style.textContent = `
                @keyframes gradientFlow {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1); }
                    50% { transform: translateY(-20px) scale(1.05); }
                }
            `;
            document.head.appendChild(style);
        }
        
        // 浮遊する球体を追加
        const bubble = document.createElement('div');
        bubble.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: radial-gradient(
                circle at 30% 30%,
                rgba(255, 255, 255, 0.8) 0%,
                rgba(200, 180, 230, 0.4) 50%,
                rgba(255, 200, 220, 0.2) 100%
            );
            filter: blur(30px);
            animation: float 6s ease-in-out infinite;
        `;
        fallback.appendChild(bubble);
        
        // 動画の代わりに配置
        if (video.parentElement) {
            video.style.display = 'none';
            video.parentElement.appendChild(fallback);
        }
    }
}

// パフォーマンス最適化
class PerformanceOptimizer {
    constructor() {
        this.optimizeVideos();
        this.initLazyLoad();
    }
    
    optimizeVideos() {
        // モバイルデバイスでは動画の品質を下げる
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            document.querySelectorAll('video').forEach(video => {
                // プリロードを無効化してバンド幅を節約
                video.setAttribute('preload', 'metadata');
            });
        }
    }
    
    initLazyLoad() {
        // 画像の遅延読み込み
        const images = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// 初期化
document.addEventListener('DOMContentLoaded', () => {
    new SiteController();
    new VideoFallback();
    new PerformanceOptimizer();
    
    // デバッグ情報
    console.log(`
    🎨 TSUGIMI Demo Site
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━
    📹 動画構造：Qurap方式を再現
    🎭 レイヤー：複数の装飾動画を配置
    📱 レスポンシブ：完全対応
    ⚡ パフォーマンス：最適化済み
    
    ℹ️ 注意：
    Qurapの実際の動画ファイルは著作権で
    保護されているため、プレースホルダーを
    使用しています。
    
    実際の動画ファイルに置き換えるか、
    Three.jsバージョンをご利用ください。
    ━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);
});

// ウィンドウリサイズ時の処理
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        // リサイズ後の処理
        console.log('Window resized');
    }, 250);
});

// ページ離脱前の処理
window.addEventListener('beforeunload', () => {
    // 動画を停止してメモリを解放
    document.querySelectorAll('video').forEach(video => {
        video.pause();
        video.src = '';
        video.load();
    });
});
