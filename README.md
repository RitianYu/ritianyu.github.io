# Hao Yu · Academic Homepage

个人学术主页，访问地址：<https://ritianyu.github.io/>。

2026 年 11 月改为单栏竖排版（约 920px 宽，参考 Jon Barron 等学者主页的结构），视觉上采用苹果式克制风格：白底 / 深色模式、SF Pro（非苹果设备回退到本地 Inter）、#0066cc 链接色、发丝分隔线、圆角视频、胶囊按钮和毛玻璃导航栏。9 月的编辑式版本备份在 `backups/2026-11-02-editorial/`。

## 本地预览

纯静态 HTML、CSS 和 JavaScript，无需 Node.js、安装依赖或构建：

```sh
python3 -m http.server 8000
```

浏览器打开 `http://localhost:8000`。也可以直接打开 `index.html` 查看主体内容。

## 内容维护

- `index.html`：简介、联系方式、论文、经历和奖项；内容直接写在 HTML 中，关闭 JavaScript 也能阅读。
- `stylesheet.css`：版式和响应式规则。顶部 `:root` 集中定义背景、文字、链接色和页面宽度，`prefers-color-scheme: dark` 块定义深色模式配色。
- `js/home.js`：导航定位、导航栏滚动分隔线、区块淡入、视频进入可见区域时播放、手动暂停、减少动态效果及省流量时关闭自动播放。
- `images/home/`：压缩后的人像、论文封面、H.264 预览和矢量图形。原有 `images/` 素材未改动。
- `fonts/`：本地托管的 Inter 字体及 SIL Open Font License；加载主页无需访问在线字体服务。

新增论文时复制一个 `.publication` 区块，更新标题、作者、会议、链接和视频资源。视频源使用标准 `src` 和 `preload="metadata"`；默认静音循环，进入可见区域时自动播放。关闭 JavaScript 后保留原生视频控制。封面仅用于视频加载前的占位，不替代视频展示。

Google Scholar 原先是 `YOUR_ID` 占位地址，因此没有显示无效按钮。填写真实个人链接后，可在 `.profile-links` 的注释位置补回。

三个工作均使用原站视频：InfiniSplat 为 `images/pub/infinisplat/demo.mp4`，InfiniDepth 为 `images/pub/infinidepth/demo_in_projectpage.mov`。MatchAnything 在仓库中没有本地视频文件，沿用原首页的 `https://zju3dv.github.io/MatchAnything/img/teaser_v0.mov`，其播放依赖项目站可访问性。本次未能从当前网络下载此远程视频。原先绘制的概念图不再被首页使用。

简介、成果、作者顺序、会议年份和 star 数沿用原站资料；本次是设计重构，未重新核验学术状态和动态计数。简介改为不含年级的 “master’s student”，避免自动过期。保留原有 Statcounter 账号。

## 部署与备份

保持 GitHub Pages 静态部署方式，`CNAME` 不变。`_config.yml` 排除备份和开发文档。独立的项目页面 `infinidepth.html`、`matchanything.html` 等未改动。

原站完整归档、原始首页和样式位于 `backups/2026-09-26-original/`，详见目录内说明。约 409 MB 的完整归档已被 Git 忽略，需要单独保管；轻量源码备份可以提交。

此仓库仍包含从原模板继承的 `data/` 文件与旧资源；新版首页不引用它们。为方便历史回溯，这次未清理这些文件。

新版桌面、手机截图及验证记录位于 `backups/2026-09-26-preview/`。已使用 Chromium 检查 9 种屏幕宽度、导航、视频控制、无 JavaScript 情况和自动无障碍检查。
