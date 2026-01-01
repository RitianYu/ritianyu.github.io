/**
 * Showcase Image Gallery
 * Handles thumbnail selection and main image display
 */

// Image data configuration
const depthMainImgs = [
    'images/pub/infinidepth/depth/depth1.jpg',
    'images/pub/infinidepth/depth/depth2.jpg',
    'images/pub/infinidepth/depth/depth3.jpg',
    'images/pub/infinidepth/depth/depth4.jpg',
];

const depthThumbs = [
    'images/pub/infinidepth/depth/rgb1.jpg',
    'images/pub/infinidepth/depth/rgb2.jpg',
    'images/pub/infinidepth/depth/rgb3.jpg',
    'images/pub/infinidepth/depth/rgb4.jpg',
];

const pcdMainImgs = [
    'images/pub/infinidepth/vis_pcd/pcd1.jpg',
    'images/pub/infinidepth/vis_pcd/pcd2.jpg',
    'images/pub/infinidepth/vis_pcd/pcd3.jpg',
    'images/pub/infinidepth/vis_pcd/pcd4.jpg',
];

const pcdThumbs = [
    'images/pub/infinidepth/vis_pcd/rgb1.jpg',
    'images/pub/infinidepth/vis_pcd/rgb2.jpg',
    'images/pub/infinidepth/vis_pcd/rgb3.jpg',
    'images/pub/infinidepth/vis_pcd/rgb4.jpg',
];

const nvsMainImgs = [
    'images/pub/infinidepth/nvs.jpg',
    'images/pub/infinidepth/nvs.jpg',
    'images/pub/infinidepth/nvs.jpg',
    'images/pub/infinidepth/nvs.jpg',
];

const nvsThumbs = [
    'images/pub/infinidepth/vis_pcd/rgb1.jpg',
    'images/pub/infinidepth/vis_pcd/rgb2.jpg',
    'images/pub/infinidepth/vis_pcd/rgb3.jpg',
    'images/pub/infinidepth/vis_pcd/rgb4.jpg',
];

/**
 * Setup showcase gallery
 * @param {string} mainImgId - ID of the main image element
 * @param {string} showcaseId - ID of the showcase container
 * @param {Array} mainList - Array of main image URLs
 * @param {Array} thumbList - Array of thumbnail URLs
 */
function setupShowcase(mainImgId, showcaseId, mainList, thumbList) {
    const mainImg = document.getElementById(mainImgId);
    const showcase = document.getElementById(showcaseId);

    if (!mainImg || !showcase) return;

    showcase.innerHTML = '';

    thumbList.forEach((src, idx) => {
        const thumb = document.createElement('img');
        thumb.src = src;
        thumb.className = 'showcase-thumb' + (idx === 0 ? ' active' : '');
        thumb.alt = 'Showcase Thumb ' + (idx + 1);

        thumb.addEventListener('click', function() {
            // Update main image
            if (mainList[idx]) mainImg.src = mainList[idx];

            // Update active thumbnail
            showcase.querySelectorAll('.showcase-thumb').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });

        showcase.appendChild(thumb);
    });

    // Initialize main image
    if (mainList[0]) mainImg.src = mainList[0];
}

// Initialize showcases when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    setupShowcase('depth-main-img', 'depth-showcase', depthMainImgs, depthThumbs);
    setupShowcase('pcd-main-img', 'pcd-showcase', pcdMainImgs, pcdThumbs);
    setupShowcase('nvs-main-img', 'nvs-showcase', nvsMainImgs, nvsThumbs);
});
