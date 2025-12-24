/**
 * InfiniDepth Interactive Depth Magnifier - Debug Version
 * 
 * Simplified version for screen recording:
 * - Single depth map display (same size as RGB)
 * - Keyboard zoom control (+ and - keys)
 * - No mouse wheel zoom
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
        this.lensCtx = this.lensCanvas.getContext('2d', {
            alpha: true,  // Need alpha for circular mask
            desynchronized: true  // Allow desynchronized rendering
        });
        
        // Single depth canvas
        this.depthCanvas = document.getElementById('depthCanvas');
        this.depthCtx = this.depthCanvas ? this.depthCanvas.getContext('2d', {
            alpha: false,  // Disable alpha for better performance
            desynchronized: true  // Allow canvas to be desynchronized for better performance
        }) : null;
        this.depthLabel = document.getElementById('depthLabel');
        
        // State
        this.isHovering = false;
        this.depthImageLoaded = null;
        this.patchSize = this.config.initialPatchSize;
        this.zoomLevel = 1.0;
        this.mousePos = { x: 0, y: 0 };
        this.targetPos = { x: 0, y: 0 }; // Target position for smooth movement
        this.currentPos = { x: 0, y: 0 }; // Current smoothed position
        this.lastMouseEvent = null;
        
        // Smooth movement settings
        this.smoothingEnabled = this.config.smoothMovement !== false; // Default true
        this.smoothingFactor = this.config.smoothingFactor || 0.3; // 0.1-0.5, higher = more responsive
        this.animationFrameId = null;
        
        // Performance optimization
        this.isUpdating = false; // Prevent concurrent updates
        this.pendingUpdate = false; // Flag for pending updates
        
        // Initialize keyboard controls
        this.initKeyboardControls();
        
        // Initialize scene navigation
        this.initSceneNavigation();
        
        // Load first scene
        this.loadScene(0);
    }
    
    /**
     * Initialize keyboard controls for zoom
     */
    initKeyboardControls() {
        document.addEventListener('keydown', (e) => {
            // Check for + or = key (zoom in)
            if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                this.handleKeyboardZoom(-1); // -1 for zoom in (decrease patch size)
            }
            // Check for - key (zoom out)
            else if (e.key === '-') {
                e.preventDefault();
                this.handleKeyboardZoom(1); // 1 for zoom out (increase patch size)
            }
        });
        
        console.log('Keyboard controls initialized: Press +/= to zoom in, - to zoom out');
    }
    
    /**
     * Handle keyboard zoom
     */
    handleKeyboardZoom(direction) {
        // Adjust patch size based on direction
        const newPatchSize = this.patchSize * (1 + direction * this.config.zoomStep);
        
        // Clamp patch size
        this.patchSize = Math.max(
            this.config.minPatchSize,
            Math.min(this.config.maxPatchSize, newPatchSize)
        );
        
        console.log(`Keyboard zoom: ${direction > 0 ? 'out' : 'in'}, new patch size: ${Math.round(this.patchSize)}`);
        
        // Use requestAnimationFrame for smooth update
        if (!this.isUpdating && this.isHovering) {
            this.isUpdating = true;
            requestAnimationFrame(() => {
                if (this.smoothingEnabled && this.animationFrameId) {
                    // In smooth mode, just update will happen in animation loop
                    // Force immediate update by resetting current position
                    const rect = this.rgbImage.getBoundingClientRect();
                    const smoothedEvent = {
                        clientX: rect.left + this.currentPos.x,
                        clientY: rect.top + this.currentPos.y
                    };
                    this.updateLensPositionDirect(smoothedEvent);
                } else if (this.lastMouseEvent) {
                    // In non-smooth mode, update with last mouse position
                    this.updateLensPosition(this.lastMouseEvent);
                }
                this.isUpdating = false;
            });
        }
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
        
        // Update method label
        if (this.depthLabel && scene.methodLabel) {
            this.depthLabel.textContent = scene.methodLabel;
        }
        
        // Update navigation buttons
        this.updateNavigationButtons();
        
        // Reset depth image
        this.depthImageLoaded = null;
        
        // Clear canvas while loading
        if (this.depthCtx) {
            this.depthCtx.clearRect(0, 0, this.depthCanvas.width, this.depthCanvas.height);
        }
        
        // Update RGB image
        const oldSrc = this.rgbImage.src;
        const newSrc = scene.rgbImage;
        
        if (!oldSrc.endsWith(newSrc)) {
            // Set new image source
            this.rgbImage.src = newSrc;
            
            // Wait for RGB image to fully load before initializing canvas
            if (this.rgbImage.complete && this.rgbImage.naturalWidth > 0) {
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
        // Initialize canvas sizes after RGB image loads
        this.initializeCanvasSizes();
        this.loadDepthImage(scene.depthImage);
        
        // Initialize events only once
        if (!this.eventsInitialized) {
            this.initEvents();
            this.setupMagnifierLens();
            this.eventsInitialized = true;
        }
        
        // Handle window resize - reinitialize canvas sizes
        if (!this.resizeHandlerAdded) {
            window.addEventListener('resize', () => {
                this.initializeCanvasSizes();
            });
            this.resizeHandlerAdded = true;
        }
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
        
        // Wait for image to load to get correct dimensions
        if (!this.rgbImage.complete || this.rgbImage.naturalWidth === 0) {
            this.rgbImage.addEventListener('load', () => this.initializeCanvasSizes(), { once: true });
            return;
        }
        
        const rgbHeight = this.rgbImage.offsetHeight;
        const rgbWidth = this.rgbImage.offsetWidth;
        
        // Set depth canvas to match RGB image DISPLAY size exactly
        if (this.depthCanvas) {
            // Set canvas internal resolution to match RGB image display size
            this.depthCanvas.width = Math.round(rgbWidth);
            this.depthCanvas.height = Math.round(rgbHeight);
            
            // Also set CSS size to match (for proper rendering)
            this.depthCanvas.style.width = rgbWidth + 'px';
            this.depthCanvas.style.height = rgbHeight + 'px';
            
            // Redraw if depth image is loaded
            if (this.depthImageLoaded) {
                this.drawFullDepth();
            }
            
            console.log(`Canvas size initialized: ${Math.round(rgbWidth)}x${Math.round(rgbHeight)} (display), naturalWidth: ${this.rgbImage.naturalWidth}x${this.rgbImage.naturalHeight}`);
        }
    }
    
    /**
     * Load depth image
     */
    loadDepthImage(depthImagePath) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
            this.depthImageLoaded = img;
            this.drawFullDepth();
            console.log('Depth image loaded:', depthImagePath);
        };
        img.onerror = () => {
            console.error('Failed to load depth image:', depthImagePath);
        };
        img.src = depthImagePath;
    }
    
    /**
     * Draw full depth image to canvas
     */
    drawFullDepth() {
        if (!this.depthImageLoaded || !this.depthCtx) return;
        
        const canvas = this.depthCanvas;
        const ctx = this.depthCtx;
        const img = this.depthImageLoaded;
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }
    
    /**
     * Draw a patch of depth image centered at given coordinates
     * Key: maintain same relative patch size as RGB to ensure correspondence
     */
    drawPatchDepth(centerX, centerY) {
        if (!this.depthImageLoaded || !this.depthCtx) return;
        
        const canvas = this.depthCanvas;
        const ctx = this.depthCtx;
        const img = this.depthImageLoaded;
        
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
        
        // Use willReadFrequently hint for better performance
        if (!ctx.willReadFrequently) {
            // Clear canvas efficiently
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Enable image smoothing for better quality
        ctx.imageSmoothingEnabled = this.config.highQualityRendering !== false;
        ctx.imageSmoothingQuality = this.config.highQualityRendering !== false ? 'high' : 'low';
        
        // Draw patch scaled to fill canvas (maintaining aspect ratio)
        try {
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
        } catch (e) {
            console.warn('Error drawing depth patch:', e);
        }
    }
    
    /**
     * Update magnifier lens position and depth patch
     */
    updateLensPosition(e) {
        // If smoothing is enabled and we're in animation mode, just return
        // The smooth animation loop will handle updates
        if (this.smoothingEnabled && this.animationFrameId) {
            return;
        }
        
        // Otherwise, update directly (for non-smooth mode or first update)
        this.updateLensPositionDirect(e);
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
        
        // Only resize canvas if needed (avoid unnecessary operations)
        if (canvas.width !== lensSize || canvas.height !== lensSize) {
            canvas.width = lensSize;
            canvas.height = lensSize;
        }
        
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
        
        // Enable high-quality image smoothing
        ctx.imageSmoothingEnabled = this.config.highQualityRendering !== false;
        ctx.imageSmoothingQuality = this.config.highQualityRendering !== false ? 'high' : 'low';
        
        // Draw with circular clipping
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
        ctx.clip();
        
        // Draw the patch region scaled to fill the fixed lens size
        // As patchSize decreases (zoom in), we show a smaller region magnified in the lens
        try {
            ctx.drawImage(this.rgbImage, sx, sy, sw, sh, 0, 0, lensSize, lensSize);
        } catch (e) {
            console.warn('Error drawing magnified content:', e);
        }
        
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
            
            // Initialize position for smooth movement
            const rect = this.rgbImage.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            this.targetPos = { x, y };
            this.currentPos = { x, y };
            
            // Trigger animation
            setTimeout(() => {
                this.lens.classList.add('active');
                this.zoomInfo.classList.add('active');
            }, 10);
            
            // Start smooth animation loop
            if (this.smoothingEnabled) {
                this.startSmoothAnimation();
            } else {
                this.updateLensPosition(e);
            }
        });
        
        // Mouse leave
        this.rgbSide.addEventListener('mouseleave', () => {
            this.isHovering = false;
            this.lens.classList.remove('active');
            this.zoomInfo.classList.remove('active');
            
            // Stop smooth animation loop
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
                this.animationFrameId = null;
            }
            
            // Wait for animation to complete before hiding
            setTimeout(() => {
                this.lens.style.display = 'none';
                this.zoomInfo.style.display = 'none';
            }, 300);
            
            // Restore full depth image
            this.drawFullDepth();
        });
        
        // Mouse move
        this.rgbSide.addEventListener('mousemove', (e) => {
            this.lastMouseEvent = e;
            if (this.isHovering) {
                const rect = this.rgbImage.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Update target position for smooth movement
                this.targetPos = { x, y };
                
                // If smoothing is disabled, update immediately
                if (!this.smoothingEnabled) {
                    this.updateLensPosition(e);
                }
            }
        });
        
        // Note: No mouse wheel event listener - zoom is controlled by keyboard only
        
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
            this.drawFullDepth();
        });
    }
    
    /**
     * Start smooth animation loop for mouse movement
     */
    startSmoothAnimation() {
        if (this.animationFrameId) {
            return; // Already running
        }
        
        const animate = () => {
            if (!this.isHovering) {
                this.animationFrameId = null;
                return;
            }
            
            // Smooth interpolation (lerp) towards target position
            const dx = this.targetPos.x - this.currentPos.x;
            const dy = this.targetPos.y - this.currentPos.y;
            
            // Apply smoothing factor
            this.currentPos.x += dx * this.smoothingFactor;
            this.currentPos.y += dy * this.smoothingFactor;
            
            // Create a fake event with smoothed position
            const rect = this.rgbImage.getBoundingClientRect();
            const smoothedEvent = {
                clientX: rect.left + this.currentPos.x,
                clientY: rect.top + this.currentPos.y
            };
            
            // Update lens position with smoothed coordinates
            this.updateLensPositionDirect(smoothedEvent);
            
            // Continue animation
            this.animationFrameId = requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Update lens position directly (used by smooth animation)
     */
    updateLensPositionDirect(e) {
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
        
        // Fixed lens size (does not change with keyboard zoom)
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
        
        // Draw RGB content in lens using clamped center
        this.drawMagnifiedContent(clampedX, clampedY);
        
        this.mousePos = { x: clampedX, y: clampedY };
        
        // Update depth patch with synchronized zoom using clamped center
        this.drawPatchDepth(clampedX, clampedY);
        
        // Update zoom info
        this.updateZoomInfo();
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
        console.log('DepthMagnifier (Debug Version) initialized');
        console.log('Use +/= keys to zoom in, - key to zoom out');
    } else {
        console.error('InfiniDepthConfig not found. Please include config_debug.js before magnifier_debug.js');
    }
});
