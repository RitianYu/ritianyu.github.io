/**
 * InfiniDepth Interactive Depth Magnifier
 * 
 * Main class for handling interactive depth comparison with zoom functionality and scene switching
 */

class DepthMagnifier {
    constructor(config) {
        this.config = config || InfiniDepthConfig;
        
        // Scene management
        this.currentSceneIndex = 0;
        this.isTransitioning = false;
        
        // DOM elements
        this.rgbSide = document.getElementById('rgbSide');
        this.rgbImage = document.getElementById('rgbImage');
        this.lens = document.getElementById('magnifierLens');
        this.zoomInfo = document.getElementById('zoomInfo');
        
        // Scene navigation elements
        this.prevBtn = document.getElementById('prevCase');
        this.nextBtn = document.getElementById('nextCase');
        
        // Create canvas inside magnifier lens for zoom effect
        this.lensCanvas = document.createElement('canvas');
        this.lensCanvas.width = 200;  // Fixed lens size
        this.lensCanvas.height = 200;
        this.lensCtx = this.lensCanvas.getContext('2d');
        
        this.canvases = [
            document.getElementById('depthCanvas1'),
            document.getElementById('depthCanvas2'),
            document.getElementById('depthCanvas3'),
            document.getElementById('depthCanvas4')
        ];
        
        this.contexts = this.canvases.map(c => c ? c.getContext('2d') : null);
        
        // State
        this.isHovering = false;
        this.depthImagesLoaded = [];
        this.patchSize = this.config.initialPatchSize;
        this.zoomLevel = 1.0;
        this.mousePos = { x: 0, y: 0 };
        this.lastMouseEvent = null;
        
        // Initialize scene navigation
        this.initSceneNavigation();
        
        // Load first scene
        this.loadScene(0);
    }
    
    /**
     * Initialize scene navigation
     */
    initSceneNavigation() {
        console.log('Initializing scene navigation...');
        console.log('prevBtn:', this.prevBtn);
        console.log('nextBtn:', this.nextBtn);
        console.log('Total scenes:', this.config.scenes.length);
        
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => {
                console.log('Previous button clicked');
                this.previousScene();
            });
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => {
                console.log('Next button clicked');
                this.nextScene();
            });
        }
        
        // Update navigation button states
        this.updateNavigationButtons();
    }
    
    /**
     * Update navigation button states
     */
    updateNavigationButtons() {
        if (!this.prevBtn || !this.nextBtn) return;
        
        const totalScenes = this.config.scenes.length;
        
        // Disable/enable buttons based on current position
        if (totalScenes <= 1) {
            this.prevBtn.disabled = true;
            this.nextBtn.disabled = true;
            this.prevBtn.style.opacity = '0.5';
            this.nextBtn.style.opacity = '0.5';
            this.prevBtn.style.cursor = 'not-allowed';
            this.nextBtn.style.cursor = 'not-allowed';
        } else {
            this.prevBtn.disabled = this.currentSceneIndex === 0;
            this.nextBtn.disabled = this.currentSceneIndex === totalScenes - 1;
            
            this.prevBtn.style.opacity = this.prevBtn.disabled ? '0.5' : '1';
            this.nextBtn.style.opacity = this.nextBtn.disabled ? '0.5' : '1';
            this.prevBtn.style.cursor = this.prevBtn.disabled ? 'not-allowed' : 'pointer';
            this.nextBtn.style.cursor = this.nextBtn.disabled ? 'not-allowed' : 'pointer';
        }
    }
    
    /**
     * Load a specific scene
     */
    loadScene(sceneIndex) {
        if (this.isTransitioning) return;
        if (sceneIndex < 0 || sceneIndex >= this.config.scenes.length) return;
        
        this.currentSceneIndex = sceneIndex;
        const scene = this.config.scenes[sceneIndex];
        
        console.log('Loading scene:', scene.name);
        
        // Update method labels
        this.updateMethodLabels(scene.methodLabels);
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Reset depth images
        this.depthImagesLoaded = [];
        
        // Update RGB image
        const oldSrc = this.rgbImage.src;
        const newSrc = scene.rgbImage;
        
        if (oldSrc !== newSrc) {
            // Set new image source
            this.rgbImage.src = newSrc;
            
            // Wait for RGB image to load
            if (this.rgbImage.complete) {
                this.onSceneLoaded(scene);
            } else {
                this.rgbImage.addEventListener('load', () => {
                    this.onSceneLoaded(scene);
                }, { once: true });
            }
        } else {
            this.onSceneLoaded(scene);
        }
    }
    
    /**
     * Called when scene is loaded
     */
    onSceneLoaded(scene) {
        this.initializeCanvasSizes();
        this.loadDepthImages(scene.depthImages);
        
        // Initialize events only once
        if (!this.eventsInitialized) {
            this.initEvents();
            this.setupMagnifierLens();
            this.eventsInitialized = true;
        }
        
        // Handle window resize
        if (!this.resizeHandlerAdded) {
            window.addEventListener('resize', () => this.initializeCanvasSizes());
            this.resizeHandlerAdded = true;
        }
    }
    
    /**
     * Update method labels
     */
    updateMethodLabels(labels) {
        const depthItems = document.querySelectorAll('.depth-item');
        
        depthItems.forEach((item, i) => {
            const labelEl = item.querySelector('.depth-label');
            if (labelEl && labels[i]) {
                labelEl.textContent = labels[i];
            }
        });
    }
    
    /**
     * Switch to previous scene
     */
    previousScene() {
        if (this.currentSceneIndex > 0 && !this.isTransitioning) {
            this.switchScene(this.currentSceneIndex - 1, 'left');
        }
    }
    
    /**
     * Switch to next scene
     */
    nextScene() {
        console.log('nextScene called, current:', this.currentSceneIndex, 'total:', this.config.scenes.length);
        if (this.currentSceneIndex < this.config.scenes.length - 1 && !this.isTransitioning) {
            console.log('Switching to next scene...');
            this.switchScene(this.currentSceneIndex + 1, 'right');
        } else {
            console.log('Cannot go to next scene');
        }
    }
    
    /**
     * Switch to a specific scene with animation
     */
    switchScene(newSceneIndex, direction) {
        console.log('switchScene called:', newSceneIndex, direction);
        if (this.isTransitioning) {
            console.log('Already transitioning, skipping...');
            return;
        }
        
        this.isTransitioning = true;
        const comparison = document.querySelector('.interactive-comparison');
        
        if (!comparison) {
            console.error('interactive-comparison element not found!');
            this.isTransitioning = false;
            return;
        }
        
        console.log('Starting transition...');
        
        // Add slide-out animation
        comparison.classList.add('transitioning');
        comparison.classList.add(direction === 'left' ? 'slide-out-right' : 'slide-out-left');
        
        // After slide-out animation completes
        setTimeout(() => {
            console.log('Slide-out complete, loading scene...');
            // Load new scene
            this.loadScene(newSceneIndex);
            
            // Remove slide-out class and add slide-in class
            comparison.classList.remove('slide-out-left', 'slide-out-right');
            comparison.classList.add(direction === 'left' ? 'slide-in-left' : 'slide-in-right');
            
            // Remove all animation classes after slide-in completes
            setTimeout(() => {
                console.log('Slide-in complete');
                comparison.classList.remove('transitioning', 'slide-in-left', 'slide-in-right');
                this.isTransitioning = false;
            }, this.config.transitionDuration);
            
        }, this.config.transitionDuration);
    }
    
    /**
     * Setup magnifier lens with canvas
     */
    setupMagnifierLens() {
        // Clear any existing content
        this.lens.innerHTML = '';
        // Add canvas to lens
        this.lens.appendChild(this.lensCanvas);
    }
    
    /**
     * Initialize canvas sizes to match RGB image dimensions
     */
    initializeCanvasSizes() {
        if (!this.rgbImage) return;
        
        const rgbHeight = this.rgbImage.offsetHeight;
        const rgbWidth = this.rgbImage.offsetWidth;
        
        // Calculate individual canvas dimensions (2x2 grid with gap)
        const gap = 10; // Must match CSS gap value
        const canvasHeight = (rgbHeight - gap) / 2;
        const canvasWidth = (rgbWidth - gap) / 2;
        
        this.canvases.forEach(canvas => {
            if (canvas) {
                // Set canvas dimensions
                canvas.width = Math.round(canvasWidth);
                canvas.height = Math.round(canvasHeight);
                
                // Redraw if depth image is loaded
                const index = this.canvases.indexOf(canvas);
                if (this.depthImagesLoaded[index]) {
                    this.drawFullDepth(index);
                }
            }
        });
        
        console.log(`Canvas sizes initialized: ${Math.round(canvasWidth)}x${Math.round(canvasHeight)}`);
    }
    
    /**
     * Load all depth images
     */
    loadDepthImages(depthImagePaths) {
        const imagePaths = depthImagePaths || this.config.scenes[this.currentSceneIndex].depthImages;
        
        this.depthImagesLoaded = [];
        
        imagePaths.forEach((src, index) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                this.depthImagesLoaded[index] = img;
                this.drawFullDepth(index);
                console.log(`Depth image ${index + 1} loaded:`, src);
            };
            img.onerror = () => {
                console.error(`Failed to load depth image ${index + 1}:`, src);
            };
            img.src = src;
        });
    }
    
    /**
     * Draw full depth image to canvas
     */
    drawFullDepth(index) {
        if (!this.depthImagesLoaded[index] || !this.contexts[index]) return;
        
        const canvas = this.canvases[index];
        const ctx = this.contexts[index];
        const img = this.depthImagesLoaded[index];
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    
    /**
     * Draw a patch of depth image centered at given coordinates
     * Key: maintain same relative patch size as RGB to ensure correspondence
     */
    drawPatchDepth(index, centerX, centerY) {
        if (!this.depthImagesLoaded[index] || !this.contexts[index]) return;
        
        const canvas = this.canvases[index];
        const ctx = this.contexts[index];
        const img = this.depthImagesLoaded[index];
        
        // Get RGB image dimensions
        const rgbDisplayWidth = this.rgbImage.offsetWidth;
        const rgbDisplayHeight = this.rgbImage.offsetHeight;
        const rgbNaturalWidth = this.rgbImage.naturalWidth;
        const rgbNaturalHeight = this.rgbImage.naturalHeight;
        
        // Calculate mouse position in RGB natural coordinates
        const rgbNaturalX = (centerX / rgbDisplayWidth) * rgbNaturalWidth;
        const rgbNaturalY = (centerY / rgbDisplayHeight) * rgbNaturalHeight;
        
        // Calculate patch size as a ratio of RGB natural dimensions
        const patchRatioX = this.patchSize / rgbNaturalWidth;
        const patchRatioY = this.patchSize / rgbNaturalHeight;
        
        // Apply same ratio to depth image to get corresponding patch
        const depthWidth = img.width;
        const depthHeight = img.height;
        const depthPatchWidth = patchRatioX * depthWidth;
        const depthPatchHeight = patchRatioY * depthHeight;
        
        // Map center position from RGB to depth coordinates
        const depthCenterX = (rgbNaturalX / rgbNaturalWidth) * depthWidth;
        const depthCenterY = (rgbNaturalY / rgbNaturalHeight) * depthHeight;
        
        // Calculate source rectangle in depth image
        let sx = depthCenterX - depthPatchWidth / 2;
        let sy = depthCenterY - depthPatchHeight / 2;
        let sw = depthPatchWidth;
        let sh = depthPatchHeight;
        
        // Clamp to depth image bounds
        if (sx < 0) { sw += sx; sx = 0; }
        if (sy < 0) { sh += sy; sy = 0; }
        if (sx + sw > depthWidth) sw = depthWidth - sx;
        if (sy + sh > depthHeight) sh = depthHeight - sy;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw patch scaled to fill canvas (maintaining aspect ratio)
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    }
    
    /**
     * Update magnifier lens position and depth patches
     */
    updateLensPosition(e) {
        const rect = this.rgbImage.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Get RGB natural dimensions for boundary checking
        const rgbDisplayWidth = this.rgbImage.offsetWidth;
        const rgbDisplayHeight = this.rgbImage.offsetHeight;
        const rgbNaturalWidth = this.rgbImage.naturalWidth;
        const rgbNaturalHeight = this.rgbImage.naturalHeight;
        
        // Map display coordinates to natural image coordinates
        const scaleX = rgbNaturalWidth / rgbDisplayWidth;
        const scaleY = rgbNaturalHeight / rgbDisplayHeight;
        let srcCenterX = x * scaleX;
        let srcCenterY = y * scaleY;
        
        // Clamp center position to keep patch within bounds
        const halfPatch = this.patchSize / 2;
        srcCenterX = Math.max(halfPatch, Math.min(srcCenterX, rgbNaturalWidth - halfPatch));
        srcCenterY = Math.max(halfPatch, Math.min(srcCenterY, rgbNaturalHeight - halfPatch));
        
        // Convert back to display coordinates for lens positioning
        const clampedX = srcCenterX / scaleX;
        const clampedY = srcCenterY / scaleY;
        
        // Fixed lens size (does not change with scroll)
        const lensSize = 200; // Fixed at 200px for consistent UI
        
        // Calculate lens position (centered on clamped cursor)
        let lensX = clampedX - lensSize / 2;
        let lensY = clampedY - lensSize / 2;
        
        // Keep lens within image bounds
        lensX = Math.max(0, Math.min(lensX, rect.width - lensSize));
        lensY = Math.max(0, Math.min(lensY, rect.height - lensSize));
        
        // Update lens position and size
        this.lens.style.left = lensX + 'px';
        this.lens.style.top = lensY + 'px';
        this.lens.style.width = lensSize + 'px';
        this.lens.style.height = lensSize + 'px';
        
        // Draw RGB content in lens using clamped center (content zooms in/out with wheel, lens size stays fixed)
        this.drawMagnifiedContent(clampedX, clampedY);
        
        this.mousePos = { x: clampedX, y: clampedY };
        
        // Update all depth patches with synchronized zoom using clamped center
        this.canvases.forEach((_, index) => {
            this.drawPatchDepth(index, clampedX, clampedY);
        });
        
        // Update zoom info
        this.updateZoomInfo();
    }
    
    /**
     * Draw RGB content inside the lens
     * The lens size is fixed, but the cropped region varies with patchSize (zoom)
     */
    drawMagnifiedContent(centerX, centerY) {
        if (!this.rgbImage.complete) return;
        
        const canvas = this.lensCanvas;
        const ctx = this.lensCtx;
        
        // Fixed lens canvas size (matches lens div size)
        const lensSize = 200;
        canvas.width = lensSize;
        canvas.height = lensSize;
        
        // Get RGB image dimensions
        const rgbDisplayWidth = this.rgbImage.offsetWidth;
        const rgbDisplayHeight = this.rgbImage.offsetHeight;
        const rgbNaturalWidth = this.rgbImage.naturalWidth;
        const rgbNaturalHeight = this.rgbImage.naturalHeight;
        
        // Map display coordinates to natural image coordinates
        const scaleX = rgbNaturalWidth / rgbDisplayWidth;
        const scaleY = rgbNaturalHeight / rgbDisplayHeight;
        
        const srcCenterX = centerX * scaleX;
        const srcCenterY = centerY * scaleY;
        
        // Use current patch size for the source region (in natural coordinates)
        let sx = srcCenterX - this.patchSize / 2;
        let sy = srcCenterY - this.patchSize / 2;
        let sw = this.patchSize;
        let sh = this.patchSize;
        
        // Clamp to image bounds
        if (sx < 0) { sw += sx; sx = 0; }
        if (sy < 0) { sh += sy; sy = 0; }
        if (sx + sw > rgbNaturalWidth) sw = rgbNaturalWidth - sx;
        if (sy + sh > rgbNaturalHeight) sh = rgbNaturalHeight - sy;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw with circular clipping
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
        ctx.clip();
        
        // Draw the patch region scaled to fill the fixed lens size
        // As patchSize decreases (zoom in), we show a smaller region magnified in the lens
        ctx.drawImage(this.rgbImage, sx, sy, sw, sh, 0, 0, lensSize, lensSize);
        
        ctx.restore();
    }
    
    /**
     * Update zoom information display
     */
    updateZoomInfo() {
        // Calculate magnification factor (lens size / patch size)
        const lensSize = 200; // Fixed lens size
        const magnification = lensSize / this.patchSize;
        
        // Show patch size and magnification
        this.zoomInfo.textContent = `Patch: ${Math.round(this.patchSize)}px | Zoom: ${magnification.toFixed(2)}x`;
    }
    
    /**
     * Handle mouse wheel zoom
     */
    handleWheel(e) {
        e.preventDefault();
        
        // Adjust patch size based on wheel direction
        const delta = e.deltaY > 0 ? 1 : -1;
        const newPatchSize = this.patchSize * (1 + delta * this.config.zoomStep);
        
        // Clamp patch size
        this.patchSize = Math.max(
            this.config.minPatchSize,
            Math.min(this.config.maxPatchSize, newPatchSize)
        );
        
        // Update display
        if (this.isHovering && this.lastMouseEvent) {
            this.updateLensPosition(this.lastMouseEvent);
        }
    }
    
    /**
     * Initialize event listeners
     */
    initEvents() {
        if (!this.rgbSide) {
            console.error('RGB side element not found');
            return;
        }
        
        // Mouse enter
        this.rgbSide.addEventListener('mouseenter', (e) => {
            this.isHovering = true;
            this.lens.style.display = 'block';
            this.zoomInfo.style.display = 'block';
            // Trigger animation
            setTimeout(() => {
                this.lens.classList.add('active');
                this.zoomInfo.classList.add('active');
            }, 10);
            
            // Immediately show patch on enter
            this.updateLensPosition(e);
        });
        
        // Mouse leave
        this.rgbSide.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.lens.classList.remove('active');
            this.zoomInfo.classList.remove('active');
            // Wait for animation to complete before hiding
            setTimeout(() => {
                this.lens.style.display = 'none';
                this.zoomInfo.style.display = 'none';
            }, 300);
            
            // Restore full depth images
            this.canvases.forEach((_, index) => {
                this.drawFullDepth(index);
            });
        });
        
        // Mouse move
        this.rgbSide.addEventListener('mousemove', (e) => {
            this.lastMouseEvent = e;
            if (this.isHovering) {
                this.updateLensPosition(e);
            }
        });
        
        // Mouse wheel for zoom
        this.rgbSide.addEventListener('wheel', (e) => {
            if (this.isHovering) {
                this.handleWheel(e);
            }
        }, { passive: false });
        
        // Touch support
        this.rgbSide.addEventListener('touchstart', (e) => {
            this.isHovering = true;
            this.lens.style.display = 'block';
            this.zoomInfo.style.display = 'block';
            setTimeout(() => {
                this.lens.classList.add('active');
                this.zoomInfo.classList.add('active');
            }, 10);
            this.handleTouchMove(e);
        });
        
        this.rgbSide.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.handleTouchMove(e);
        }, { passive: false });
        
        this.rgbSide.addEventListener('touchend', () => {
            this.isHovering = false;
            this.lens.classList.remove('active');
            this.zoomInfo.classList.remove('active');
            setTimeout(() => {
                this.lens.style.display = 'none';
                this.zoomInfo.style.display = 'none';
            }, 300);
            this.canvases.forEach((_, index) => {
                this.drawFullDepth(index);
            });
        });
    }
    
    /**
     * Handle touch move events
     */
    handleTouchMove(e) {
        const touch = e.touches[0];
        const mouseEvent = {
            clientX: touch.clientX,
            clientY: touch.clientY
        };
        this.updateLensPosition(mouseEvent);
    }
}

// Initialize after page load
window.addEventListener('load', () => {
    if (typeof InfiniDepthConfig !== 'undefined') {
        const magnifier = new DepthMagnifier(InfiniDepthConfig);
        console.log('DepthMagnifier initialized');
    } else {
        console.error('InfiniDepthConfig not found. Please include config.js before magnifier.js');
    }
});
