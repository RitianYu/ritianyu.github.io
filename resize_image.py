#!/usr/bin/env python3
"""
Image Resize Script
Resize images to 768x1024 resolution
"""

import argparse
from PIL import Image
import os

def resize_image(input_path, output_path, width=768, height=1024, mode='resize'):
    """
    Resize image to specified dimensions

    Args:
        input_path: Path to input image
        output_path: Path to save resized image
        width: Target width (default: 768)
        height: Target height (default: 1024)
        mode: Resize mode - 'resize' (stretch), 'fit' (keep aspect ratio, pad),
              or 'crop' (keep aspect ratio, crop)
    """
    # Open image
    img = Image.open(input_path)
    print(f"Original size: {img.size}")

    if mode == 'resize':
        # Direct resize (may stretch)
        resized = img.resize((width, height), Image.LANCZOS)

    elif mode == 'fit':
        # Resize to fit within bounds, keep aspect ratio, add padding
        img.thumbnail((width, height), Image.LANCZOS)
        # Create new image with target size and paste resized image centered
        resized = Image.new('RGB', (width, height), (255, 255, 255))
        offset = ((width - img.width) // 2, (height - img.height) // 2)
        resized.paste(img, offset)

    elif mode == 'crop':
        # Resize to cover bounds, keep aspect ratio, crop excess
        img_ratio = img.width / img.height
        target_ratio = width / height

        if img_ratio > target_ratio:
            # Image is wider, fit to height
            new_height = height
            new_width = int(height * img_ratio)
        else:
            # Image is taller, fit to width
            new_width = width
            new_height = int(width / img_ratio)

        img = img.resize((new_width, new_height), Image.LANCZOS)

        # Crop to target size from center
        left = (new_width - width) // 2
        top = (new_height - height) // 2
        resized = img.crop((left, top, left + width, top + height))

    else:
        raise ValueError(f"Unknown mode: {mode}")

    # Save resized image
    resized.save(output_path, quality=95)
    print(f"Resized to: {resized.size}")
    print(f"Saved to: {output_path}")

def main():
    parser = argparse.ArgumentParser(description='Resize images to 768x1024')
    parser.add_argument('--input', default="/nas2/home/yuhao/code/haoyu.github.io/images/pub/infinidepth/vis_depth/PromptNeuralDepth_000011_up_16_disparity.png", help='Input image path or directory')
    parser.add_argument('-o', '--output', default="/nas2/home/yuhao/code/haoyu.github.io/images/pub/infinidepth/interactitve_depth/depth4.png", help='Output path (default: input_resized.ext)')
    parser.add_argument('-w', '--width', type=int, default=7680, help='Target width (default: 768)')
    parser.add_argument('-H', '--height', type=int, default=5120, help='Target height (default: 1024)')
    parser.add_argument('-m', '--mode', choices=['resize', 'fit', 'crop'], default='resize',
                        help='Resize mode: resize (stretch), fit (pad), crop (default: resize)')
    parser.add_argument('-d', '--dir', action='store_true',
                        help='Process all images in directory')

    args = parser.parse_args()

    if args.dir:
        # Process directory
        if not os.path.isdir(args.input):
            print(f"Error: {args.input} is not a directory")
            return

        output_dir = args.output or os.path.join(args.input, 'resized')
        os.makedirs(output_dir, exist_ok=True)

        # Get all image files
        image_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.gif', '.tiff'}
        files = [f for f in os.listdir(args.input)
                 if os.path.splitext(f.lower())[1] in image_extensions]

        print(f"Found {len(files)} images")
        for i, filename in enumerate(files, 1):
            input_path = os.path.join(args.input, filename)
            output_path = os.path.join(output_dir, filename)
            print(f"\n[{i}/{len(files)}] Processing: {filename}")
            try:
                resize_image(input_path, output_path, args.width, args.height, args.mode)
            except Exception as e:
                print(f"Error processing {filename}: {e}")
    else:
        # Process single file
        if not os.path.isfile(args.input):
            print(f"Error: {args.input} not found")
            return

        # Generate output path
        if args.output:
            output_path = args.output
        else:
            name, ext = os.path.splitext(args.input)
            output_path = f"{name}_resized{ext}"

        resize_image(args.input, output_path, args.width, args.height, args.mode)

if __name__ == '__main__':
    main()
