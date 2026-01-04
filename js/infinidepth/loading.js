/**
 * Loading Effects Manager
 * Handles page loading, lazy loading for images, videos, and point clouds
 */

class LoadingManager {
    constructor() {
        this.totalAssets = 0;
        this.loadedAssets = 0;
        this.init();
    }

    init() {
        // Create page loader
        this.createPageLoader();

        // Setup lazy loading
        this.setupLazyLoading();

        // Setup video loading
        this.setupVideoLoading();

        // Enhance point cloud loading
        this.enhancePointCloudLoading();

        // Start page load
        this.startPageLoad();
    }

    createPageLoader() {
        const loader = document.createElement('div');
        loader.className = 'page-loader';
        loader.id = 'page-loader';
        loader.innerHTML = `
            <div class="loader-content">
                <div class="loader-spinner"></div>
                <div class="loader-text">Loading InfiniDepth</div>
                <div class="loader-progress">
                    <div class="loading-progress-bar">
                        <div class="loading-progress-fill" id="loading-progress-fill" style="width: 0%"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertBefore(loader, document.body.firstChild);
    }

    startPageLoad() {
        // Count total assets to load
        const images = document.querySelectorAll('img');
        const videos = document.querySelectorAll('video');
        this.totalAssets = images.length + videos.length;

        // Wait for DOM content loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    onDOMReady() {
        // Simulate minimum loading time for better UX
        const minLoadTime = 800;
        const startTime = Date.now();

        const checkComplete = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= minLoadTime && document.readyState === 'complete') {
                this.hidePageLoader();
            } else {
                requestAnimationFrame(checkComplete);
            }
        };

        if (document.readyState === 'complete') {
            setTimeout(() => this.hidePageLoader(), minLoadTime);
        } else {
            window.addEventListener('load', () => {
                requestAnimationFrame(checkComplete);
            });
        }

        // Update progress
        this.updateProgress();
    }

    updateProgress() {
        const progress = this.totalAssets > 0
            ? (this.loadedAssets / this.totalAssets) * 100
            : 0;

        const progressFill = document.getElementById('loading-progress-fill');
        if (progressFill) {
            progressFill.style.width = Math.min(progress, 95) + '%';
        }
    }

    hidePageLoader() {
        const loader = document.getElementById('page-loader');
        const progressFill = document.getElementById('loading-progress-fill');

        if (progressFill) {
            progressFill.style.width = '100%';
        }

        setTimeout(() => {
            if (loader) {
                loader.classList.add('hidden');
                setTimeout(() => loader.remove(), 500);
            }

            // Add fade-in animation to sections
            document.querySelectorAll('section').forEach((section, idx) => {
                setTimeout(() => {
                    section.classList.add('fade-in');
                }, idx * 100);
            });
        }, 300);
    }

    setupLazyLoading() {
        // Setup Intersection Observer for images
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    this.loadImage(img);
                    imageObserver.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px'
        });

        // Observe all images with data-src
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    loadImage(img) {
        const wrapper = img.closest('.lazy-image-wrapper');
        if (wrapper) {
            wrapper.setAttribute('data-loading', 'true');
        }

        const src = img.getAttribute('data-src');
        if (!src) return;

        const tempImg = new Image();
        tempImg.onload = () => {
            img.src = src;
            img.removeAttribute('data-src');
            if (wrapper) {
                wrapper.classList.add('loaded');
                wrapper.removeAttribute('data-loading');
            }
            this.loadedAssets++;
            this.updateProgress();
        };
        tempImg.onerror = () => {
            if (wrapper) {
                wrapper.removeAttribute('data-loading');
            }
        };
        tempImg.src = src;
    }

    setupVideoLoading() {
        const videos = document.querySelectorAll('video');

        videos.forEach(video => {
            const container = video.parentElement;
            if (!container) return;

            // Create loading overlay
            const overlay = document.createElement('div');
            overlay.className = 'video-loading-overlay';
            overlay.innerHTML = `
                <div class="video-spinner"></div>
                <div class="video-loading-text">Loading video<span class="loading-dots"></span></div>
            `;

            container.style.position = 'relative';
            container.appendChild(overlay);

            // Hide overlay when video is ready
            const hideOverlay = () => {
                overlay.classList.add('hidden');
                setTimeout(() => overlay.remove(), 300);
                this.loadedAssets++;
                this.updateProgress();
            };

            video.addEventListener('loadeddata', hideOverlay);
            video.addEventListener('canplaythrough', hideOverlay);

            // Remove overlay if video fails to load
            video.addEventListener('error', () => {
                overlay.classList.add('hidden');
                setTimeout(() => overlay.remove(), 300);
            });
        });
    }

    enhancePointCloudLoading() {
        const loadingDiv = document.getElementById('pointcloud-loading');
        if (!loadingDiv) return;

        // Enhance with spinner
        const spinner = document.createElement('div');
        spinner.className = 'pointcloud-spinner';

        // Insert spinner before text
        loadingDiv.insertBefore(spinner, loadingDiv.firstChild);

        // Add loading dots animation to text
        const text = loadingDiv.lastChild;
        if (text && text.nodeType === Node.TEXT_NODE) {
            const span = document.createElement('span');
            span.innerHTML = 'Loading point cloud<span class="loading-dots"></span>';
            loadingDiv.replaceChild(span, text);
        }
    }

    // Public method to show loading for dynamic content
    static showLoading(element, message = 'Loading') {
        const overlay = document.createElement('div');
        overlay.className = 'video-loading-overlay';
        overlay.innerHTML = `
            <div class="video-spinner"></div>
            <div class="video-loading-text">${message}<span class="loading-dots"></span></div>
        `;
        element.style.position = 'relative';
        element.appendChild(overlay);
        return overlay;
    }

    static hideLoading(overlay) {
        if (overlay) {
            overlay.classList.add('hidden');
            setTimeout(() => overlay.remove(), 300);
        }
    }
}

// Initialize loading manager when script loads
const loadingManager = new LoadingManager();

// Export for global access
if (typeof window !== 'undefined') {
    window.LoadingManager = LoadingManager;
    window.loadingManager = loadingManager;
}
