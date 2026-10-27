# ARRI ALEXA 35 Interactive 3D Teardown

ARRI ALEXA 35 摄影机的交互式 3D 结构拆解可视化页面。整机 9 大模块全部由代码程序化建模（Three.js 几何体 + Canvas 程序纹理），不依赖任何外部 3D 模型文件/图片/字体/CDN。

## 🎬 功能特性

- **9 大模块程序化建模**：机身外壳、传感器模块、镜头卡口、散热系统、处理电路板、取景器、存储模块、电源模块、控制面板
- **交互式 3D 视图**：轨道相机控制，支持旋转、平移、缩放
- **爆炸视图**：滑块控制拆解程度，平滑动画过渡
- **模块选择**：点击模块查看详细信息和技术参数
- **中英双语界面**：完整的中文/英文双语支持
- **响应式设计**：适配各种屏幕尺寸

## 🚀 部署到 GitHub Pages

### 方法一：使用 GitHub Actions（推荐）

本项目已配置 GitHub Actions 自动部署，只需以下步骤：

1. **创建 GitHub 仓库**
   ```bash
   # 在 GitHub 上创建新仓库，例如：arri-alexa35-teardown
   ```

2. **推送代码到 GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: ARRI ALEXA 35 Interactive 3D Teardown"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
   git push -u origin main
   ```

3. **配置 GitHub Pages**
   - 进入仓库的 **Settings** → **Pages**
   - 在 **Source** 部分选择 **GitHub Actions**
   - 推送代码后会自动触发部署

4. **访问网站**
   - 部署完成后，访问：`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### 方法二：手动部署

如果不想使用 GitHub Actions，可以手动部署：

1. **构建项目**
   ```bash
   npm install
   npm run build
   ```

2. **部署 dist 文件夹**
   ```bash
   # 使用 gh-pages 包
   npm install -D gh-pages
   npx gh-pages -d dist
   ```

3. **配置 GitHub Pages**
   - 进入仓库的 **Settings** → **Pages**
   - 在 **Source** 部分选择 **Deploy from a branch**
   - 选择 **gh-pages** 分支和 **/ (root)** 文件夹

## ⚙️ 配置说明

### Vite Base Path 配置

如果部署到 `username.github.io/repo-name`（非根域名），需要修改 `vite.config.js`：

```javascript
export default defineConfig({
  base: '/YOUR_REPO_NAME/',  // 添加这一行
  plugins: [react(), tailwindcss()],
  // ... 其他配置
});
```

如果部署到 `username.github.io`（根域名），则不需要修改，保持 `base: '/'`（默认值）。

### 自定义域名

如果想使用自定义域名：

1. 在仓库根目录创建 `CNAME` 文件，内容为你的域名：
   ```
   yourdomain.com
   ```

2. 在域名注册商处配置 DNS：
   - A 记录指向 GitHub Pages IP 地址
   - 或 CNAME 记录指向 `YOUR_USERNAME.github.io`

## 🛠️ 技术栈

- **React 18** - UI 框架
- **Three.js** - 3D 渲染引擎
- **Vite** - 构建工具
- **Tailwind CSS** - 样式框架
- **TypeScript** - 类型安全

## 📦 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📝 模块列表

1. **机身外壳** (Body Housing) - 镁合金机身框架
2. **传感器模块** (Sensor Module) - ALEV III 4.6K CMOS
3. **镜头卡口** (Lens Mount) - ARRI LPL 大画幅卡口
4. **散热系统** (Cooling System) - 高效静音散热
5. **处理电路板** (Processing Board) - FPGA 图像处理器
6. **取景器** (Viewfinder) - MVF-2 OLED 取景器
7. **存储模块** (Media/Codex) - 2TB NVMe SSD
8. **电源模块** (Power Module) - B-Mount 电池接口
9. **控制面板** (Control Panel) - OLED 状态显示屏

## 🎨 交互说明

- **左键拖拽** - 旋转视角
- **右键拖拽** - 平移视角
- **滚轮** - 缩放
- **点击模块** - 查看详细信息
- **拆解滑块** - 控制爆炸视图程度
- **自动旋转** - 切换自动旋转
- **复位** - 重置视角和状态

## 📄 License

MIT License

## 🙏 致谢

- ARRI - 灵感来源
- Three.js 社区
- React 社区
