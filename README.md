# 🚀 我的导航站

> 基于 [docsify](https://github.com/docsifyjs/docsify/) 构建的**零依赖、零构建**静态导航站。
> 左侧按 Markdown 文件分类，右侧展示「分类 + 表格」链接列表，支持站内搜索与站外多引擎搜索、一键置顶、面板折叠、亮暗主题、移动端适配。

## ✨ 功能特性

| 功能 | 说明 |
| ---- | ---- |
| 📚 分类导航 | 左侧按 md 文件分类（`xiaoshuitongxue.md` / `zygjdq.md`），右侧分类标题 + 表格展示 |
| 🔍 站内搜索 | 左侧边栏顶部搜索框，可检索全部链接的名称与介绍 |
| 🌐 站外搜索 | 内置 **20 个国内外搜索引擎**（默认必应，可切换并记住选择） |
| ⬆️ 一键置顶 | 滚动超过一屏后，右下角出现「回到顶部」按钮 |
| 📂 面板折叠 | 桌面端左上角 ☰ 按钮可折叠/展开左侧面板 |
| 🌙 亮暗主题 | 右下角一键切换，自动记忆选择 |
| 📱 移动端适配 | 手机 / 平板 / 小屏自适应，表格可横向滑动 |
| 🚀 多平台部署 | 支持 GitHub Pages（CI 自动）、Cloudflare Pages、Vercel、Netlify |

---

## 🧩 技术栈与原理

- **docsify**：一个神奇的文档网站生成器。它**不构建**——直接加载 Markdown 文件并在浏览器中实时渲染，改完 `.md` 保存即生效。
- **纯静态**：整个站点只有 HTML / CSS / JS / Markdown，无数据库、无后端、无构建步骤。
- **本地化依赖**：docsify 核心库已下载到 `doc/assets/vendor/`，不依赖外网 CDN，国内访问稳定。

---

## 📁 目录结构与文件说明

```
nav-site/
├── README.md                  # 【项目文档】也就是你正在看的这份（GitHub 仓库首页展示）
├── doc/                       # 【站点内容】docsify 站点根目录（发布时打包这一整个目录）
│   ├── index.html             # 站点唯一入口（docsify 配置 + 引入资源）
│   ├── .nojekyll              # 关键：禁用 GitHub Pages 的 Jekyll 构建，改为纯静态托管（docsify 必需，勿删）
│   ├── README.md              # 站点首页内容（导航入口页）
│   ├── _sidebar.md            # 左侧导航栏定义（按 md 文件名分类）
│   ├── ziyuan/                # 导航数据目录（每个 md = 左侧一个分类入口）
│   │   ├── xiaoshuitongxue.md # 导航数据①：小帅同学（18 个分类）
│   │   └── zygjdq.md          # 导航数据②：资源工具（25 个分类）
│   ├── assets/
│   │   ├── nav.js             # 功能增强插件（站外搜索/置顶/折叠/主题）
│   │   ├── style.css          # 自定义样式（表格美化/响应式/主题变量）
│   │   └── vendor/            # 本地化的 docsify 依赖库（勿删）
│   │       ├── docsify.min.js # docsify 核心
│   │       ├── search.min.js  # 站内搜索插件
│   │       └── vue.css        # 官方 vue 主题
│   └── scripts/
│       └── gen_sidebar.py     # [可选] 自动生成侧边栏的 Python 脚本
└── .github/
    └── workflows/
        └── deploy.yml         # GitHub Actions：自动部署到 gh-pages
```

### 各文件职责

| 文件 | 作用 | 需要改吗 |
| ---- | ---- | ---- |
| `doc/ziyuan/xiaoshuitongxue.md` | 导航数据，**日常主要维护对象**，改这里就是更新链接 | ✅ 常用 |
| `doc/ziyuan/zygjdq.md` | 导航数据②，同上 | ✅ 常用 |
| `doc/_sidebar.md` | 左侧显示哪些文件入口 | 偶尔 |
| `doc/index.html` | 站点名称、主题色、搜索配置 | 偶尔 |
| `doc/assets/nav.js` | 添加/删除搜索引擎、改按钮行为 | 偶尔 |
| `doc/assets/style.css` | 颜色、字体、间距、移动端样式 | 偶尔 |
| `doc/assets/vendor/*` | docsify 官方库 | ❌ 不要动 |
| `.github/workflows/deploy.yml` | 自动部署配置 | 一般不用 |

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

> ⚠️ 直接用浏览器双击打开 `index.html`（file:// 协议）**可能无法正常显示**，docsify 需要通过 HTTP 访问，请务必用上面任意一种方式启动服务器。

### 方法二：部署到 GitHub Pages（推荐，含自动部署）

1. **推送代码**：把 `nav-site` 整个项目推送到你的 GitHub 仓库 `main` 分支。
2. **开启 Pages**：进入仓库 `Settings → Pages`，Source 选择 **Deploy from a branch**，分支选 **gh-pages**，目录 `/ (root)`，保存。
3. **自动部署**：以后每次 `push` 到 `main`，GitHub Actions（`.github/workflows/deploy.yml`）会自动把 `doc/` 目录打包推送到 `gh-pages` 分支并更新线上站点。
4. **访问地址**：`https://<你的用户名>.github.io/<仓库名>/`

> 如果 Actions 首次运行后没有自动生成 `gh-pages` 分支，检查 `Actions` 页面运行日志，或在 `Settings → Pages` 手动选择一次 gh-pages 分支即可。

### 方法三：部署到其他平台

> 💡 本项目是纯静态站点，以下平台均**无需任何构建命令**，**发布目录都填 `doc`**。

#### ☁️ Cloudflare Pages

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/) → Workers & Pages → **Create** → **Pages** → **Connect to Git**。
2. 选择你的 GitHub 仓库，**Build command 留空**，**Build output directory 填 `doc`**。
3. 点击 **Save and Deploy** 即可，每次 push 自动构建发布。
4. 可绑定自己的域名：Pages → Custom domains。

#### ▲ Vercel

1. 登录 [Vercel](https://vercel.com/) → **Add New → Project**，导入 GitHub 仓库。
2. **Framework Preset** 选择 **Other**，**Build Command 留空**，**Output Directory 填 `doc`**。
3. 点击 **Deploy**，完成。每次 push 自动部署。

#### 🚢 Netlify

1. 登录 [Netlify](https://www.netlify.com/) → **Add new site → Import an existing project**，连接 GitHub 仓库。
2. **Build command 留空**，**Publish directory 填 `doc`**。
3. 点击 **Deploy site**，完成。每次 push 自动部署。

---

## ✏️ 如何更新导航内容

**日常加链接 / 改链接，只需要编辑 `doc/ziyuan/` 下的两个 md 文件：**

```markdown
# 分类名称            ← 一级标题（#），就是一个分类

| 名称 | 链接 | 介绍 |     ← 表格固定三列
| ---- | ---- | ---- |
| 百度  | https://www.baidu.com/ | 搜索引擎 |
```

- 新增一个分类：在文件末尾加 `# 分类名` + 表格
- 新增一条链接：在对应表格里加一行
- 注意：每行必须保持 `| 名称 | 链接 | 介绍 |` 三列格式，链接必须以 `http://` 或 `https://` 开头
- 保存后，本地刷新即可看到；线上站点等部署流程跑完即可

---

## ⚙️ 常用自定义

### 1. 修改站点名称 / 主题色

编辑 `doc/index.html`：

```js
window.$docsify = {
  name: '🚀 我的导航站',        // ← 站点名称
  themeColor: '#4a6cf7'         // ← 主题色（十六进制色值）
};
```

### 2. 修改搜索引擎列表

编辑 `doc/assets/nav.js` 中的 `ENGINES` 数组，格式：

```js
{ id: 'bing', name: '必应 Bing', url: 'https://www.bing.com/search?q=' }
```

- `id`：唯一标识（与 localStorage 记忆相关，改动后旧选择会失效）
- `name`：下拉框中显示的名称
- `url`：搜索地址模板，关键词会自动拼在末尾并 URL 编码
- 第一个即为**默认搜索引擎**（当前默认必应）

### 3. 修改左侧面板

编辑 `doc/_sidebar.md`，按行添加文件入口（md 放在 `ziyuan/` 目录下时写完整相对路径）：

```markdown
- [🏠 首页](/)
- [📄 xiaoshuitongxue](ziyuan/xiaoshuitongxue.md)
- [📄 zygjdq](ziyuan/zygjdq.md)
```

### 4. 深浅主题 / 折叠面板的记忆

选择会自动保存在浏览器 `localStorage` 中，清除浏览器数据后恢复默认。

---

## 📱 移动端适配说明

| 设备 | 表现 |
| ---- | ---- |
| 平板（≤768px） | 左侧面板默认隐藏，用左上角汉堡菜单展开；自定义折叠按钮自动隐藏 |
| 手机（≤480px） | 站外搜索栏自动换行堆叠；表格支持横向滑动；按钮缩小 |
| 超窄屏（<360px） | 搜索框全宽堆叠，保证可用 |

样式集中在 `doc/assets/style.css` 底部的 `@media` 区块中，需要微调直接改对应断点即可。

---

## ❓ 常见问题

**Q1：双击 index.html 打不开 / 空白？**
docsify 依赖 HTTP 协议渲染，必须用本地服务器或部署到线上，不能用 file:// 直接打开。

**Q0：部署后整个站点 404 / Jekyll 构建报错？**
在 `doc/` 根目录放一个空文件 `.nojekyll`（本项目已包含）。GitHub Pages 默认会用 Jekyll 构建站点，它会忽略 `_` 开头的文件（如 `_sidebar.md`）并编译 SCSS，导致 docsify 站点构建失败。`.nojekyll` 让 GitHub 直接静态托管，跳过 Jekyll。

**Q2：部署后图片/样式 404？**
本项目所有资源均使用**相对路径**（`assets/...`、`#/...`），可部署在任意子路径。若仍异常，检查 `doc/index.html` 中 `relativePath: true` 是否保留。

**Q3：改完 md 线上没更新？**
GitHub Pages 部署有 1~2 分钟延迟；其他平台一般几十秒。可在 Actions 页面查看部署状态。

**Q4：想加第四列？**
docsify 表格列数自由，但 `doc/assets/nav.js` 与 `doc/assets/style.css` 中「最后一列弱化」样式基于三列设计，加列时请同步调整 `doc/assets/style.css` 中 `.markdown-section table tbody td:last-child` 相关规则。

**Q5：`doc/scripts/gen_sidebar.py` 有什么用？**
如果以后左侧需要按「文件内分类」细分（而非只按文件名），可用它自动生成带锚点的 `_sidebar.md`：

```bash
cd doc && python scripts/gen_sidebar.py
```

---

## 📄 License

本项目基于 docsify（MIT License）构建，导航数据来源于个人收藏整理，仅供学习交流使用。
