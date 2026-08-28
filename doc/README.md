# 🚀 我的导航站

> 基于 [docsify](https://github.com/docsifyjs/docsify/) 构建的**零依赖、零构建**静态导航站。
> 左侧按 Markdown 文件分类（显示文件名，不带 `.md`），右侧展示「分类标题 + 表格」链接列表；
> 顶部内置**站内搜索**（docsify 官方插件）；整体**移动端自适应**。

> 📌 本文件是网站首页内容（线上可见）。项目完整文档（含部署 / 工作流 / 小白 Git 教程）在仓库根目录 `README.md`。

> 🔧 **架构变更（2026-08-28）**：本站此前为"本地化 docsify + 自定义 `nav.js` 插件 + 看门狗回退"方案，
> 自定义代码在部分网络 / 浏览器环境下会中断 docsify 挂载，导致「点击分类 → 页面加载失败」。
> 已**重构为标准 CDN docsify 配置**（参照可正常工作的 [`zhixiaotx/blog`](https://github.com/zhixiaotx/blog) 项目）：
> 移除 `nav.js` / `assets/vendor/` / 看门狗回退逻辑，docsify 核心与主题改由 `cdn.jsdelivr.net` 加载，
> 仅保留官方搜索插件与 `notFoundPage` / `catchPluginErrors` 守门。点任意分类现在都能正常渲染。

---

## ✨ 功能特性

| 功能 | 说明 |
| ---- | ---- |
| 📚 分类导航 | 左侧按 md 文件名分类（共 **55** 个分类入口），右侧分类标题 + 表格展示 |
| 🔍 站内搜索 | docsify 官方搜索插件，按「分类名 / 站点名 / 链接」实时检索 |
| 📱 移动端适配 | 手机 / 平板 / 小屏自适应，表格可横向滑动 |
| 🚀 多平台部署 | 支持 GitHub Pages（CI 自动）、Cloudflare Pages、Vercel、Netlify，均无需构建 |

---

## 🧩 技术栈与原理

- **docsify**：一个文档网站生成器。它**不构建**——直接加载 Markdown 文件并在浏览器中实时渲染，改完 `.md` 保存即生效。
- **纯静态**：整个站点只有 HTML / CSS / JS / Markdown，无数据库、无后端、无构建步骤。
- **CDN 加载**：docsify 核心与 vue 主题从 `cdn.jsdelivr.net` 加载（已验证国内可达）；自定义样式 `style.css` 随仓库发布。
  - 若 `jsdelivr` 在你的网络不可达，可把 `index.html` 里的 `cdn.jsdelivr.net/npm/docsify@4` 换成 `unpkg.com/docsify@4` 或本地化引入。
- **相对路径**：站点所有资源（CSS/JS）与导航链接都使用相对路径，可部署在任意子路径或域名。

---

## 📁 目录结构与文件说明

```
nav-site/
├── README.md                  # 【项目文档】GitHub 仓库首页说明（更详细）
├── doc/                       # 【站点内容】docsify 站点根目录（发布时打包这一整个目录）
│   ├── index.html             # 站点唯一入口（docsify 配置 + 从 CDN 引入 docsify）
│   ├── .nojekyll              # 关键：禁用 GitHub Pages 的 Jekyll 构建
│   ├── README.md              # 站点首页内容（你正在看的文件）
│   ├── _sidebar.md            # 左侧导航栏定义（55 个分类入口）
│   ├── _404.md                # 找不到页面时展示的回退内容
│   ├── ziyuan/                # 导航数据目录（每个 md = 左侧一个分类入口，共 55 个）
│   │   ├── ai.md              # 示例分类：AI 人工智能导航
│   │   └── ...                # 其余 54 个分类（文件名为 ASCII，避免跨平台大小写冲突）
│   ├── assets/
│   │   └── style.css          # 自定义样式：表格美化、配色变量、移动端 @media
│   └── scripts/
│       └── gen_sidebar.py     # [可选] 自动生成侧边栏的 Python 脚本
└── .github/
    └── workflows/
        └── deploy.yml         # GitHub Actions：自动把 doc/ 打包推到 gh-pages 并部署
```

### 各文件职责（小白速查表）

| 文件 | 它到底干什么 | 你需要改吗 |
| ---- | ---- | ---- |
| `doc/ziyuan/*.md` | **日常维护对象**。每个文件 = 左侧一个分类入口；文件内每个 `# 标题` = 一个分类，下面跟一个三列表格 | ✅ 最常改 |
| `doc/_sidebar.md` | 决定**左侧显示哪些入口**、顺序、显示文字。新增 md 后必须在这里加一行 | ✅ 加分类时要改 |
| `doc/index.html` | docsify 总配置：站点名、相对路径、站内搜索、404 处理、CDN 地址等。改站名 / 主题色 / 搜索词来这里 | 偶尔 |
| `doc/_404.md` | 找不到对应页面时文档化展示的内容（替代原先"页面加载失败"提示） | 很少 |
| `doc/assets/style.css` | 颜色、字体、间距、表格样式、移动端断点。想换配色 / 调间距来这里 | 偶尔 |
| `doc/.nojekyll` | 空文件，告诉 GitHub Pages 别用 Jekyll 构建（否则 `_sidebar.md` 会被忽略导致白屏） | ❌ 别删 |
| `.github/workflows/deploy.yml` | 自动部署流水线，push 到 main 就自动发布 | 一般不用改 |

---

## 🚀 快速上手（小白版）

### 方法一：本地预览

需要 [Python](https://www.python.org/downloads/)（或 Node.js），任选其一：

```bash
# 进入站点内容目录（不是仓库根目录！）
cd nav-site/doc

# 方式 A：用 Python 起一个静态服务器
python -m http.server 8899

# 方式 B：用 Node 起服务器（如果装了 node）
npx serve .
```

浏览器打开 <http://localhost:8899> 即可预览。

> ⚠️ 直接双击 `index.html`（file:// 协议）**无法正常显示**，docsify 需要 HTTP 访问，务必用上面的方式起服务器。

### 方法二：部署到 GitHub Pages（推荐，自动部署）

1. **推送代码**：把 `nav-site` 整个项目推送到你的 GitHub 仓库 `main` 分支（首次建仓库见仓库根 `README.md` 的「小白 Git 教程」）。
2. **开启 Pages**：仓库 `Settings → Pages`，Source 选 **Deploy from a branch**，分支选 **gh-pages**，目录 `/ (root)`，保存。
3. **自动部署**：以后每次 `push` 到 `main`，GitHub Actions 自动把 `doc/` 打包推到 `gh-pages` 并更新线上。
4. **访问地址**：`https://<你的用户名>.github.io/<仓库名>/`（本仓库即 `https://zhixiaotx.github.io/nav-site/`）

### 方法三：部署到其他平台

> 💡 本站是纯静态站点，**以下平台均无需构建命令，发布目录都填 `doc`**。

#### ☁️ Cloudflare Pages
1. [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → **Create** → **Pages** → **Connect to Git**。
2. 选你的仓库，**Build command 留空**，**Build output directory 填 `doc`**（框架预设选 `None` / 无）。
3. **Save and Deploy**，之后每次 push 自动发布。可绑自定义域名。

#### ▲ Vercel
1. [Vercel](https://vercel.com/) → **Add New → Project**，导入仓库。
2. **Framework Preset** 选 **Other**，**Build Command 留空**，**Output Directory 填 `doc`**。
3. **Deploy**，完成。每次 push 自动部署。

#### 🚢 Netlify
1. [Netlify](https://www.netlify.com/) → **Add new site → Import an existing project**，连 GitHub 仓库。
2. **Build command 留空**，**Publish directory 填 `doc`**。
3. **Deploy site**，完成。每次 push 自动部署。

---

## 📝 实操示例：新增一个导航分类文件

> 这是**最常用的操作**。假设你想新增一个「影视资源」导航页，全程 3 步，不懂代码也能做。

### 第 1 步：新建 md 文件

进入 `nav-site/doc/ziyuan/` 文件夹，新建文件 `影视资源.md`（文件名建议用英文 / 拼音，避免大小写冲突；中文也行）。

用记事本 / VS Code 打开，写入内容。**格式固定**：每个 `# 一级标题` = 一个分类，紧跟一个三列表格（`名称 | 链接 | 介绍`）。

```markdown
# 影视在线

| 名称 | 链接 | 介绍 |
| ---- | ---- | ---- |
| 爱奇艺 | https://www.iqiyi.com/ | 长视频平台 |
| 腾讯视频 | https://v.qq.com/ | 长视频平台 |

# 影视下载

| 名称 | 链接 | 介绍 |
| ---- | ---- | ---- |
| 迅雷 | https://www.xunlei.com/ | 下载工具 |
| 115网盘 | https://115.com/ | 网盘 |
```

> 注意：表格每行必须保持三列；链接以 `http://` 或 `https://` 开头；分类标题用 `#`（一个井号）开头。

### 第 2 步：让左侧栏出现这个入口

用编辑器打开 `nav-site/doc/_sidebar.md`，在末尾加一行（链接必须带 `ziyuan/` 前缀）：

```markdown
- [📄 影视资源](ziyuan/影视资源.md)
```

- 方括号 `📄 影视资源` = 左侧**显示的文字**（可随意改）
- 圆括号 `ziyuan/影视资源.md` = **文件路径**（必须和真实文件名一致，带 `.md`）

### 第 3 步：保存并推送到 GitHub（自动上线）

打开终端（或 Git Bash），进入项目根目录 `nav-site/`，依次执行：

```bash
git add -A
git commit -m "新增影视资源导航分类"
git push origin main
```

### 第 4 步：坐等自动部署

- GitHub Actions 自动把 `doc/` 打包推到 `gh-pages`，约 1~2 分钟完成。
- 打开 `https://<你的用户名>.github.io/<仓库名>/#/ziyuan/影视资源` 即可看到新页面。
- 想先本地看？`cd doc` 后 `python -m http.server 8899`，浏览器开 `http://localhost:8899/#/ziyuan/影视资源`。

> 💡 **一句话总结**：新增导航 = ① 在 `ziyuan/` 放 md ② 在 `_sidebar.md` 加一行 ③ `git push`。就这三件事。

---

## 🔗 相对路径（relativePath）说明

`doc/index.html` 中配置了 `relativePath: false`，这是踩坑验证后的关键设置：

- `relativePath: true` ❌：docsify 会把侧栏里的相对链接按「当前页面所在目录」再次拼接。当你在 `ziyuan/xxx` 子页里再点另一个 `ziyuan/yyy` 链接时，会变成 `ziyuan/ziyuan/yyy`，路径叠加导致 404（本站初期就踩过这个坑）。
- `relativePath: false` ✅：所有相对链接始终基于站点根解析，不会叠加。

同时，站点所有资源都使用相对路径（`assets/...`、`#/...`），因此：
- 可部署在 GitHub Pages 子路径（`/nav-site/`）、根域名、Cloudflare / Vercel / Netlify，都不用改路径。
- 若某天部署到**非根子路径**且 docsify 找不到资源，可在 `index.html` 加 `basePath: '/你的子路径/'` 配置（本仓库当前部署在 `/nav-site/`，已正常工作）。

---

## ✏️ 如何更新导航内容（改链接 / 分类）

日常加链接、改链接、加分类，只动 `doc/ziyuan/` 下的 md 文件：

- **新增一条链接**：在对应表格里加一行 `| 名称 | 链接 | 介绍 |`。
- **新增一个分类**：在文件里加 `# 分类名` + 一个三列表格。
- **修改 / 删除**：直接编辑对应行。
- 保存后本地刷新即可见；线上等部署跑完（1~2 分钟）即更新。

---

## ⚙️ 常用自定义

### 1. 修改站点名称 / 主题色

编辑 `doc/index.html`：

```js
window.$docsify = {
  name: '🚀 我的导航站',        // ← 站点名称
  // 如需修改主题色（影响顶部加载进度条 / 链接高亮），可加下面这一行：
  themeColor: '#4a6cf7'         // ← 主题色（十六进制色值，可选）
};
```

### 2. 站内搜索配置（docsify 官方插件）

站内搜索由 docsify 官方 `search.min.js`（已在 `index.html` 通过 CDN 引入）提供，配置写在 `doc/index.html` 的 `search` 字段：

```js
window.$docsify = {
  search: {
    maxAge: 86400000,      // 搜索索引缓存时长（毫秒），默认 1 天
    paths: 'auto',         // 自动索引所有页面
    placeholder: '搜索分类 / 站点',  // 搜索框占位文字
    noData: '找不到结果',            // 无结果提示
    depth: 4               // 标题检索深度
  }
};
```

- `placeholder` / `noData`：改成你想要的提示文字。
- `maxAge`：调小可让搜索索引更频繁更新（调试时常用）。
- `depth`：控制收录到第几级标题。

### 3. 修改左侧面板入口

编辑 `doc/_sidebar.md`，按行添加（md 在 `ziyuan/` 下时写完整相对路径）：

```markdown
- [🏠 首页](/)
- [📄 AI人工智能导航](ziyuan/ai.md)
- [📄 小帅同学](ziyuan/admin.md)
```

### 4. 修改配色 / 间距 / 字体

编辑 `doc/assets/style.css` 顶部的 `:root` 变量（亮色）与 `body.nav-dark`（暗色），如：
`--nav-accent`（主题蓝）、`--sidebar-width`（侧栏宽）、`--nav-bg`（背景）等。

### 5. 暗色样式

`style.css` 已内置暗色变量（`body.nav-dark`）。当前站点默认亮色；如需默认暗色，可在 `doc/index.html` 的 `<body>` 加载后注入：

```html
<script>document.body.classList.add('nav-dark');</script>
```

（仅影响视觉样式，不影响功能。）

---

## 📱 移动端适配说明

样式集中在 `doc/assets/style.css` 底部的三个 `@media` 断点，按设备宽度自动切换：

| 断点 | 设备 | 具体表现 |
| ---- | ---- | ---- |
| ≤768px | 平板 / 大手机横屏 | 左侧分类栏默认隐藏，用 docsify 自带左上角 ☰ 汉堡菜单展开 / 收起；正文顶部留 70px 避免被固定元素遮挡 |
| ≤480px | 手机 | 表格可横向滑动；悬浮按钮缩小 |
| ≤359px | 超窄屏 | 布局进一步收窄，保证不溢出 |

- 表格在窄屏通过 `overflow-x: auto` 横向滚动，不会撑破页面。
- 微调某档设备样式，直接改 `style.css` 对应 `@media` 区块即可。

---

## ❓ 常见问题

**Q1：双击 index.html 打不开 / 空白？**
docsify 依赖 HTTP 协议渲染，必须起本地服务器或部署到线上，不能用 `file://` 直接打开。

**Q2：部署后整个站点 404 / Jekyll 构建报错？**
确保 `doc/` 根目录有空文件 `.nojekyll`（本项目已包含）。GitHub Pages 默认用 Jekyll 构建，会忽略 `_` 开头的文件（如 `_sidebar.md`）并编译 SCSS，导致 docsify 站点失败。`.nojekyll` 让 GitHub 直接静态托管，跳过 Jekyll。Cloudflare / Vercel / Netlify 也会读取它。

**Q3：URL 出现重复的 `ziyuan/ziyuan/...`？**
这是 `relativePath` 设置问题。确认 `doc/index.html` 中是 `relativePath: false`（不是 `true`）。`true` 会让子页链接路径叠加，详见上文「相对路径说明」。

**Q4：改完 md 线上没更新？**
GitHub Pages 部署有 1~2 分钟延迟；其他平台一般几十秒。可在 `Actions` 页面查看部署状态。

**Q5：想加第四列？**
docsify 表格列数自由，但「最后一列弱化」样式基于三列设计，加列时请同步调整 `doc/assets/style.css` 中 `.markdown-section table tbody td:last-child` 相关规则。

**Q6：`doc/scripts/gen_sidebar.py` 有什么用？**
若以后左侧需要按「文件内分类」细分（而非只按文件名），可用它自动生成带锚点的 `_sidebar.md`：

```bash
cd doc && python scripts/gen_sidebar.py
```

**Q7：为什么之前点分类会「⚠️ 页面加载失败」，现在不会了？**
此前本站使用"本地化 docsify + 自定义 `nav.js` 插件 + 看门狗回退"组合，自定义代码在部分网络 / 浏览器环境下会中断 docsify 挂载，从而触发回退提示。**2026-08-28 已重构为标准 CDN docsify**（参照可正常工作的 `zhixiaotx/blog`）：移除 `nav.js` 与本地化 `vendor/`、docsify 由 `cdn.jsdelivr.net` 加载、仅保留官方搜索插件与 `notFoundPage` / `catchPluginErrors` 守门。现在点击任意分类都会正常渲染分类内容。

---

## 📄 License

本项目基于 docsify（MIT License）构建，导航数据来源于个人收藏整理，仅供学习交流使用。
