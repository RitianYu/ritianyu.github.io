/**
 * InfiniDepth Interactive Magnifier Configuration
 * 
 * Customize these settings to adjust the interactive depth comparison behavior
 */

const InfiniDepthConfig = {
    // Depth image paths for 4 methods
    depthImages: [
        'images/pub/infinidepth/MoGe-2_0250.png',           // Method 1
        'images/pub/infinidepth/NeuralDepth_0250_up_4.png', // Method 2
        'images/pub/infinidepth/MoGe-2_0250.png',           // Method 3
        'images/pub/infinidepth/NeuralDepth_0250_up_4.png'  // Method 4
    ],
    
    // Method labels (corresponding to depthImages order)
    methodLabels: [
        'Method 1',
        'Method 2', 
        'Method 3 (Ours)',
        'Method 4'
    ],
    
    // Patch size settings (in pixels)
    initialPatchSize: 256,  // Initial patch size when hovering starts
    minPatchSize: 64,       // Minimum patch size (max zoom in)
    maxPatchSize: 512,      // Maximum patch size (max zoom out)
    
    // Zoom behavior
    zoomStep: 0.1,          // Zoom step per mouse wheel scroll (0.05-0.2 recommended)
    
    // Visual settings
    lensColor: '#6b9ac4',   // Magnifier lens border color
    lensOpacity: 0.15,      // Magnifier lens background opacity (0-1)
    
    // Canvas settings
    canvasWidth: 512,       // Canvas width for depth rendering
    canvasHeight: 512       // Canvas height for depth rendering
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfiniDepthConfig;
}
