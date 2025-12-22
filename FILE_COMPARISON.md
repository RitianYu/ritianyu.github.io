# index.html vs index_template.html 对比说明

## 📊 核心区别

### `index.html` (4517 行)
- ✅ **当前网站使用的主文件**
- 📄 包含 Jon Barron 的**所有原始内容**
- 🔬 包含约 **100+ 篇研究论文**的详细列表
- 🎨 包含大量交互动画、视频、图片
- 🗂️ 结构完整但内容需要全部替换

**适合：**
- 如果你想保留原始论文列表作为参考
- 需要查看完整的页面结构和样式示例
- 想要一个一个地删除/替换项目

### `index_template.html` (130 行)
- ✨ **我为你创建的干净模板**
- 🧹 已**清空所有论文和项目**内容
- 📝 只保留基本页面结构和示例格式
- 🚀 可以直接开始添加你自己的内容
- 💡 包含中文注释和占位符

**适合：**
- 快速开始创建自己的主页
- 不需要参考原作者的大量论文
- 想要一个简洁的起点

## 🔍 详细对比

| 特性 | index.html | index_template.html |
|------|-----------|-------------------|
| **文件大小** | 4517 行 | 130 行 |
| **论文项目数量** | ~100+ 篇 | 1 个示例 |
| **个人信息** | Jon Barron | 占位符（待填写） |
| **研究方向** | 计算机视觉、NeRF等 | 待填写 |
| **Education 部分** | ❌ 无 | ✅ 有 |
| **中文注释** | ❌ 无 | ✅ 有 |
| **是否启用** | ✅ 当前使用 | ❌ 备用模板 |

## 📋 内容示例对比

### index.html 的内容
```html
<!-- 包含原作者 Jon Barron 的所有论文，例如： -->
<tr>
  <td>
    <img src='images/radmesh_after.jpg'>
  </td>
  <td>
    <span class="papertitle">Radiance Meshes for Volumetric Reconstruction</span>
    <br>
    Alexander Mai, Trevor Hedstrom, George Kopanas, ...
    <em>arXiv</em>, 2025
  </td>
</tr>

<!-- 然后是第2篇、第3篇...一直到第100+篇 -->
```

### index_template.html 的内容
```html
<!-- 只有一个示例项目，带中文注释： -->
<tr>
  <td>
    <img src='images/project1.jpg' width=100%>
  </td>
  <td>
    <a href="https://your-project-page.com">
      <span class="papertitle">你的论文标题</span>
    </a>
    <br>
    <strong>你的名字</strong>, 合作者1, 合作者2
    <br>
    <em>会议/期刊名称</em>, 2025
    <p>论文简介：在这里简要描述你的论文内容和贡献。</p>
  </td>
</tr>

<!-- 添加更多论文项目... -->
```

## 🎯 使用建议

### 推荐做法：使用 index_template.html

```bash
# 1. 备份原文件（保留参考）
mv index.html index_original.html

# 2. 使用简洁模板
mv index_template.html index.html

# 3. 编辑 index.html，填入你的信息
# - 替换姓名、邮箱、链接
# - 添加你的照片
# - 添加你的研究项目
```

### 为什么推荐用模板？

✅ **更快上手**
- 不需要删除 100+ 个论文项目
- 直接添加自己的内容即可

✅ **更清晰**
- 没有混乱的旧内容
- 知道每个部分该填什么

✅ **有中文指引**
- 占位符都是中文
- 容易理解要填什么

## ⚠️ 当前状态

目前你的网站使用的是 **index.html**（包含所有原始内容）。

如果你访问 https://ritianyu.github.io（重命名仓库后），会看到：
- 标题显示"你的名字"（已修改的部分）
- 下面还有 Jon Barron 的所有论文（未修改的部分）

## 🚀 快速切换到模板

执行以下命令即可切换：

```bash
cd /nas2/home/yuhao/code/haoyu.github.io

# 备份原文件
mv index.html index_original.html

# 启用模板
mv index_template.html index.html

# 提交更改
git add .
git commit -m "Switch to clean template"
git push origin master
```

切换后，网站将显示简洁的模板页面，你可以开始填入自己的信息。

## 💡 总结

- **index.html** = 完整版（4500+ 行，包含所有原始论文）
- **index_template.html** = 简洁版（130 行，只有基本结构）

建议：**使用 index_template.html 作为起点** 🎉
