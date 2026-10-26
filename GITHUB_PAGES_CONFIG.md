# GitHub Pages 配置说明

## 重要：Vite Base Path 配置

### 场景 1：部署到用户主页（username.github.io）

如果你部署到 `username.github.io`（用户主页仓库），**不需要修改** `vite.config.js`，保持默认配置即可。

### 场景 2：部署到项目页面（username.github.io/repo-name）

如果你部署到 `username.github.io/repo-name`（项目仓库），**必须修改** `vite.config.js`：

打开 `vite.config.js`，添加 `base` 配置：

```javascript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  base: '/YOUR_REPO_NAME/',  // ← 添加这一行，替换为你的仓库名
  plugins: [react(), tailwindcss()],
  server: {
    host: "0.0.0.0",
    port: 3000,
    strictPort: true,
    hmr: {
      port: 3000,
    },
  },
});
```

**示例：**
- 仓库名：`arri-alexa35-teardown`
- 访问地址：`https://username.github.io/arri-alexa35-teardown/`
- 配置：`base: '/arri-alexa35-teardown/'`

## 部署步骤

### 方法 1：使用 GitHub Actions（自动化）

本项目已配置 GitHub Actions，推送代码后自动部署。

1. 创建 GitHub 仓库
2. 推送代码到 `main` 或 `master` 分支
3. 在仓库 Settings → Pages 中选择 "GitHub Actions" 作为 Source
4. 等待部署完成（约 1-2 分钟）
5. 访问 `https://username.github.io/repo-name/`

### 方法 2：手动部署

```bash
# 安装 gh-pages
npm install -D gh-pages

# 构建项目
npm run build

# 部署到 gh-pages 分支
npx gh-pages -d dist
```

然后在 GitHub Settings → Pages 中选择 "Deploy from a branch"，选择 `gh-pages` 分支。

## 自定义域名（可选）

如果想使用自定义域名：

1. 在项目根目录创建 `CNAME` 文件：
   ```
   yourdomain.com
   ```

2. 在域名注册商配置 DNS：
   - A 记录：指向 GitHub Pages IP（185.199.108.153 等）
   - 或 CNAME 记录：指向 `username.github.io`

3. 在 GitHub Settings → Pages 中启用 "Enforce HTTPS"

## 常见问题

### Q: 页面加载后白屏？
A: 检查 `vite.config.js` 中的 `base` 配置是否正确。

### Q: 资源文件 404？
A: 确保 `base` 路径与仓库名一致，注意末尾的 `/`。

### Q: 如何更新部署？
A: 推送代码到 `main` 分支，GitHub Actions 会自动重新部署。

### Q: 部署失败？
A: 检查 GitHub Actions 日志，常见原因：
- Node.js 版本不兼容
- 依赖安装失败
- 构建错误

## 验证部署

部署成功后，访问你的 GitHub Pages URL，应该能看到：
- ARRI ALEXA 35 标题
- 白色背景的 3D 场景
- 左侧模块列表面板
- 底部控制栏

如果一切正常，恭喜你部署成功！🎉
