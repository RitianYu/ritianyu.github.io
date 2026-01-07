# 🚀 InfiniDepth GitHub Releases 上传 - 最简化指南

## 方案选择（二选一）

### ✅ 推荐方案：扁平化文件结构（最简单）

直接上传重命名后的文件，无需解压压缩包。

---

## 📋 详细步骤

### 步骤 1: 准备文件（1 分钟）

运行重命名脚本，为所有文件添加前缀：

```bash
cd /nas2/home/yuhao/code/zju3dv.github.io/InfiniDepth/scripts
./rename_files.sh
```

执行后会在 `assets_renamed_for_upload` 目录生成所有重命名后的文件，例如：
- `depth-comparison_depth1.jpg`
- `interactive-depth_rgb1.png`
- `pointclouds_diode_filter.ply`
- `vis-nvs_0_36_orig_to_bev_transition.mp4`
- `demo.mov`（保持原名）

### 步骤 2: 上传到 GitHub Releases（10 分钟）

#### 2.1 访问创建页面

在浏览器打开：
```
https://github.com/zju3dv/zju3dv.github.io/releases/new
```

#### 2.2 填写 Release 信息

| 字段 | 内容 |
|------|------|
| **Tag** | 输入 `infinidepth-assets-v1.0`，然后点击下方的 "Create new tag" |
| **Title** | `InfiniDepth Project Assets` |
| **Description** | 可以留空，或者复制下面的描述 |

<details>
<summary>可选描述（点击展开）</summary>

```
Assets for the InfiniDepth project page.

Contents:
- Depth maps and interactive visualizations
- Point cloud files (.ply)
- Novel view synthesis videos
- Demo videos

These assets are used by: https://zju3dv.github.io/InfiniDepth/
```

</details>

#### 2.3 上传文件

找到页面中的 **"Attach binaries by dropping them here or selecting them."** 区域。

**方法 1：拖拽上传（推荐）**

1. 打开文件管理器
2. 进入目录：
   ```
   /nas2/home/yuhao/code/zju3dv.github.io/InfiniDepth/assets_renamed_for_upload/
   ```
3. 全选所有文件（Ctrl+A 或 Cmd+A）
4. 拖拽到 GitHub 页面的上传区域

**方法 2：点击选择**

1. 点击 "selecting them" 链接
2. 选择 `assets_renamed_for_upload` 目录下的所有文件
3. 点击"打开"

#### 2.4 等待上传完成

上传进度条：
```
Uploading assets...
depth-comparison_depth1.jpg       ████████████ 100%
interactive-depth_rgb1.png        ████████████ 100%
...
```

⏳ 大文件（如视频）可能需要几分钟，请耐心等待。

#### 2.5 发布 Release

确认所有文件都上传完成后，点击页面底部的绿色按钮：

```
[Publish release]  ← 点击这个
```

### 步骤 3: 更新配置文件（2 分钟）

#### 3.1 先预览更改

```bash
cd /nas2/home/yuhao/code/zju3dv.github.io/InfiniDepth/scripts
python3 update_config.py --dry-run
```

查看输出，确认要替换的路径是否正确。

#### 3.2 执行更新

确认无误后，执行：

```bash
python3 update_config.py
```

如果您使用了不同的 tag 名称：

```bash
python3 update_config.py --tag 你的tag名称
```

输出示例：
```
======================================================================
InfiniDepth Asset URL Updater
======================================================================
GitHub Release URL: https://github.com/zju3dv/zju3dv.github.io/releases/download/infinidepth-assets-v1.0
Release Tag: infinidepth-assets-v1.0
File Structure: Flat (with prefixes)

✓ Updated: index.html (15 replacements)
✓ Updated: js/infinidepth/config.js (28 replacements)
✓ Updated: js/infinidepth/viz-showcase.js (42 replacements)
✓ Updated: js/infinidepth/showcase.js (24 replacements)

======================================================================
Summary: 4 file(s) updated
======================================================================

✅ Backup files created with .backup extension
```

### 步骤 4: 本地测试（5 分钟）

#### 4.1 启动本地服务器

```bash
cd /nas2/home/yuhao/code/zju3dv.github.io
python3 -m http.server 8000
```

#### 4.2 在浏览器中测试

访问：`http://localhost:8000/InfiniDepth/`

#### 4.3 验证清单

- [ ] 主视频（demo.mov）能播放
- [ ] 深度图能正常加载
- [ ] 点云能显示和交互
- [ ] NVS 视频能播放
- [ ] 交互式深度图缩放功能正常
- [ ] 图片切换功能正常

**检查浏览器控制台**（按 F12）：
- 如果有 404 错误，说明某些文件 URL 不对
- 如果有 CORS 错误，GitHub Releases 应该已经处理了

### 步骤 5: 提交更改（3 分钟）

#### 5.1 查看更改

```bash
cd /nas2/home/yuhao/code/zju3dv.github.io
git status
git diff InfiniDepth/
```

#### 5.2 提交

```bash
git add InfiniDepth/
git commit -m "Migrate InfiniDepth assets to GitHub Releases

- Move large assets to GitHub Releases (infinidepth-assets-v1.0)
- Update asset URLs in HTML/JS configuration files
- Reduce repository size by ~369MB"
```

#### 5.3 推送

```bash
git push origin master
```

### 步骤 6: 清理本地大文件（可选，⚠️ 谨慎操作）

**重要：** 只有在确认线上页面完全正常后才执行此步骤！

```bash
cd /nas2/home/yuhao/code/zju3dv.github.io/InfiniDepth

# 1. 先创建备份（强烈推荐！）
tar -czf ~/infinidepth-assets-backup-$(date +%Y%m%d).tar.gz images/pub/infinidepth/

# 2. 查看备份
ls -lh ~/infinidepth-assets-backup-*.tar.gz

# 3. 删除已上传的大文件
rm -rf images/pub/infinidepth/depth/
rm -rf images/pub/infinidepth/interactitve_depth/
rm -rf images/pub/infinidepth/pointclouds/
rm -rf images/pub/infinidepth/vis_pcd/
rm -rf images/pub/infinidepth/vis_nvs/
rm -rf images/pub/infinidepth/nvs_compare/
rm images/pub/infinidepth/demo.mov

# 保留 pipeline.jpg（文件很小）

# 4. 提交删除
git add .
git commit -m "Remove large assets now hosted on GitHub Releases"
git push
```

---

## 🔧 故障排查

### 问题 1: 文件上传失败

**症状：** 上传时出错或超时

**解决：**
- 检查网络连接
- 尝试分批上传（先上传图片，再上传视频）
- 单个文件大小不能超过 2GB

### 问题 2: 页面加载不出图片/视频

**症状：** 浏览器控制台显示 404 错误

**解决：**
1. 检查 Release 是否已发布（不是草稿）
2. 验证文件 URL 格式：
   ```
   https://github.com/zju3dv/zju3dv.github.io/releases/download/infinidepth-assets-v1.0/[文件名]
   ```
3. 在浏览器中直接访问某个文件 URL，看是否能下载

### 问题 3: 更新配置后页面显示异常

**症状：** 页面布局错乱或功能失效

**解决：**
```bash
cd /nas2/home/yuhao/code/zju3dv.github.io/InfiniDepth/scripts
python3 update_config.py --restore
```

恢复后重新检查并修复。

### 问题 4: CORS 错误

**症状：** 浏览器控制台显示 CORS 相关错误

**解决：**
- GitHub Releases 默认支持 CORS，应该不会有问题
- 如果仍有问题，可以考虑使用 jsdelivr CDN：
  ```
  https://cdn.jsdelivr.net/gh/zju3dv/zju3dv.github.io@infinidepth-assets-v1.0/[文件名]
  ```

---

## 📊 预期效果

### 仓库大小变化

| 项目 | 之前 | 之后 | 节省 |
|------|------|------|------|
| 仓库总大小 | ~2GB+ | ~1.6GB | ~369MB |
| InfiniDepth 目录 | ~369MB | ~100KB | 99.97% |
| Clone 速度 | 慢 | 快 ⚡ | 显著提升 |

### 页面性能

- ✅ 首次加载：无变化或稍快（GitHub CDN 加速）
- ✅ 全球访问：通过 CDN 加速，更快
- ✅ 功能：完全正常，无任何影响

---

## 📞 获取帮助

如果遇到问题：

1. **检查详细指南：**
   - `GitHub_Releases_上传详细步骤.md`
   - `README.md`

2. **查看脚本帮助：**
   ```bash
   python3 update_config.py --help
   ```

3. **查看 GitHub 文档：**
   - https://docs.github.com/en/repositories/releasing-projects-on-github

---

## ✅ 完成检查清单

上传完成后，确认以下事项：

- [ ] GitHub Release 已成功发布
- [ ] 所有文件都已上传（检查文件数量）
- [ ] 配置文件已更新（4 个文件）
- [ ] 本地测试通过（所有功能正常）
- [ ] 代码已提交并推送
- [ ] 线上页面正常显示（https://zju3dv.github.io/InfiniDepth/）
- [ ] 本地大文件已删除（可选）

🎉 恭喜完成迁移！
