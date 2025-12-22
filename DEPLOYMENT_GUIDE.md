# 个人主页修改和部署指南

## 📋 需要修改的内容清单

### 1. ✅ 已完成的修改
- [x] `CNAME` - 已修改为 `ritianyu.github.io`
- [x] `README.md` - 已更新说明
- [x] 创建了简化模板 `index_template.html`

### 2. 🔄 需要你手动完成的修改

#### A. 替换 index.html
我已经创建了一个简化的模板 `index_template.html`，你可以：
```bash
# 备份原文件
mv index.html index_original.html

# 使用新模板
mv index_template.html index.html
```

或者直接编辑 `index_template.html`，完成后重命名。

#### B. 修改个人信息
在 `index.html` 中替换以下内容：
- [ ] 页面标题：`<title>你的名字</title>`
- [ ] 姓名：找到所有 "你的名字" 并替换
- [ ] 个人简介：修改自我介绍段落
- [ ] 邮箱地址：`your-email@example.com`
- [ ] Google Scholar 链接
- [ ] Twitter/X 链接
- [ ] GitHub 链接
- [ ] 简历链接路径

#### C. 替换图片和文件
1. **个人照片**
   ```bash
   # 将你的照片放到 images 目录
   cp /path/to/your/photo.jpg images/your-photo.jpg
   ```
   
2. **简历文件**
   ```bash
   # 将你的简历放到 data 目录
   cp /path/to/your/CV.pdf data/YourName-CV.pdf
   ```

3. **项目图片**
   - 将项目相关图片放到 `images/` 目录
   - 在 HTML 中更新对应的图片路径

#### D. 清理不需要的文件（可选）
你可以删除原作者的数据文件：
```bash
# 删除原作者的论文数据
rm -rf data/*.bib
rm -rf data/*Barron*
rm -rf data/*CVPR* data/*ICCV* data/*ECCV*

# 清理原作者的项目图片（保留一些作为参考）
# 谨慎操作，建议先查看 images/ 目录内容
```

### 3. 🚀 部署到 GitHub Pages

#### 前置条件
确保你的仓库名称是 `ritianyu.github.io`（必须是 `用户名.github.io` 格式）

#### 部署步骤
```bash
# 1. 初始化 git（如果还没有）
git init

# 2. 添加所有修改的文件
git add .

# 3. 提交更改
git commit -m "Update personal homepage"

# 4. 添加远程仓库（如果还没有）
git remote add origin https://github.com/ritianyu/ritianyu.github.io.git

# 或使用 SSH
git remote add origin git@github.com:ritianyu/ritianyu.github.io.git

# 5. 推送到 GitHub
git push -u origin main

# 注意：如果分支名是 master，使用：
# git push -u origin master
```

#### 启用 GitHub Pages
1. 访问 GitHub 仓库页面
2. 进入 **Settings** → **Pages**
3. 在 **Source** 下选择：
   - Branch: `main` (或 `master`)
   - Folder: `/ (root)`
4. 点击 **Save**

#### 等待部署
- 部署通常需要 1-5 分钟
- 可以在 Actions 标签页查看部署状态
- 部署成功后访问：`https://ritianyu.github.io`

### 4. 📝 关于 CNAME 文件

**重要说明：**
- 如果使用默认域名 `ritianyu.github.io`，可以删除 `CNAME` 文件
- 如果有自定义域名（如 `yourname.com`），保留 `CNAME` 并填写你的域名

```bash
# 如果只用默认域名，删除 CNAME
rm CNAME

# 如果有自定义域名，编辑 CNAME
echo "yourname.com" > CNAME
```

### 5. 🎨 自定义样式（可选）
- `stylesheet.css` 文件控制页面样式
- 你可以修改颜色、字体、布局等

### 6. ✅ 检查清单
部署前请确认：
- [ ] 所有个人信息已更新
- [ ] 个人照片已替换
- [ ] 邮箱、社交媒体链接正确
- [ ] 简历文件路径正确
- [ ] 删除或替换了示例内容
- [ ] Git 提交并推送到 GitHub
- [ ] GitHub Pages 已启用

### 7. 🐛 常见问题

**Q: 页面显示 404？**
A: 检查仓库名是否为 `用户名.github.io`，且 GitHub Pages 已启用

**Q: 样式丢失？**
A: 确保 `stylesheet.css` 在根目录，路径正确

**Q: 图片不显示？**
A: 检查图片路径和文件名大小写

**Q: 需要多久生效？**
A: 首次部署 1-10 分钟，后续更新通常 1-2 分钟

### 8. 📚 参考资源
- [GitHub Pages 官方文档](https://docs.github.com/en/pages)
- [原始模板仓库](https://github.com/jonbarron/jonbarron_website)

---

## 快速开始命令

```bash
# 一键备份原文件并使用新模板
mv index.html index_original.html && mv index_template.html index.html

# 编辑 index.html 后，提交并推送
git add .
git commit -m "Initialize personal homepage"
git push origin main
```

祝你部署成功！🎉
