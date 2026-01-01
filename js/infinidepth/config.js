/**
 * InfiniDepth Interactive Magnifier Configuration
 * 
 * Customize these settings to adjust the interactive depth comparison behavior
 */

const InfiniDepthConfig = {
    // Multiple scenes configuration
    scenes: [
        {
            name: 'DSC_6487',
            rgbImage: 'images/pub/infinidepth/DSC_6487.png',
            depthImages: [
                'images/pub/infinidepth/MoGe-2_0250.png'
            ],
            methodLabels: [
                'InfiniDepth'
            ]
        },
        {
            name: 'DSC_0250',
            rgbImage: 'images/pub/infinidepth/DSC_0250.png',
            depthImages: [
                'images/pub/infinidepth/NeuralDepth_0250_up_4.png'
            ],
            methodLabels: [
                'InfiniDepth'
            ]
        }
        // ============================
        // Add more scenes here:
        // ============================
        // Uncomment and modify the following template to add a new scene
        // Make sure to add a comma after the previous scene object

        // ,{
        //     name: 'Your Scene Name',  // Will be displayed in the navigation bar
        //     rgbImage: 'images/pub/infinidepth/your_rgb_image.png',
        //     depthImages: [
        //         'images/pub/infinidepth/your_method_depth.png'
        //     ],
        //     methodLabels: [
        //         'Method Name'
        //     ]
        // }
    ],
    
    // Patch size settings (in pixels)
    initialPatchSize: 512,  // Initial patch size when hovering starts
    minPatchSize: 32,       // Minimum patch size (max zoom in)
    maxPatchSize: 512,      // Maximum patch size (max zoom out)
    
    // Zoom behavior
    zoomStep: 0.1,          // Zoom step per mouse wheel scroll (0.05-0.2 recommended)
    
    // Visual settings
    lensColor: '#6b9ac4',   // Magnifier lens border color
    lensOpacity: 0.15,      // Magnifier lens background opacity (0-1)
    
    // Canvas settings
    canvasWidth: 512,       // Canvas width for depth rendering
    canvasHeight: 512,      // Canvas height for depth rendering
    
    // Scene transition settings
    transitionDuration: 500 // Transition animation duration in ms
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InfiniDepthConfig;
}
