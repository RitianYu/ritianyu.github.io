/**
 * InfiniDepth Interactive Magnifier Configuration - Debug Version
 * 
 * Simplified configuration for screen recording with single depth map display
 */

const InfiniDepthConfig = {
    // Multiple scenes configuration
    // Each scene now only has ONE depth image
    scenes: [
        {
            name: 'DSC_0250',
            rgbImage: 'images/pub/infinidepth/0000011.png',
            depthImage: 'images/pub/infinidepth/PromptNeuralDepth_000011_up_16_disparity.png', // Single depth image
            methodLabel: 'InfiniDepth (Ours)',
            // Predefined anchor points for auto recording (x, y in 0-1 range)
            anchors: [
                { x: 0.25, y: 0.35, name: 'Building Details' },
                { x: 0.65, y: 0.30, name: 'Tree Branches' },
                { x: 0.50, y: 0.55, name: 'Center Architecture' },
                { x: 0.30, y: 0.70, name: 'Ground Texture' },
                { x: 0.75, y: 0.65, name: 'Far Buildings' }
            ]
        },
        {
            name: 'Demo Scene 2',
            rgbImage: 'images/pub/infinidepth/interactitve_depth/rgb4.png',
            depthImage: 'images/pub/infinidepth/interactitve_depth/depth4.png', // Single depth image
            methodLabel: 'InfiniDepth (Ours)',
            anchors: [
                { x: 0.30, y: 0.40, name: 'Left Detail' },
                { x: 0.70, y: 0.40, name: 'Right Detail' },
                { x: 0.50, y: 0.60, name: 'Center' }
            ]
        }
        // ============================
        // Add more scenes here:
        // ============================
        // ,{
        //     name: 'Your Scene Name',
        //     rgbImage: 'images/pub/infinidepth/your_rgb_image.png',
        //     depthImage: 'images/pub/infinidepth/your_depth.png',
        //     methodLabel: 'InfiniDepth (Ours)',
        //     anchors: [
        //         { x: 0.3, y: 0.3, name: 'Region 1' },
        //         { x: 0.7, y: 0.7, name: 'Region 2' }
        //     ]
        // }
    ],
    
    // Patch size settings (in pixels)
    initialPatchSize: 512,  // Initial patch size when hovering starts
    minPatchSize: 12.5,     // Minimum patch size (max zoom in = 16x, since lens is 200px)
    maxPatchSize: 512,      // Maximum patch size (max zoom out)
    
    // Zoom behavior - keyboard controlled
    zoomStep: 0.04,          // Zoom step per keyboard press (0.05-0.2 recommended)
    
    // Mouse movement settings
    smoothMovement: true,    // Enable smooth mouse movement (reduces jitter for recording)
    smoothingFactor: 0.3,    // Smoothing factor (0.1-0.5): higher = more responsive, lower = smoother
    
    // Performance settings
    highQualityRendering: true,  // Use high-quality image smoothing (may impact performance)
    enableDebugLog: false,       // Enable console debug logs (disable for better performance)
    
    // Visual settings
    lensColor: '#6b9ac4',   // Magnifier lens border color
    lensOpacity: 0.15,      // Magnifier lens background opacity (0-1)
    
    // Scene transition settings
    transitionDuration: 500 // Transition animation duration in ms
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfiniDepthConfig;
}
