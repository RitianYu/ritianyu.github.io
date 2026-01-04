/**
 * Visualization Showcase Manager
 * Handles scene switching for depth, point cloud, and NVS visualizations
 */

// Scene configuration for visualization showcase
const VizShowcaseConfig = {
    // Depth visualization scenes
    depth: {
        scenes: [
            {
                name: 'Scene 1',
                rgb: 'images/pub/infinidepth/DSC_6487.png',
                depth: 'images/pub/infinidepth/MoGe-2_0250.png',
                thumbnail: 'images/pub/infinidepth/depth/rgb1.jpg'
            },
            {
                name: 'Scene 2',
                rgb: 'images/pub/infinidepth/DSC_0250.png',
                depth: 'images/pub/infinidepth/NeuralDepth_0250_up_4.png',
                thumbnail: 'images/pub/infinidepth/depth/rgb2.jpg'
            },
            {
                name: 'Scene 3',
                rgb: 'images/pub/infinidepth/DSC_6487.png',
                depth: 'images/pub/infinidepth/MoGe-2_0250.png',
                thumbnail: 'images/pub/infinidepth/depth/rgb3.jpg'
            },
            {
                name: 'Scene 4',
                rgb: 'images/pub/infinidepth/DSC_0250.png',
                depth: 'images/pub/infinidepth/NeuralDepth_0250_up_4.png',
                thumbnail: 'images/pub/infinidepth/depth/rgb4.jpg'
            }
        ]
    },

    // Point cloud visualization scenes
    pointcloud: {
        scenes: [
            {
                name: 'ETH Scene',
                plyFile: 'eth_1.ply',
                thumbnail: 'images/pub/infinidepth/vis_pcd/rgb1.jpg'
            },
            {
                name: 'Waymo Scene',
                plyFile: 'waymo_1.ply',
                thumbnail: 'images/pub/infinidepth/vis_pcd/rgb2.jpg'
            },
            {
                name: 'ETH Scene',
                plyFile: 'eth_1.ply',
                thumbnail: 'images/pub/infinidepth/vis_pcd/rgb1.jpg'
            },
            {
                name: 'Waymo Scene',
                plyFile: 'waymo_1.ply',
                thumbnail: 'images/pub/infinidepth/vis_pcd/rgb2.jpg'
            }
        ]
    },

    // NVS visualization scenes
    nvs: {
        scenes: [
            {
                name: 'NVS Scene 2',
                video: 'images/pub/infinidepth/vis_nvs/12_88_orig_to_bev_transition.mp4',
                thumbnail:'images/pub/infinidepth/nvs_compare/rgb3.jpg',
            },
            {
                name: 'NVS Scene 3',
                video: 'images/pub/infinidepth/vis_nvs/147_30_orig_to_bev_transition.mp4',
                thumbnail: 'images/pub/infinidepth/nvs_compare/rgb4.jpg',
            },
             {
                name: 'NVS Scene 4',
                video: 'images/pub/infinidepth/vis_nvs/1_190_orig_to_bev_transition.mp4',
                thumbnail: 'images/pub/infinidepth/nvs_compare/rgb1.jpg',
            },
            {
                name: 'NVS Scene 5',
                video: 'images/pub/infinidepth/vis_nvs/50_69_orig_to_bev_transition.mp4',
                thumbnail: 'images/pub/infinidepth/nvs_compare/rgb2.jpg',
            },
            {
                name: 'NVS Scene 1',
                video: 'images/pub/infinidepth/vis_nvs/0_36_orig_to_bev_transition.mp4',
                thumbnail: 'images/pub/infinidepth/nvs_compare/rgb5.jpg',
            },            
            {
                name: 'NVS Scene 6',
                video: 'images/pub/infinidepth/vis_nvs/15_54_orig_to_bev_transition.mp4',
                thumbnail: 'images/pub/infinidepth/nvs_compare/rgb8.jpg',
            },
        ]
    }
};

class VizShowcaseManager {
    constructor() {
        this.currentScenes = {
            depth: 0,
            pointcloud: 0,
            nvs: 0
        };

        this.maxVisible = 4; // 固定显示4张图
        this.startIndex = {
            depth: 0,
            pointcloud: 0,
            nvs: 0
        };

        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.setupDepthShowcase();
        this.setupPointCloudShowcase();
        this.setupNVSShowcase();
    }

    /**
     * Create showcase with navigation arrows
     */
    createShowcaseWithArrows(showcaseId, scenes, onClickCallback) {
        const showcase = document.getElementById(showcaseId);
        if (!showcase) return null;

        const type = showcaseId.replace('-viz-showcase', '');

        // Create container and arrows
        const container = document.createElement('div');
        container.className = 'showcase-container';

        const leftArrow = document.createElement('div');
        leftArrow.className = 'showcase-arrow showcase-arrow-left';
        leftArrow.innerHTML = '&#9664;'; // ◀

        const rightArrow = document.createElement('div');
        rightArrow.className = 'showcase-arrow showcase-arrow-right';
        rightArrow.innerHTML = '&#9654;'; // ▶

        // Replace showcase with container
        const parent = showcase.parentNode;
        parent.replaceChild(container, showcase);
        container.appendChild(leftArrow);
        container.appendChild(showcase);
        container.appendChild(rightArrow);

        const renderThumbs = () => {
            showcase.innerHTML = '';
            const startIdx = this.startIndex[type];
            const endIdx = Math.min(startIdx + this.maxVisible, scenes.length);
            const visibleScenes = scenes.slice(startIdx, endIdx);

            visibleScenes.forEach((scene, idx) => {
                const actualIdx = startIdx + idx;
                const thumb = document.createElement('img');
                thumb.src = scene.thumbnail;
                thumb.className = 'showcase-thumb' + (actualIdx === 0 && startIdx === 0 ? ' active' : '');
                thumb.alt = scene.name;
                thumb.dataset.index = actualIdx;

                thumb.addEventListener('click', () => {
                    showcase.querySelectorAll('.showcase-thumb').forEach(t => t.classList.remove('active'));
                    thumb.classList.add('active');
                    onClickCallback(actualIdx);
                });

                showcase.appendChild(thumb);
            });

            updateArrows();
        };

        const updateArrows = () => {
            leftArrow.style.display = 'flex';
            rightArrow.style.display = 'flex';

            if (this.startIndex[type] === 0) {
                leftArrow.classList.add('disabled');
            } else {
                leftArrow.classList.remove('disabled');
            }

            if (this.startIndex[type] + this.maxVisible >= scenes.length) {
                rightArrow.classList.add('disabled');
            } else {
                rightArrow.classList.remove('disabled');
            }
        };

        leftArrow.addEventListener('click', () => {
            if (this.startIndex[type] > 0) {
                this.startIndex[type]--;
                renderThumbs();
            }
        });

        rightArrow.addEventListener('click', () => {
            if (this.startIndex[type] + this.maxVisible < scenes.length) {
                this.startIndex[type]++;
                renderThumbs();
            }
        });

        renderThumbs();
        return { showcase, renderThumbs };
    }

    /**
     * Setup depth visualization showcase
     */
    setupDepthShowcase() {
        const scenes = VizShowcaseConfig.depth.scenes;
        this.createShowcaseWithArrows('depth-viz-showcase', scenes, (idx) => {
            this.switchDepthScene(idx);
        });
    }

    /**
     * Switch depth visualization scene
     */
    switchDepthScene(sceneIndex) {
        const scene = VizShowcaseConfig.depth.scenes[sceneIndex];
        if (!scene) return;

        this.currentScenes.depth = sceneIndex;

        // Update RGB image
        const rgbImage = document.getElementById('rgbImage');
        if (rgbImage) {
            rgbImage.src = scene.rgb;
        }

        // Update InfiniDepthConfig to match the new scene
        if (window.InfiniDepthConfig && window.InfiniDepthConfig.scenes) {
            // Find matching scene in InfiniDepthConfig by RGB image path
            let configIndex = window.InfiniDepthConfig.scenes.findIndex(
                s => s.rgbImage === scene.rgb
            );

            // If no matching scene found, use scene 0 or add a temporary one
            if (configIndex < 0) {
                configIndex = 0;
            }

            // Update depth image for the matching scene
            window.InfiniDepthConfig.scenes[configIndex].depthImages = [scene.depth];

            // Trigger depth magnifier to reload
            if (window.depthMagnifier) {
                if (typeof window.depthMagnifier.loadScene === 'function') {
                    window.depthMagnifier.loadScene(configIndex);
                } else if (typeof window.depthMagnifier.loadDepthImages === 'function') {
                    // Fallback: directly load the depth image
                    window.depthMagnifier.loadDepthImages([scene.depth]);
                }
            }
        }
    }

    /**
     * Setup point cloud visualization showcase
     */
    setupPointCloudShowcase() {
        const scenes = VizShowcaseConfig.pointcloud.scenes;
        this.createShowcaseWithArrows('pointcloud-viz-showcase', scenes, (idx) => {
            this.switchPointCloudScene(idx);
        });
    }

    /**
     * Switch point cloud scene
     */
    switchPointCloudScene(sceneIndex) {
        const scene = VizShowcaseConfig.pointcloud.scenes[sceneIndex];
        if (!scene) return;

        this.currentScenes.pointcloud = sceneIndex;

        // Trigger point cloud viewer to load new PLY file
        // This will be handled by pointcloud-viewer.js
        const event = new CustomEvent('loadPointCloud', {
            detail: { plyFile: scene.plyFile }
        });
        window.dispatchEvent(event);
    }

    /**
     * Setup NVS visualization showcase
     */
    setupNVSShowcase() {
        const scenes = VizShowcaseConfig.nvs.scenes;
        this.createShowcaseWithArrows('nvs-viz-showcase', scenes, (idx) => {
            this.switchNVSScene(idx);
        });

        // Load first scene automatically
        this.switchNVSScene(0);
    }

    /**
     * Switch NVS scene
     */
    switchNVSScene(sceneIndex) {
        const scene = VizShowcaseConfig.nvs.scenes[sceneIndex];
        if (!scene) return;

        this.currentScenes.nvs = sceneIndex;

        // Update video source
        const video = document.getElementById('nvs-video');
        if (video) {
            const container = video.parentElement;

            // Show loading overlay
            let overlay = container.querySelector('.video-loading-overlay');
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'video-loading-overlay';
                overlay.innerHTML = `
                    <div class="image-spinner"></div>
                `;
                container.style.position = 'relative';
                container.appendChild(overlay);
            } else {
                // Make sure overlay is visible
                overlay.classList.remove('hidden');
            }

            const source = video.querySelector('source');
            if (source) {
                source.src = scene.video;

                // Ensure video has autoplay, loop, and muted attributes
                video.loop = true;
                video.muted = true;

                video.load(); // Reload video with new source

                // Hide loading overlay when video is ready
                const hideLoading = () => {
                    setTimeout(() => {
                        if (overlay) {
                            overlay.classList.add('hidden');
                        }
                    }, 200);
                };

                // Auto-play video after it's loaded
                video.addEventListener('loadeddata', function autoPlay() {
                    hideLoading();
                    video.play().catch(err => {
                        console.log('Auto-play prevented:', err);
                    });
                    // Remove the event listener after first play
                    video.removeEventListener('loadeddata', autoPlay);
                }, { once: true });

                // Also handle error case
                video.addEventListener('error', () => {
                    hideLoading();
                }, { once: true });
            }
        }
    }
}

// Initialize the showcase manager
const vizShowcaseManager = new VizShowcaseManager();

// Export for global access
if (typeof window !== 'undefined') {
    window.vizShowcaseManager = vizShowcaseManager;
    window.VizShowcaseConfig = VizShowcaseConfig;
}
