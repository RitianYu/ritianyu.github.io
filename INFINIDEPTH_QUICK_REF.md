# InfiniDepth 快速配置指南

## 🎯 常见任务

### 1️⃣ 更换深度图

编辑 `js/infinidepth/config.js`:

```javascript
const InfiniDepthConfig = {
    depthImages: [
        'images/pub/infinidepth/你的图片1.png',  // 左上
        'images/pub/infinidepth/你的图片2.png',  // 右上
        'images/pub/infinidepth/你的图片3.png',  // 左下 (Your method)
        'images/pub/infinidepth/你的图片4.png'   // 右下
    ],
    
    methodLabels: [
        '方法1',
        '方法2',
        'InfiniDepth (Ours)',
        '方法4'
    ]
};
```

### 2️⃣ 修改放大镜颜色

编辑 `css/infinidepth/magnifier.css`:

```css
.magnifier-lens {
    border: 3px solid #你的颜色;
    background: rgba(R, G, B, 0.15);
}
```

### 3️⃣ 调整缩放参数

编辑 `js/infinidepth/config.js`:

```javascript
initialPatchSize: 256,  // 初始 patch 大小
minPatchSize: 64,       // 最小 (放大最多)
maxPatchSize: 512,      // 最大 (缩小最多)
zoomStep: 0.1          // 缩放速度
```

### 4️⃣ 修改标题渐变颜色

编辑 `css/infinidepth/title-animations.css`:

```css
.title-main { 
    background: linear-gradient(120deg, #颜色1, #颜色2, #颜色3);
}
```

### 5️⃣ 修改按钮样式

编辑 `css/infinidepth/main.css`:

```css
.btn-large {
    border-radius: 30px;  /* 圆角 */
    padding: 12px 32px;   /* 内边距 */
}

.btn-large:hover {
    background: linear-gradient(135deg, #颜色1, #颜色2);
}
```

---

## 📂 文件位置速查

| 任务 | 文件 |
|------|------|
| 修改图片路径 | `js/infinidepth/config.js` |
| 修改方法标签 | `js/infinidepth/config.js` |
| 修改缩放参数 | `js/infinidepth/config.js` |
| 修改放大镜样式 | `css/infinidepth/magnifier.css` |
| 修改标题动画 | `css/infinidepth/title-animations.css` |
| 修改按钮/卡片 | `css/infinidepth/main.css` |
| 修改交互逻辑 | `js/infinidepth/magnifier.js` |

---

## 🔥 最常用的 3 个文件

1. **`js/infinidepth/config.js`** - 修改图片、标签、参数
2. **`css/infinidepth/magnifier.css`** - 修改放大镜样式
3. **`css/infinidepth/main.css`** - 修改页面整体样式

---

## ✅ 修改后的检查清单

- [ ] 清除浏览器缓存 (Ctrl+Shift+R)
- [ ] 检查浏览器控制台无错误 (F12)
- [ ] 测试鼠标悬停功能
- [ ] 测试滚轮缩放功能
- [ ] 检查移动端响应式效果

---

## 🚀 部署命令

```bash
git add css/ js/ infinidepth.html
git commit -m "Update InfiniDepth configuration"
git push origin main
```

等待 1-2 分钟后访问 GitHub Pages 查看效果。
