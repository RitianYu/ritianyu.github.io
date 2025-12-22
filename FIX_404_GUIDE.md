# 🔧 修复 404 错误指南

## 问题原因
你的 GitHub 用户名是 `ritianyu`，但仓库名是 `haoyu.github.io`，这导致无法访问。

**GitHub Pages 规则：仓库名必须是 `用户名.github.io`**

## ✅ 解决方案

### 步骤 1：在 GitHub 上重命名仓库

1. 访问你的仓库：`https://github.com/ritianyu/haoyu.github.io`
2. 点击 **Settings**（设置）
3. 在 **Repository name** 处，将 `haoyu.github.io` 改为 `ritianyu.github.io`
4. 点击 **Rename**（重命名）

### 步骤 2：更新本地仓库的远程地址

```bash
cd /nas2/home/yuhao/code/haoyu.github.io

# 查看当前远程地址
git remote -v

# 更新远程地址为新的仓库名
git remote set-url origin https://github.com/ritianyu/ritianyu.github.io.git

# 或者如果使用 SSH：
git remote set-url origin git@github.com:ritianyu/ritianyu.github.io.git

# 验证修改
git remote -v
```

### 步骤 3：推送更改

```bash
# 提交之前的所有修改
git add .
git commit -m "Update configuration for correct GitHub username"

# 推送到 GitHub
git push origin main
```

### 步骤 4：检查 GitHub Pages 设置

1. 访问 `https://github.com/ritianyu/ritianyu.github.io`
2. 进入 **Settings** → **Pages**
3. 确认设置：
   - Source: Deploy from a branch
   - Branch: `main` (或 `master`)
   - Folder: `/ (root)`
4. 点击 **Save**

### 步骤 5：等待部署

- 等待 1-5 分钟
- 访问 **https://ritianyu.github.io**
- 检查网站是否正常显示

## 📝 关于 CNAME 文件

我已经将 `CNAME` 文件内容更新为 `ritianyu.github.io`。

**如果你只使用默认域名（ritianyu.github.io）：**
```bash
# 可以删除 CNAME 文件
rm CNAME
```

**如果你有自定义域名（如 yourname.com）：**
```bash
# 保留 CNAME 文件，并填写你的域名
echo "yourname.com" > CNAME
```

## ⚠️ 常见问题

**Q: 重命名仓库后还是 404？**
A: 等待 5-10 分钟，GitHub Pages 需要时间重新部署

**Q: 本地文件夹需要重命名吗？**
A: 可选，但建议重命名以保持一致：
```bash
cd /nas2/home/yuhao/code
mv haoyu.github.io ritianyu.github.io
```

**Q: 如何查看部署状态？**
A: 访问 `https://github.com/ritianyu/ritianyu.github.io/actions`

## ✨ 完成后

你的个人主页将在这里可访问：
**https://ritianyu.github.io**

---

如有问题，请参考 `DEPLOYMENT_GUIDE.md` 获取更多帮助。
