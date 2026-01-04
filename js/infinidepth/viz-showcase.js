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
     * Setup depth visualization showcase
     */
    setupDepthShowcase() {
        const showcase = document.getElementById('depth-viz-showcase');
        if (!showcase) return;

        const scenes = VizShowcaseConfig.depth.scenes;
        showcase.innerHTML = '';

        scenes.forEach((scene, idx) => {
            const thumb = document.createElement('img');
            thumb.src = scene.thumbnail;
            thumb.className = 'showcase-thumb' + (idx === 0 ? ' active' : '');
            thumb.alt = scene.name;

            thumb.addEventListener('click', () => {
                // Update active thumbnail
                showcase.querySelectorAll('.showcase-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');

                // Switch depth scene
                this.switchDepthScene(idx);
            });

            showcase.appendChild(thumb);
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
        const showcase = document.getElementById('pointcloud-viz-showcase');
        if (!showcase) return;

        const scenes = VizShowcaseConfig.pointcloud.scenes;
        showcase.innerHTML = '';

        scenes.forEach((scene, idx) => {
            const thumb = document.createElement('img');
            thumb.src = scene.thumbnail;
            thumb.className = 'showcase-thumb' + (idx === 0 ? ' active' : '');
            thumb.alt = scene.name;

            thumb.addEventListener('click', () => {
                // Update active thumbnail
                showcase.querySelectorAll('.showcase-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');

                // Switch point cloud scene
                this.switchPointCloudScene(idx);
            });

            showcase.appendChild(thumb);
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
        const showcase = document.getElementById('nvs-viz-showcase');
        if (!showcase) return;

        const scenes = VizShowcaseConfig.nvs.scenes;
        showcase.innerHTML = '';

        scenes.forEach((scene, idx) => {
            const thumb = document.createElement('img');
            thumb.src = scene.thumbnail;
            thumb.className = 'showcase-thumb' + (idx === 0 ? ' active' : '');
            thumb.alt = scene.name;

            thumb.addEventListener('click', () => {
                // Update active thumbnail
                showcase.querySelectorAll('.showcase-thumb').forEach(t => t.classList.remove('active'));
                thumb.classList.add('active');

                // Switch NVS scene
                this.switchNVSScene(idx);
            });

            showcase.appendChild(thumb);
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
            const source = video.querySelector('source');
            if (source) {
                source.src = scene.video;

                // Ensure video has autoplay, loop, and muted attributes
                video.loop = true;
                video.muted = true;

                video.load(); // Reload video with new source

                // Auto-play video after it's loaded
                video.addEventListener('loadeddata', function autoPlay() {
                    video.play().catch(err => {
                        console.log('Auto-play prevented:', err);
                    });
                    // Remove the event listener after first play
                    video.removeEventListener('loadeddata', autoPlay);
                });
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
