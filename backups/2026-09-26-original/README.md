# 原始主页备份 · 2026-09-26

`site.tar.gz` 是重新设计前的完整网站归档，包含首页、样式、项目页、所有图片和视频，以及已有的历史备份。不包含 `.git`、工具目录和本备份目录。

归档 SHA-256：`dd97be2ecc3f962c77cf97ac066b94eeed535e6d45453b154835d7ebd5ef7990`

本目录另有原始首页 `index.html`、原始样式 `stylesheet.css`、`CNAME` 和 `original-README.md`，便于直接比对和恢复。原首页 SHA-256：`cb9408473f0934d8c55aa77dfe86a58eeb0a9fd84b0e1f1dbc8256a8edebf470`；原样式 SHA-256：`f0a278fdaab687d23bd238a4eb8d4add779be03ae605b4bb71572194c5e9bd84`。

完整归档约 409 MB，仅保存在本地，并已通过 `.gitignore` 排除，避免重复提交大体积素材。请将归档额外保存到长期备份位置。轻量文件副本可以随代码提交。`_config.yml` 将整个备份目录排除在 GitHub Pages 发布之外。

## 预览或恢复

建议先解压到独立目录：

```sh
mkdir /tmp/hao-yu-original-preview
tar -xzf backups/2026-09-26-original/site.tar.gz -C /tmp/hao-yu-original-preview
python3 -m http.server 8001 --directory /tmp/hao-yu-original-preview
```

浏览器打开 `http://localhost:8001`。完整解压后的相对路径与旧版一致。

只回退首页时，将本目录的 `index.html` 和 `stylesheet.css` 复制回仓库根目录即可。新版没有改动原有项目页或原始素材。
