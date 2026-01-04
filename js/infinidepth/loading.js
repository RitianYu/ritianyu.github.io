/**
 * Loading Effects Manager
 * Handles page loading, image transitions, videos, and point clouds
 */

class LoadingManager {
    constructor() {
        this.init();
    }

    init() {
        // Create page loader
        this.createPageLoader();

        // Setup image loading transitions
        this.setupImageLoadingTransitions();

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
            </div>
        `;
        document.body.insertBefore(loader, document.body.firstChild);
    }

    startPageLoad() {
        // Wait for DOM content loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.onDOMReady());
        } else {
            this.onDOMReady();
        }
    }

    onDOMReady() {
        // Simple 1 second delay for initial load animation
        setTimeout(() => {
            this.hidePageLoader();
        }, 1000);
    }

    hidePageLoader() {
        const loader = document.getElementById('page-loader');

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
    }

    setupImageLoadingTransitions() {
        // Monitor all showcase galleries for image changes
        this.setupShowcaseImageTransitions();
    }

    setupShowcaseImageTransitions() {
        // Find all main images in comparison sections
        const mainImages = [
            { id: 'depth-main-img', type: 'image' },
            { id: 'pcd-main-img', type: 'image' },
            { id: 'nvs-main-img', type: 'image' }
        ];

        mainImages.forEach(({ id, type }) => {
            const img = document.getElementById(id);
            if (!img) return;

            // Create loading overlay for this image
            const container = img.parentElement;
            if (!container) return;

            // Ensure container has relative positioning
            container.style.position = 'relative';

            // Override image src setter to add loading effect
            const originalSrc = img.src;
            let currentOverlay = null;

            // Use MutationObserver to detect src changes
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'src') {
                        const newSrc = img.src;
                        if (newSrc && newSrc !== originalSrc && !newSrc.includes('blob:')) {
                            this.showImageLoadingOverlay(img, container);
                        }
                    }
                });
            });

            observer.observe(img, { attributes: true });
        });
    }

    showImageLoadingOverlay(img, container) {
        // Remove existing overlay if any
        const existingOverlay = container.querySelector('.image-loading-overlay');
        if (existingOverlay) {
            existingOverlay.remove();
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'image-loading-overlay';
        overlay.innerHTML = `
            <div class="image-spinner"></div>
        `;

        container.appendChild(overlay);

        // Wait for image to load
        const onLoad = () => {
            setTimeout(() => {
                overlay.classList.add('hidden');
                setTimeout(() => overlay.remove(), 300);
            }, 200);
        };

        if (img.complete) {
            onLoad();
        } else {
            img.addEventListener('load', onLoad, { once: true });
            img.addEventListener('error', () => {
                overlay.classList.add('hidden');
                setTimeout(() => overlay.remove(), 300);
            }, { once: true });
        }
    }

    enhancePointCloudLoading() {
        const loadingDiv = document.getElementById('pointcloud-loading');
        if (!loadingDiv) return;

        // Replace with enhanced loading effect
        loadingDiv.innerHTML = `
            <div class="pointcloud-loader">
                <div class="pointcloud-particles">
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                    <div class="particle"></div>
                </div>
                <div class="pointcloud-loading-text">Generating Point Cloud<span class="loading-dots"></span></div>
            </div>
        `;
    }

    // Public method to show loading for dynamic content
    static showLoading(element, message = 'Loading') {
        const overlay = document.createElement('div');
        overlay.className = 'image-loading-overlay';
        overlay.innerHTML = `
            <div class="image-spinner"></div>
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
