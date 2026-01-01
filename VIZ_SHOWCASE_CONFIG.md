# Visualization Showcase Configuration Guide

## 概述

可视化橱窗功能允许用户通过点击缩略图切换不同的场景，支持三种可视化模式：
1. **Interactive Depth** - 交互式深度图对比
2. **Point Cloud** - 3D 点云可视化
3. **Novel View Synthesis (NVS)** - 新视角合成

## 配置文件

所有场景配置都在 `js/infinidepth/viz-showcase.js` 文件中的 `VizShowcaseConfig` 对象中定义。

## 配置各个模式的场景

### 1. Interactive Depth（交互式深度图）

```javascript
depth: {
    scenes: [
        {
            name: 'Scene 1',           // 场景名称
            rgb: 'path/to/rgb.png',    // RGB 图像路径
            depth: 'path/to/depth.png', // 深度图路径
            thumbnail: 'path/to/thumb.jpg' // 缩略图路径
        },
        // 添加更多场景...
    ]
}
```

**示例**：
```javascript
{
    name: 'Indoor Scene',
    rgb: 'images/pub/infinidepth/DSC_6487.png',
    depth: 'images/pub/infinidepth/MoGe-2_0250.png',
    thumbnail: 'images/pub/infinidepth/depth/rgb1.jpg'
}
```

### 2. Point Cloud（点云可视化）

```javascript
pointcloud: {
    scenes: [
        {
            name: 'ETH Scene',           // 场景名称
            plyFile: 'eth_1.ply',        // PLY 文件名（不含路径）
            thumbnail: 'path/to/thumb.jpg' // 缩略图路径
        },
        // 添加更多场景...
    ]
}
```

**注意**：
- PLY 文件应放在 `images/pub/infinidepth/pointclouds/` 目录下
- 只需要提供文件名，不需要完整路径

**示例**：
```javascript
{
    name: 'Street Scene',
    plyFile: 'street_scene.ply',
    thumbnail: 'images/pub/infinidepth/vis_pcd/rgb1.jpg'
}
```

### 3. Novel View Synthesis（新视角合成）

```javascript
nvs: {
    scenes: [
        {
            name: 'NVS Scene 1',       // 场景名称
            video: 'path/to/video.mp4', // 视频文件路径
            thumbnail: 'path/to/thumb.jpg' // 缩略图路径
        },
        // 添加更多场景...
    ]
}
```

**示例**：
```javascript
{
    name: 'Building Rotation',
    video: 'images/pub/infinidepth/nvs_building.mp4',
    thumbnail: 'images/pub/infinidepth/vis_pcd/rgb1.jpg'
}
```

## 添加新场景的步骤

### 步骤 1: 准备资源文件

1. **Interactive Depth 模式**：
   - RGB 图像（建议分辨率：1920x1080 或更高）
   - 对应的深度图（与 RGB 相同分辨率）
   - 缩略图（建议尺寸：110x82px）

2. **Point Cloud 模式**：
   - PLY 格式的点云文件
   - 缩略图（建议尺寸：110x82px）

3. **NVS 模式**：
   - MP4 格式的视频文件
   - 缩略图（建议尺寸：110x82px）

### 步骤 2: 上传文件到服务器

```
images/pub/infinidepth/
├── your_rgb_image.png          # RGB 图像
├── your_depth_image.png        # 深度图
├── nvs_video.mp4               # NVS 视频
├── depth/
│   └── your_thumbnail.jpg      # Depth 缩略图
├── vis_pcd/
│   └── your_thumbnail.jpg      # Point Cloud/NVS 缩略图
└── pointclouds/
    └── your_pointcloud.ply     # 点云文件
```

### 步骤 3: 编辑配置文件

打开 `js/infinidepth/viz-showcase.js`，在相应的 scenes 数组中添加新场景配置。

**示例 - 添加新的深度图场景**：

```javascript
const VizShowcaseConfig = {
    depth: {
        scenes: [
            // 现有场景...
            {
                name: 'My New Scene',
                rgb: 'images/pub/infinidepth/my_new_rgb.png',
                depth: 'images/pub/infinidepth/my_new_depth.png',
                thumbnail: 'images/pub/infinidepth/depth/my_new_thumb.jpg'
            }
        ]
    },
    // ...
};
```

## 技术细节

### 场景切换机制

1. **Depth 模式**：
   - 点击缩略图触发 `switchDepthScene()`
   - 更新 RGB 图像
   - 通知 magnifier.js 重新加载深度图

2. **Point Cloud 模式**：
   - 点击缩略图触发 `switchPointCloudScene()`
   - 发送自定义事件 `loadPointCloud`
   - pointcloud-viewer.js 监听事件并加载新 PLY 文件

3. **NVS 模式**：
   - 点击缩略图触发 `switchNVSScene()`
   - 直接更新 video 元素的 source 并重新加载

### 事件系统

Point Cloud 使用自定义事件进行通信：

```javascript
// 发送事件
const event = new CustomEvent('loadPointCloud', {
    detail: { plyFile: 'scene.ply' }
});
window.dispatchEvent(event);

// 监听事件
window.addEventListener('loadPointCloud', (event) => {
    loadPLY(event.detail.plyFile);
});
```

## 缩略图建议

### 尺寸和格式
- **尺寸**：110×82 像素（宽×高）
- **格式**：JPG（优化压缩）
- **质量**：70-80%（平衡质量和文件大小）

### 内容建议
- 使用场景的代表性视图
- 确保图像清晰可辨认
- 对于 depth 模式，使用 RGB 图像作为缩略图
- 对于 point cloud 和 NVS，使用场景的预览图

## 调试

### 检查配置是否加载
在浏览器控制台中运行：
```javascript
console.log(window.VizShowcaseConfig);
```

### 检查场景切换
在浏览器控制台中查看：
```javascript
console.log(window.vizShowcaseManager.currentScenes);
```

### 常见问题

1. **缩略图不显示**：
   - 检查图片路径是否正确
   - 确认文件已上传到服务器
   - 检查浏览器控制台是否有 404 错误

2. **深度图不更新**：
   - 确保 magnifier.js 已正确加载
   - 检查深度图路径是否正确

3. **点云不加载**：
   - 确认 PLY 文件在 `pointclouds/` 目录下
   - 检查文件名是否正确（区分大小写）
   - 查看控制台是否有加载错误

4. **视频不播放**：
   - 确认视频格式为 MP4
   - 检查视频编码是否兼容浏览器
   - 确保视频文件不太大（建议 < 50MB）

## 性能优化建议

1. **图像优化**：
   - 压缩 PNG 图像（使用 TinyPNG 等工具）
   - 对于大型深度图，考虑使用渐进式 JPEG

2. **点云优化**：
   - 降低点云密度（如果太大）
   - 使用 CloudCompare 等工具优化 PLY 文件

3. **视频优化**：
   - 使用 H.264 编码
   - 降低码率（保持质量）
   - 考虑使用多个分辨率版本

## 扩展功能

### 添加场景描述

可以在配置中添加 `description` 字段：

```javascript
{
    name: 'Indoor Scene',
    description: 'A detailed indoor environment with rich textures',
    rgb: '...',
    depth: '...',
    thumbnail: '...'
}
```

然后在 UI 中显示描述（需要修改 HTML）。

### 添加预加载

为了提升用户体验，可以预加载下一个场景的资源：

```javascript
function preloadNextScene(currentIndex, scenes) {
    const nextIndex = (currentIndex + 1) % scenes.length;
    const nextScene = scenes[nextIndex];

    const img = new Image();
    img.src = nextScene.rgb;
}
```

## 文件结构总结

```
├── infinidepth.html              # 主页面，包含橱窗容器
├── js/infinidepth/
│   ├── viz-showcase.js           # 橱窗管理器（配置和逻辑）
│   ├── pointcloud-viewer.js      # 点云查看器（监听切换事件）
│   └── ...
└── images/pub/infinidepth/
    ├── *.png                     # RGB 和深度图
    ├── *.mp4                     # NVS 视频
    ├── depth/*.jpg               # Depth 缩略图
    ├── vis_pcd/*.jpg             # Point Cloud/NVS 缩略图
    └── pointclouds/*.ply         # 点云文件
```
