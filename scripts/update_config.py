import os
import re
import sys
from pathlib import Path

# Configuration
GITHUB_REPO = "RitianYu/ritianyu.github.io"
RELEASE_TAG = "infinidepth-assets-v1.0"  
BASE_URL = f"https://github.com/{GITHUB_REPO}/releases/download/{RELEASE_TAG}"

# 选择文件组织方式
# 方式1: USE_FLAT_STRUCTURE = True  (扁平化，文件名带前缀，如 depth-comparison_depth1.jpg)
# 方式2: USE_FLAT_STRUCTURE = False (保持原始文件名，但路径用前缀替换)
USE_FLAT_STRUCTURE = True

if USE_FLAT_STRUCTURE:
    # 扁平化结构：文件名格式为 [前缀]_[原文件名]
    ASSET_MAPPING = {
        "images/pub/infinidepth/depth/": f"{BASE_URL}/depth-comparison_",
        "images/pub/infinidepth/interactitve_depth/": f"{BASE_URL}/interactive-depth_",
        "images/pub/infinidepth/pointclouds/": f"{BASE_URL}/pointclouds_",
        "images/pub/infinidepth/vis_pcd/": f"{BASE_URL}/vis-pcd_",
        "images/pub/infinidepth/vis_nvs/": f"{BASE_URL}/vis-nvs_",
        "images/pub/infinidepth/nvs_compare/": f"{BASE_URL}/nvs-comparison_",
        "images/pub/infinidepth/demo.mov": f"{BASE_URL}/demo.mov",
        "images/pub/infinidepth/pipeline.jpg": f"{BASE_URL}/pipeline.jpg",
        "images/pub/infinidepth/DSC_6487.png": f"{BASE_URL}/DSC_6487.png",
    }
else:
    # 层级结构：保留子目录（需要上传时保持目录结构）
    ASSET_MAPPING = {
        "images/pub/infinidepth/depth/": f"{BASE_URL}/depth/",
        "images/pub/infinidepth/interactitve_depth/": f"{BASE_URL}/interactitve_depth/",
        "images/pub/infinidepth/pointclouds/": f"{BASE_URL}/pointclouds/",
        "images/pub/infinidepth/vis_pcd/": f"{BASE_URL}/vis_pcd/",
        "images/pub/infinidepth/vis_nvs/": f"{BASE_URL}/vis_nvs/",
        "images/pub/infinidepth/nvs_compare/": f"{BASE_URL}/nvs_compare/",
        "images/pub/infinidepth/demo.mov": f"{BASE_URL}/demo.mov",
        "images/pub/infinidepth/pipeline.jpg": f"{BASE_URL}/pipeline.jpg",
    }


class AssetUpdater:
    def __init__(self, project_dir):
        self.project_dir = Path(project_dir)
        self.backup_suffix = ".backup"
        self.updated_files = []

    def update_file(self, file_path, dry_run=False):
        """Update asset URLs in a single file"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()

        original_content = content
        replacements = 0

        # Replace each asset path
        for local_path, remote_url in ASSET_MAPPING.items():
            # Handle both quoted and unquoted paths
            patterns = [
                (f'"{local_path}', f'"{remote_url}'),
                (f"'{local_path}", f"'{remote_url}"),
            ]

            for old, new in patterns:
                if old in content:
                    count_before = content.count(old)
                    content = content.replace(old, new)
                    count_after = original_content.count(old)
                    replacements += count_after

        if content != original_content:
            if not dry_run:
                # Create backup
                backup_path = str(file_path) + self.backup_suffix
                with open(backup_path, 'w', encoding='utf-8') as f:
                    f.write(original_content)

                # Write updated content
                with open(file_path, 'w', encoding='utf-8') as f:
                    f.write(content)

                print(f"✓ Updated: {file_path.relative_to(self.project_dir)} ({replacements} replacements)")
                self.updated_files.append(file_path)
            else:
                print(f"[DRY RUN] Would update: {file_path.relative_to(self.project_dir)} ({replacements} replacements)")
            return True
        else:
            print(f"  No changes: {file_path.relative_to(self.project_dir)}")
        return False

    def update_all(self, dry_run=False):
        """Update all HTML and JS files"""
        files_to_update = [
            self.project_dir / "index.html",
            self.project_dir / "js/infinidepth/config.js",
            self.project_dir / "js/infinidepth/viz-showcase.js",
            self.project_dir / "js/infinidepth/showcase.js",
        ]

        print("=" * 70)
        print("InfiniDepth Asset URL Updater")
        print("=" * 70)
        print(f"GitHub Release URL: {BASE_URL}")
        print(f"Release Tag: {RELEASE_TAG}")
        print(f"File Structure: {'Flat (with prefixes)' if USE_FLAT_STRUCTURE else 'Hierarchical'}")
        print()

        if dry_run:
            print("⚠️  DRY RUN MODE - No files will be modified")
            print()

        updated_count = 0
        for file_path in files_to_update:
            if file_path.exists():
                if self.update_file(file_path, dry_run):
                    updated_count += 1
            else:
                print(f"⚠️  File not found: {file_path.relative_to(self.project_dir)}")

        print()
        print("=" * 70)
        print(f"Summary: {updated_count} file(s) {'would be ' if dry_run else ''}updated")
        print("=" * 70)

        if not dry_run and updated_count > 0:
            print()
            print("✅ Backup files created with .backup extension")
            print("   To restore original files, run:")
            print("   python3 update_config.py --restore")
            print()
            print("📝 Next steps:")
            print("   1. Test locally: python3 -m http.server 8000")
            print("   2. Verify all assets load correctly")
            print("   3. Commit and push changes")

    def restore_backups(self):
        """Restore files from backups"""
        print("Restoring files from backups...")
        restored = 0

        for file_path in self.project_dir.rglob(f"*{self.backup_suffix}"):
            original_path = Path(str(file_path).replace(self.backup_suffix, ''))
            if original_path.exists():
                os.replace(file_path, original_path)
                print(f"✓ Restored: {original_path.relative_to(self.project_dir)}")
                restored += 1

        print(f"\n✅ Restored {restored} file(s)")


def main():
    script_dir = Path(__file__).parent
    project_dir = script_dir.parent

    import argparse
    parser = argparse.ArgumentParser(
        description='Update InfiniDepth asset URLs to GitHub Releases',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  # Preview changes without modifying files
  python3 update_config.py --dry-run

  # Update files with custom release tag
  python3 update_config.py --tag infinidepth-v2.0

  # Restore original files from backups
  python3 update_config.py --restore
        """
    )
    parser.add_argument('--dry-run', action='store_true',
                       help='Preview changes without modifying files')
    parser.add_argument('--restore', action='store_true',
                       help='Restore files from backups')
    parser.add_argument('--tag', type=str,
                       help='Override release tag (default: infinidepth-assets-v1.0)')
    parser.add_argument('--flat', action='store_true',
                       help='Use flat file structure (files named with prefixes)')
    parser.add_argument('--hierarchical', action='store_true',
                       help='Use hierarchical structure (files in subdirectories)')
    args = parser.parse_args()

    # Update release tag if provided
    if args.tag:
        global RELEASE_TAG, BASE_URL, ASSET_MAPPING
        RELEASE_TAG = args.tag
        BASE_URL = f"https://github.com/{GITHUB_REPO}/releases/download/{RELEASE_TAG}"

    # Update structure preference
    if args.flat:
        global USE_FLAT_STRUCTURE
        USE_FLAT_STRUCTURE = True
    elif args.hierarchical:
        USE_FLAT_STRUCTURE = False

    # Rebuild asset mapping with new settings
    if USE_FLAT_STRUCTURE:
        ASSET_MAPPING = {
            "images/pub/infinidepth/depth/": f"{BASE_URL}/depth-comparison_",
            "images/pub/infinidepth/interactitve_depth/": f"{BASE_URL}/interactive-depth_",
            "images/pub/infinidepth/pointclouds/": f"{BASE_URL}/pointclouds_",
            "images/pub/infinidepth/vis_pcd/": f"{BASE_URL}/vis-pcd_",
            "images/pub/infinidepth/vis_nvs/": f"{BASE_URL}/vis-nvs_",
            "images/pub/infinidepth/nvs_compare/": f"{BASE_URL}/nvs-comparison_",
            "images/pub/infinidepth/demo.mov": f"{BASE_URL}/demo.mov",
            "images/pub/infinidepth/pipeline.jpg": f"{BASE_URL}/pipeline.jpg",
            "images/pub/infinidepth/DSC_6487.png": f"{BASE_URL}/DSC_6487.png",
        }
    else:
        ASSET_MAPPING = {
            "images/pub/infinidepth/depth/": f"{BASE_URL}/depth/",
            "images/pub/infinidepth/interactitve_depth/": f"{BASE_URL}/interactitve_depth/",
            "images/pub/infinidepth/pointclouds/": f"{BASE_URL}/pointclouds/",
            "images/pub/infinidepth/vis_pcd/": f"{BASE_URL}/vis_pcd/",
            "images/pub/infinidepth/vis_nvs/": f"{BASE_URL}/vis_nvs/",
            "images/pub/infinidepth/nvs_compare/": f"{BASE_URL}/nvs_compare/",
            "images/pub/infinidepth/demo.mov": f"{BASE_URL}/demo.mov",
            "images/pub/infinidepth/pipeline.jpg": f"{BASE_URL}/pipeline.jpg",
        }

    updater = AssetUpdater(project_dir)

    if args.restore:
        updater.restore_backups()
    else:
        updater.update_all(dry_run=args.dry_run)


if __name__ == "__main__":
    main()
