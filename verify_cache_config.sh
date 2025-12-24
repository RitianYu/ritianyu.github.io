#!/bin/bash

# 验证缓存控制是否正确配置
# 检查 index.html 的缓存设置

echo "==================================="
echo "🔍 检查缓存控制配置"
echo "==================================="
echo ""

FILE="/nas2/home/yuhao/code/haoyu.github.io/index.html"

if [ ! -f "$FILE" ]; then
    echo "❌ 错误: 找不到 index.html 文件"
    exit 1
fi

echo "📄 文件: $FILE"
echo ""

# 检查 Cache-Control meta 标签
echo "1️⃣ 检查 Cache-Control meta 标签..."
if grep -q 'meta http-equiv="Cache-Control"' "$FILE"; then
    echo "✅ Cache-Control meta 标签存在"
    grep 'meta http-equiv="Cache-Control"' "$FILE" | sed 's/^/   /'
else
    echo "❌ 未找到 Cache-Control meta 标签"
fi
echo ""

# 检查 Pragma meta 标签
echo "2️⃣ 检查 Pragma meta 标签..."
if grep -q 'meta http-equiv="Pragma"' "$FILE"; then
    echo "✅ Pragma meta 标签存在"
    grep 'meta http-equiv="Pragma"' "$FILE" | sed 's/^/   /'
else
    echo "❌ 未找到 Pragma meta 标签"
fi
echo ""

# 检查 Expires meta 标签
echo "3️⃣ 检查 Expires meta 标签..."
if grep -q 'meta http-equiv="Expires"' "$FILE"; then
    echo "✅ Expires meta 标签存在"
    grep 'meta http-equiv="Expires"' "$FILE" | sed 's/^/   /'
else
    echo "❌ 未找到 Expires meta 标签"
fi
echo ""

# 检查 CSS 版本号
echo "4️⃣ 检查 CSS 版本号..."
if grep -q 'stylesheet.css?v=' "$FILE"; then
    echo "✅ CSS 版本号存在"
    VERSION=$(grep -o 'stylesheet.css?v=[0-9]*' "$FILE" | grep -o '[0-9]*')
    grep 'stylesheet.css?v=' "$FILE" | sed 's/^/   /'
    echo "   版本号: $VERSION"
else
    echo "❌ 未找到 CSS 版本号"
fi
echo ""

# 检查文件最后修改时间
echo "5️⃣ 文件最后修改时间..."
ls -lh "$FILE" | awk '{print "   " $6, $7, $8, $9}'
echo ""

# 检查文件 MD5
echo "6️⃣ 文件 MD5 校验和..."
if command -v md5sum &> /dev/null; then
    MD5=$(md5sum "$FILE" | awk '{print $1}')
    echo "   MD5: $MD5"
else
    echo "   (md5sum 命令不可用)"
fi
echo ""

echo "==================================="
echo "✨ 检查完成!"
echo "==================================="
echo ""
echo "📌 下一步操作:"
echo "   1. 在浏览器中按 Ctrl+Shift+R (硬刷新)"
echo "   2. 或打开无痕窗口访问网页"
echo "   3. 或使用开发者工具清空缓存"
echo ""
echo "📖 详细指南: FORCE_BROWSER_REFRESH.md"
echo ""
