# InfiniDepth Project Page 创建指南

## ✅ 已完成的工作

1. **创建了 infinidepth.html** - 完整的项目页面模板
2. **内置响应式 CSS** - 优雅的现代设计
3. **标准学术页面结构** - 包含所有必需部分

## 📋 接下来需要做的工作

### 1. 准备图片和资源文件

#### 推荐的文件结构：
```
paper/InfiniDepth/
├── teaser.png          # 主要展示图（必需）
├── architecture.png    # 方法架构图
├── results_1.png      # 结果图1
├── results_2.png      # 结果图2
├── paper.pdf          # 论文PDF
├── supplementary.pdf  # 补充材料
└── video/
    └── demo.mp4       # 演示视频（可选）
```

#### 需要的图片：
- **Teaser图**: 1200x600 px 左右，展示方法的主要效果
- **架构图**: 展示方法的技术框架
- **结果图**: 多张结果对比图
- **其他**: Logo、Icon等

### 2. 修改 infinidepth.html 的内容

打开 `infinidepth.html` 并修改以下部分：

#### A. 标题和作者信息（第244-257行）
```html
<h1 class="project-title">你的论文标题</h1>

<div class="project-authors">
    <a href="你的主页">你的名字</a><sup>1</sup>,
    <a href="合作者主页">合作者名字</a><sup>2</sup>,
    ...
</div>

<div class="project-affiliation">
    <sup>1</sup>你的机构 &nbsp;&nbsp;
    <sup>2</sup>合作者机构
</div>

<div class="project-affiliation">
    📍 会议名称 CVPR 2025 / ICCV 2025 / ECCV 2024
</div>
```

#### B. 链接地址（第263-268行）
```html
<a href="paper.pdf" class="project-link paper">📄 Paper</a>
<a href="https://github.com/你的用户名/项目名" class="project-link code">💻 Code</a>
<a href="supplementary.pdf" class="project-link">📊 Supp</a>
<a href="https://youtube.com/..." class="project-link video">🎥 Video</a>
```

#### C. 图片路径（第273行和第308行）
```html
<!-- Teaser图 -->
<img src="paper/InfiniDepth/teaser.png" alt="项目名称 Teaser">

<!-- 架构图 -->
<img src="paper/InfiniDepth/architecture.png" alt="Method Overview">
```

#### D. Abstract内容（第285-296行）
替换为你的论文摘要

#### E. Method描述（第301-325行）
描述你的方法的关键组成部分

#### F. Results部分（第331-345行）
```html
<div class="result-item">
    <img src="paper/InfiniDepth/result1.png" alt="Result 1">
    <p class="result-caption">结果描述</p>
</div>
```

#### G. BibTeX引用（第353-359行）
```bibtex
@inproceedings{你的引用key,
  title={你的论文标题},
  author={作者列表},
  booktitle={会议全称},
  year={年份}
}
```

### 3. 在主页添加项目链接

在 `index.html` 的 Publications 部分添加：

```html
<tr>
  <td style="padding:20px;width:25%;vertical-align:middle">
    <div class="publication-teaser">
      <img src='paper/InfiniDepth/teaser.png' width="160">
    </div>
  </td>
  <td style="padding:20px;width:75%;vertical-align:middle">
    <a href="infinidepth.html">
      <span class="papertitle">InfiniDepth: 你的论文标题</span>
    </a>
    <br>
    <strong>Hao Yu</strong>, 合作者
    <br>
    <em>CVPR 2025</em>
    <br>
    <a href="infinidepth.html">🌐 Project Page</a> /
    <a href="paper.pdf">📄 Paper</a> /
    <a href="https://github.com/...">💻 Code</a>
  </td>
</tr>
```

### 4. 测试和预览

#### 本地测试：
```bash
cd /nas2/home/yuhao/code/haoyu.github.io
python3 -m http.server 8000
```

然后访问：`http://localhost:8000/infinidepth.html`

### 5. 部署到 GitHub Pages

```bash
cd /nas2/home/yuhao/code/haoyu.github.io

# 添加新文件
git add infinidepth.html
git add paper/InfiniDepth/*

# 提交
git commit -m "Add InfiniDepth project page"

# 推送
git push origin main
```

部署后访问：`https://ritianyu.github.io/infinidepth.html`

## 🎨 自定义样式

### 修改配色方案

在 `infinidepth.html` 的 `<style>` 部分修改：

```css
/* 链接按钮颜色 */
.project-link {
    background: linear-gradient(135deg, #你的颜色1 0%, #你的颜色2 100%);
}

/* Abstract框颜色 */
.abstract-box {
    border-left: 5px solid #你的强调色;
}
```

## 📝 可选增强功能

### 1. 添加交互式结果对比
可以使用 image-compare-viewer 等库

### 2. 嵌入 YouTube 视频
```html
<iframe width="800" height="450" 
    src="https://www.youtube.com/embed/你的视频ID" 
    frameborder="0" allowfullscreen>
</iframe>
```

### 3. 添加统计表格
```html
<table style="width:100%; border-collapse: collapse;">
  <tr style="border-bottom: 2px solid #ddd;">
    <th>Method</th>
    <th>PSNR↑</th>
    <th>SSIM↑</th>
  </tr>
  <tr>
    <td>Ours</td>
    <td><strong>32.5</strong></td>
    <td><strong>0.95</strong></td>
  </tr>
</table>
```

## 🔍 SEO 优化

在 `<head>` 部分添加：

```html
<meta name="description" content="InfiniDepth: 你的论文简短描述">
<meta name="keywords" content="depth estimation, computer vision, CVPR">
<meta property="og:title" content="InfiniDepth">
<meta property="og:image" content="https://ritianyu.github.io/paper/InfiniDepth/teaser.png">
```

## 📧 需要帮助？

如果遇到问题，请检查：
1. 图片路径是否正确
2. 链接是否有效
3. 浏览器控制台是否有错误
4. GitHub Pages 是否已启用

---

**下一步建议**：
1. 先准备好所有图片素材
2. 修改 infinidepth.html 中的文字内容
3. 本地测试确保一切正常
4. 推送到 GitHub 并验证
