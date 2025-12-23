# InfiniDepth Project Page - 模块化结构说明

## 📁 目录结构

```
haoyu.github.io/
├── infinidepth.html                    # 主 HTML 文件
├── css/
│   └── infinidepth/
│       ├── main.css                    # 主样式（布局、卡片、按钮等）
│       ├── title-animations.css        # 标题渐变动画
│       └── magnifier.css               # 交互式放大镜样式
├── js/
│   └── infinidepth/
│       ├── config.js                   # 配置文件（图片路径、缩放参数等）
│       └── magnifier.js                # 放大镜交互逻辑
└── images/
    └── pub/
        └── infinidepth/
            ├── rgb.pdf                 # RGB 输入图像
            ├── MoGe-2_0250.png         # 深度图 1
            └── NeuralDepth_0250_up_4.png  # 深度图 2
```

---

## 📝 文件说明

### 1. **CSS 模块**

#### `css/infinidepth/main.css`
- 页面基础样式
- Jumbotron（标题区域）
- 按钮和交互效果
- Section 卡片样式
- 响应式布局

#### `css/infinidepth/title-animations.css`
- 标题文字的渐变动画
- 4 种不同颜色的渐变效果
- `@keyframes` 动画定义

#### `css/infinidepth/magnifier.css`
- 交互式对比容器
- 放大镜镜头样式
- 2×2 深度图网格布局
- Zoom 信息提示

---

### 2. **JavaScript 模块**

#### `js/infinidepth/config.js`
配置文件，包含所有可自定义的参数：

```javascript
const InfiniDepthConfig = {
    depthImages: [...],      // 深度图路径
    methodLabels: [...],     // 方法标签
    initialPatchSize: 256,   // 初始 patch 大小
    minPatchSize: 64,        // 最小 patch 大小
    maxPatchSize: 512,       // 最大 patch 大小
    zoomStep: 0.1,           // 缩放步长
    // ... 更多配置
};
```

#### `js/infinidepth/magnifier.js`
核心交互逻辑类 `DepthMagnifier`：

- `loadDepthImages()` - 加载所有深度图
- `drawFullDepth()` - 绘制完整深度图
- `drawPatchDepth()` - 绘制局部 patch
- `updateLensPosition()` - 更新放大镜位置
- `handleWheel()` - 处理滚轮缩放
- `initEvents()` - 初始化所有事件监听

---

## 🎨 修改样式

### 修改颜色主题

**1. 修改放大镜颜色**
编辑 `css/infinidepth/magnifier.css`:
```css
.magnifier-lens {
    border: 3px solid #6b9ac4;  /* 改为你喜欢的颜色 */
}
```

**2. 修改标题渐变**
编辑 `css/infinidepth/title-animations.css`:
```css
.title-main { 
    background: linear-gradient(120deg, #你的颜色1, #你的颜色2, ...);
}
```

**3. 修改按钮样式**
编辑 `css/infinidepth/main.css`:
```css
.btn-large:hover {
    background: linear-gradient(135deg, #你的颜色1, #你的颜色2);
}
```

---

## ⚙️ 修改配置

### 更换深度图和方法

编辑 `js/infinidepth/config.js`:

```javascript
const InfiniDepthConfig = {
    depthImages: [
        'images/pub/infinidepth/depth_anything_v2.png',
        'images/pub/infinidepth/moge.png',
        'images/pub/infinidepth/infinidepth_ours.png',
        'images/pub/infinidepth/marigold.png'
    ],
    
    methodLabels: [
        'Depth Anything v2',
        'MoGe',
        'InfiniDepth (Ours)',
        'Marigold'
    ],
};
```

### 调整缩放参数

```javascript
const InfiniDepthConfig = {
    initialPatchSize: 128,  // 初始 patch 更小，显示更多细节
    minPatchSize: 32,       // 允许更大的放大倍数
    maxPatchSize: 1024,     // 允许更大的视野
    zoomStep: 0.15,         // 更快的缩放速度
};
```

---

## 🔧 添加新功能

### 1. 添加新的 CSS 模块

```bash
# 创建新的 CSS 文件
touch css/infinidepth/custom.css
```

在 `infinidepth.html` 中引入：
```html
<link href="css/infinidepth/custom.css" rel="stylesheet">
```

### 2. 添加新的 JS 模块

```bash
# 创建新的 JavaScript 文件
touch js/infinidepth/analytics.js
```

在 `infinidepth.html` 中引入（注意顺序）：
```html
<script src="js/infinidepth/config.js"></script>
<script src="js/infinidepth/magnifier.js"></script>
<script src="js/infinidepth/analytics.js"></script>
```

---

## 🚀 部署

### 本地测试

```bash
# 在项目根目录启动一个简单的 HTTP 服务器
python3 -m http.server 8000

# 或使用 Node.js
npx http-server
```

访问: `http://localhost:8000/infinidepth.html`

### 部署到 GitHub Pages

```bash
git add css/ js/ infinidepth.html
git commit -m "Modularize InfiniDepth project page"
git push origin main
```

访问: `https://yourusername.github.io/infinidepth.html`

---

## 📊 模块化的优势

### ✅ **代码组织**
- CSS、JS、HTML 分离，结构清晰
- 每个文件职责单一，易于理解

### ✅ **易于维护**
- 修改样式：只需编辑对应的 CSS 文件
- 修改配置：只需编辑 `config.js`
- 修改逻辑：只需编辑 `magnifier.js`

### ✅ **代码复用**
- CSS 和 JS 模块可以在其他项目中复用
- 配置文件可以轻松切换不同的数据集

### ✅ **性能优化**
- 浏览器可以缓存独立的 CSS 和 JS 文件
- 只修改部分文件时，其他文件使用缓存

### ✅ **协作友好**
- 多人协作时减少冲突
- 前端开发者可以专注于样式，后端专注于逻辑

---

## 🐛 故障排除

### 问题 1: CSS 样式不生效

**检查：**
1. 确认 CSS 文件路径正确
2. 清除浏览器缓存（Ctrl+Shift+R）
3. 查看浏览器控制台是否有 404 错误

### 问题 2: JavaScript 功能不工作

**检查：**
1. 确认 JS 文件加载顺序（config.js 必须在 magnifier.js 之前）
2. 打开浏览器控制台查看错误信息
3. 确认 `InfiniDepthConfig` 对象存在

### 问题 3: 图片不显示

**检查：**
1. 确认图片路径在 `config.js` 中正确配置
2. 确认图片文件存在于指定位置
3. 检查图片文件权限

---

## 📚 扩展阅读

- [CSS 模块化最佳实践](https://css-tricks.com/css-modules-part-1-need/)
- [JavaScript 模块化编程](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)
- [前端项目结构设计](https://www.robinwieruch.de/react-folder-structure/)

---

## 💡 未来改进

1. **使用 SCSS/SASS**：更强大的 CSS 预处理器
2. **使用 ES6 模块**：`import/export` 语法
3. **使用构建工具**：Webpack、Vite 等
4. **添加单元测试**：Jest、Mocha 等
5. **TypeScript 重写**：增强类型安全

---

## 📧 联系方式

如有问题或建议，请联系：
- GitHub: [@RitianYu](https://github.com/RitianYu)
- Email: your.email@example.com

---

**最后更新**: 2025-12-23
