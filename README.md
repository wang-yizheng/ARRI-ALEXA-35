# ARRI ALEXA 35 - Interactive 3D Teardown

🎬 ARRI ALEXA 35 摄影机的交互式 3D 结构拆解可视化页面

## ✨ 特性

- 9 大模块全部程序化建模（Three.js + Canvas 程序纹理）
- 不依赖任何外部 3D 模型/图片/字体/CDN
- 交互式爆炸视图，平滑动画过渡
- 点击模块查看详细技术参数
- 中英双语界面

## 🚀 快速部署到 GitHub Pages

### 1. 创建仓库并推送代码

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

### 2. 启用 GitHub Pages

- 进入仓库 **Settings** → **Pages**
- Source 选择 **GitHub Actions**
- 推送后自动部署

### 3. 访问网站

`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

📖 详细部署指南请查看 [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🛠️ 本地开发

```bash
npm install
npm run dev
```

## 📦 构建

```bash
npm run build
```

## 🎮 操作说明

- 🖱️ 左键拖拽 - 旋转
- 🖱️ 右键拖拽 - 平移
- 🖱️ 滚轮 - 缩放
- 🖱️ 点击模块 - 查看详情

## 📋 技术栈

- React 18 + TypeScript
- Three.js
- Vite
- Tailwind CSS

## 📄 License

MIT
