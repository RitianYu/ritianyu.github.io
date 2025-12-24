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
            rgbImage: 'images/pub/infinidepth/DSC_6487.png',
            depthImage: 'images/pub/infinidepth/PromptNeuralDepth_DSC_6487_up_8_disparity.png', // Single depth image
            methodLabel: 'InfiniDepth (Ours)'
        },
        {
            name: 'Demo Scene 2',
            rgbImage: 'images/pub/infinidepth/DSC_6487.png',
            depthImage: 'images/pub/infinidepth/MoGe-2_0250.png',
            methodLabel: 'InfiniDepth (Ours)'
        }
        // ============================
        // Add more scenes here:
        // ============================
        // ,{
        //     name: 'Your Scene Name',
        //     rgbImage: 'images/pub/infinidepth/your_rgb_image.png',
        //     depthImage: 'images/pub/infinidepth/your_depth.png',
        //     methodLabel: 'InfiniDepth (Ours)'
        // }
    ],
    
    // Patch size settings (in pixels)
    initialPatchSize: 512,  // Initial patch size when hovering starts
    minPatchSize: 32,       // Minimum patch size (max zoom in)
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
