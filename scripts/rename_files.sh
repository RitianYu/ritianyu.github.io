#!/bin/bash

# InfiniDepth 文件重命名脚本
# 为文件添加前缀，方便上传到 GitHub Releases（扁平化结构）

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
ASSETS_DIR="$PROJECT_DIR/images/pub/infinidepth"
OUTPUT_DIR="$PROJECT_DIR/assets_renamed_for_upload"

echo "=========================================="
echo "InfiniDepth 文件重命名（扁平化）"
echo "=========================================="

# 创建输出目录
mkdir -p "$OUTPUT_DIR"

# 重命名函数
rename_and_copy() {
    local source_dir=$1
    local prefix=$2

    if [ ! -d "$source_dir" ]; then
        echo "⚠️  目录不存在: $source_dir"
        return
    fi

    echo ""
    echo "处理: $source_dir"
    echo "前缀: ${prefix}_"

    local count=0
    for file in "$source_dir"/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            new_filename="${prefix}_${filename}"
            cp "$file" "$OUTPUT_DIR/$new_filename"
            echo "  ✓ $filename -> $new_filename"
            ((count++))
        fi
    done

    echo "  完成: $count 个文件"
}

# 处理各个目录
rename_and_copy "$ASSETS_DIR/depth" "depth-comparison"
rename_and_copy "$ASSETS_DIR/interactitve_depth" "interactive-depth"
rename_and_copy "$ASSETS_DIR/pointclouds" "pointclouds"
rename_and_copy "$ASSETS_DIR/vis_pcd" "vis-pcd"
rename_and_copy "$ASSETS_DIR/vis_nvs" "vis-nvs"
rename_and_copy "$ASSETS_DIR/nvs_compare" "nvs-comparison"

# 复制单独的文件（不需要改名）
if [ -f "$ASSETS_DIR/demo.mov" ]; then
    cp "$ASSETS_DIR/demo.mov" "$OUTPUT_DIR/demo.mov"
    echo ""
    echo "✓ 已复制: demo.mov"
fi

if [ -f "$ASSETS_DIR/pipeline.jpg" ]; then
    cp "$ASSETS_DIR/pipeline.jpg" "$OUTPUT_DIR/pipeline.jpg"
    echo "✓ 已复制: pipeline.jpg"
fi

if [ -f "$ASSETS_DIR/DSC_6487.png" ]; then
    cp "$ASSETS_DIR/DSC_6487.png" "$OUTPUT_DIR/DSC_6487.png"
    echo "✓ 已复制: DSC_6487.png"
fi

# 统计信息
echo ""
echo "=========================================="
echo "汇总"
echo "=========================================="
echo "输出目录: $OUTPUT_DIR"
echo ""
echo "文件列表:"
ls -lh "$OUTPUT_DIR" | tail -n +2 | awk '{printf "  %s\t%s\n", $5, $9}'
echo ""
echo "总文件数: $(ls -1 "$OUTPUT_DIR" | wc -l)"
echo "总大小: $(du -sh "$OUTPUT_DIR" | cut -f1)"
echo ""
echo "=========================================="
echo "下一步操作"
echo "=========================================="
echo "1. 访问 GitHub Releases:"
echo "   https://github.com/zju3dv/zju3dv.github.io/releases/new"
echo ""
echo "2. 创建新 Release:"
echo "   - Tag: infinidepth-assets-v1.0"
echo "   - Title: InfiniDepth Project Assets"
echo ""
echo "3. 上传目录中的所有文件:"
echo "   $OUTPUT_DIR"
echo ""
echo "4. 发布 Release 后，运行更新脚本:"
echo "   cd $SCRIPT_DIR"
echo "   python3 update_config.py --dry-run"
echo "   python3 update_config.py"
echo ""
