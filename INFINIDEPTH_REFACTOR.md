# InfiniDepth Project - Refactored Structure

## 项目重构说明

本项目已经完成了全面重构，将所有内联的 CSS 和 JavaScript 代码提取到了独立的文件中，使 HTML 文件更加整洁和易于维护。

## 文件结构

### CSS 文件
```
css/infinidepth/
├── main.css              # 主样式文件（已存在）
├── title-animations.css  # 标题动画样式（已存在）
├── magnifier.css         # 放大镜交互样式（已存在）
├── layout.css            # 新增：布局和组件样式
└── visualization.css     # 新增：可视化组件样式
```

### JavaScript 文件
```
js/infinidepth/
├── config.js             # 配置文件（已存在）
├── magnifier.js          # 放大镜功能（已存在）
├── viz-switcher.js       # 新增：可视化模式切换
├── showcase.js           # 新增：图片展示功能
├── overview-video.js     # 新增：概览视频控制
└── pointcloud-viewer.js  # 新增：点云查看器（Three.js）
```

### HTML 文件
- `infinidepth.html` - 主页面，现已清理所有内联样式和脚本

## 新增文件说明

### 1. css/infinidepth/layout.css
包含页面布局相关的样式：
- Section 卡片样式
- Jumbotron（封面）样式
- 作者信息样式
- 响应式布局

### 2. css/infinidepth/visualization.css
包含所有可视化组件的样式：
- 可视化模式切换按钮
- Showcase 缩略图画廊
- PLY 点云文件切换按钮
- Overview 视频控制按钮

### 3. js/infinidepth/viz-switcher.js
处理可视化模式切换（Depth Map, Point Cloud, NVS）：
- 自动检测并初始化所有 `.viz-switch` 组件
- 处理按钮点击事件
- 同步更新内容和描述

### 4. js/infinidepth/showcase.js
处理图片展示功能：
- 缩略图点击切换主图
- 支持多个独立的 showcase 实例
- 包含 depth, pointcloud, nvs 三个展示区域的配置

### 5. js/infinidepth/overview-video.js
控制概览视频播放和进度按钮：
- 视频时间点跳转
- 自动高亮当前阶段按钮
- 用户点击优先级锁定机制

### 6. js/infinidepth/pointcloud-viewer.js
Three.js 点云查看器：
- 支持 PLY 格式点云文件加载
- 交互式旋转、缩放、平移（OrbitControls）
- 白色背景，无坐标网格
- 自动翻转 X/Y 轴以修正显示
- 多个场景切换

## 优势

1. **可维护性提升**
   - 代码分离，职责清晰
   - 更容易定位和修改特定功能

2. **复用性增强**
   - CSS 和 JS 文件可以在其他页面复用
   - 模块化设计便于扩展

3. **性能优化**
   - 浏览器可以缓存外部资源
   - 减少 HTML 文件大小

4. **团队协作**
   - 多人可以同时编辑不同文件
   - 减少合并冲突

## 使用说明

1. 确保所有文件路径正确
2. 通过本地服务器运行（如 `python -m http.server` 或 `npx serve`）
3. 点云文件应放在 `images/pub/infinidepth/pointclouds/` 目录下

## 点云查看器配置

要添加新的点云场景，编辑 `infinidepth.html` 中的按钮：

```html
<button class="ply-btn" data-ply="your_file.ply">Scene Name</button>
```

确保 PLY 文件位于：`images/pub/infinidepth/pointclouds/your_file.ply`

## 技术栈

- Three.js r160 - 3D 渲染
- Bootstrap 4.6 - UI 框架
- ES6 Modules - JavaScript 模块化
- CSS3 - 样式和动画
