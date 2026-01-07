#!/bin/bash

# InfiniDepth Assets Preparation Script
# This script helps prepare assets for uploading to GitHub Releases

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ASSETS_DIR="$PROJECT_DIR/images/pub/infinidepth"
OUTPUT_DIR="$PROJECT_DIR/assets_for_upload"

echo "==================================================="
echo "InfiniDepth Assets Preparation"
echo "==================================================="

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to create tar archives
create_archive() {
    local name=$1
    local source=$2

    echo ""
    echo "Creating archive: ${name}.tar.gz"
    tar -czf "$OUTPUT_DIR/${name}.tar.gz" -C "$(dirname "$source")" "$(basename "$source")"

    if [ $? -eq 0 ]; then
        size=$(du -h "$OUTPUT_DIR/${name}.tar.gz" | cut -f1)
        echo "✓ Created: ${name}.tar.gz (${size})"
    else
        echo "✗ Failed to create ${name}.tar.gz"
    fi
}

# Archive different asset categories
echo ""
echo "Preparing assets for upload..."

# 1. Depth comparison images
if [ -d "$ASSETS_DIR/depth" ]; then
    create_archive "depth-comparison" "$ASSETS_DIR/depth"
fi

# 2. Interactive depth images
if [ -d "$ASSETS_DIR/interactitve_depth" ]; then
    create_archive "interactive-depth" "$ASSETS_DIR/interactitve_depth"
fi

# 3. Point clouds
if [ -d "$ASSETS_DIR/pointclouds" ]; then
    create_archive "pointclouds" "$ASSETS_DIR/pointclouds"
fi

# 4. Point cloud visualization images
if [ -d "$ASSETS_DIR/vis_pcd" ]; then
    create_archive "vis-pcd" "$ASSETS_DIR/vis_pcd"
fi

# 5. NVS videos
if [ -d "$ASSETS_DIR/vis_nvs" ]; then
    create_archive "vis-nvs" "$ASSETS_DIR/vis_nvs"
fi

# 6. NVS comparison images
if [ -d "$ASSETS_DIR/nvs_compare" ]; then
    create_archive "nvs-comparison" "$ASSETS_DIR/nvs_compare"
fi

# 7. Demo video (main overview)
if [ -f "$ASSETS_DIR/demo.mov" ]; then
    echo ""
    echo "Copying demo video..."
    cp "$ASSETS_DIR/demo.mov" "$OUTPUT_DIR/demo.mov"
    size=$(du -h "$OUTPUT_DIR/demo.mov" | cut -f1)
    echo "✓ Copied: demo.mov (${size})"
fi

# 8. Pipeline image
if [ -f "$ASSETS_DIR/pipeline.jpg" ]; then
    echo ""
    echo "Copying pipeline image..."
    cp "$ASSETS_DIR/pipeline.jpg" "$OUTPUT_DIR/pipeline.jpg"
    size=$(du -h "$OUTPUT_DIR/pipeline.jpg" | cut -f1)
    echo "✓ Copied: pipeline.jpg (${size})"
fi

# Generate file list
echo ""
echo "Generating file list..."
cat > "$OUTPUT_DIR/FILE_LIST.txt" << 'EOF'
InfiniDepth Assets for GitHub Release
======================================

Archive Contents:
-----------------
1. depth-comparison.tar.gz      - Depth map comparison images
2. interactive-depth.tar.gz     - High-resolution interactive depth maps
3. pointclouds.tar.gz           - PLY point cloud files
4. vis-pcd.tar.gz               - Point cloud visualization images
5. vis-nvs.tar.gz               - Novel view synthesis videos
6. nvs-comparison.tar.gz        - NVS comparison images
7. demo.mov                     - Main overview demo video
8. pipeline.jpg                 - Method pipeline diagram

Upload Instructions:
--------------------
1. Go to your GitHub repository: https://github.com/zju3dv/zju3dv.github.io
2. Navigate to "Releases" → "Create a new release"
3. Create a tag (e.g., "infinidepth-assets-v1.0")
4. Upload all files from this directory
5. Publish the release
6. Use the update_config.py script to update your HTML/JS files with the release URLs

After uploading, your asset URLs will be:
https://github.com/zju3dv/zju3dv.github.io/releases/download/infinidepth-assets-v1.0/[filename]
EOF

# Summary
echo ""
echo "==================================================="
echo "Summary"
echo "==================================================="
echo "Output directory: $OUTPUT_DIR"
echo ""
echo "Files prepared for upload:"
ls -lh "$OUTPUT_DIR"
echo ""
echo "Total size:"
du -sh "$OUTPUT_DIR"
echo ""
echo "Next steps:"
echo "1. Upload these files to GitHub Releases"
echo "2. Note the release tag name"
echo "3. Run the update_config.py script to update your code"
echo ""
