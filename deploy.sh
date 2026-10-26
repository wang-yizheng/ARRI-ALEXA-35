#!/bin/bash

# ARRI ALEXA 35 - GitHub Pages 快速部署脚本
# 使用方法: bash deploy.sh YOUR_REPO_NAME

REPO_NAME=${1:-"arri-alexa35-teardown"}
USERNAME=$(git config user.name)

echo "🎬 ARRI ALEXA 35 - GitHub Pages 部署脚本"
echo "=========================================="
echo ""

# 检查 git 是否已配置
if ! git rev-parse --is-inside-work-tree > /dev/null 2>&1; then
    echo "❌ 错误: 当前目录不是 git 仓库"
    echo "请先运行: git init"
    exit 1
fi

# 检查是否已安装依赖
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建是否成功
if [ ! -d "dist" ]; then
    echo "❌ 构建失败"
    exit 1
fi

echo ""
echo "✅ 构建成功！"
echo ""
echo "📋 接下来的步骤："
echo ""
echo "1️⃣  在 GitHub 上创建仓库: $REPO_NAME"
echo "   https://github.com/new"
echo ""
echo "2️⃣  推送代码到 GitHub:"
echo "   git add ."
echo "   git commit -m 'Initial commit: ARRI ALEXA 35 Interactive 3D Teardown'"
echo "   git branch -M main"
echo "   git remote add origin https://github.com/$USERNAME/$REPO_NAME.git"
echo "   git push -u origin main"
echo ""
echo "3️⃣  启用 GitHub Pages:"
echo "   - 进入仓库 Settings → Pages"
echo "   - Source 选择 'GitHub Actions'"
echo ""
echo "4️⃣  等待部署完成后访问:"
echo "   🌐 https://$USERNAME.github.io/$REPO_NAME/"
echo ""
echo "💡 提示: 如果部署到项目页面（非用户主页），请确保 vite.config.js 中设置了正确的 base 路径"
echo "   base: '/$REPO_NAME/'"
echo ""
echo "📖 详细配置说明请查看: GITHUB_PAGES_CONFIG.md"
echo ""
