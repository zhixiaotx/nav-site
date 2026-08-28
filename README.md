# 🚀 我的导航站

> 基于 [docsify](https://github.com/docsifyjs/docsify/) 构建的**零依赖、零构建**静态导航站。
> 左侧按 Markdown 文件分类（显示文件名，不带 `.md`），右侧展示「分类标题 + 表格」链接列表；
> 顶部内置**统一搜索栏**（站内/站外一键切换，20 个国内外搜索引擎，默认必应，可记忆）；
> 另有**一键置顶、左侧面板折叠、亮暗主题、移动端适配**。

> 📌 本文件是 GitHub 仓库首页说明。网站首页内容在同目录的 `doc/README.md`（线上可见）。

---

## ✨ 功能特性

| 功能 | 说明 |
| ---- | ---- |
| 📚 分类导航 | 左侧按 md 文件名分类（`xiaoshuitongxue` / `zygjdq`），右侧分类标题 + 表格展示 |
| 🔍 统一搜索栏 | 顶部一个搜索栏，左侧「站外 / 站内」切换按钮。**站外**= 20 个引擎选搜；**站内**= 实时筛选当前页链接 |
| ⬆️ 一键置顶 | 滚动超过一屏后，右下角出现「回到顶部」按钮 |
| 📂 面板折叠 | 桌面端左上角 ☰ 按钮可折叠 / 展开左侧面板 |
| 🌙 亮暗主题 | 右下角一键切换，自动记忆选择 |
| 📱 移动端适配 | 手机 / 平板 / 小屏自适应，表格可横向滑动 |
| 🚀 多平台部署 | 支持 GitHub Pages（CI 自动）、Cloudflare Pages、Vercel、Netlify，均无需构建 |

---

## 🧩 技术栈与原理

- **docsify**：一个文档网站生成器。它**不构建**——直接加载 Markdown 文件并在浏览器中实时渲染，改完 `.md` 保存即生效。
- **纯静态**：整个站点只有 HTML / CSS / JS / Markdown，无数据库、无后端、无构建步骤。
- **本地化依赖**：docsify 核心库已下载到 `doc/assets/vendor/`，不依赖外网 CDN，国内访问稳定。
- **相对路径**：站点所有资源（CSS/JS）与导航链接都使用相对路径，可部署在任意子路径或域名。

---

## 📁 目录结构与文件说明

```
nav-site/
├── README.md                  # 【项目文档】你正在看的这份（GitHub 仓库首页）
├── doc/                       # 【站点内容】docsify 站点根目录（发布时打包这一整个目录）
│   ├── index.html             # 站点唯一入口（docsify 配置 + 引入资源）
│   ├── .nojekyll              # 关键：禁用 GitHub Pages 的 Jekyll 构建，改为纯静态托管（docsify 必需，勿删）
│   ├── README.md              # 站点首页内容（线上可见的导航入口页）
│   ├── _sidebar.md            # 左侧导航栏定义（按 md 文件名分类，每行一个入口）
│   ├── ziyuan/                # 导航数据目录（每个 md = 左侧一个分类入口）
│   │   ├── xiaoshuitongxue.md # 导航数据①：小帅同学（18 个分类）
│   │   └── zygjdq.md          # 导航数据②：资源工具（25 个分类）
│   ├── assets/
│   │   ├── nav.js             # 功能增强插件：统一搜索栏(站内/站外)、置顶、折叠、主题、分类标题注入
│   │   ├── style.css          # 自定义样式：表格美化、搜索栏、主题变量、移动端 @media
│   │   └── vendor/            # 本地化的 docsify 依赖库（勿删）
│   │       ├── docsify.min.js # docsify 核心
│   │       ├── vue.css        # 官方 vue 主题
│   │       └── search.min.js  # ⚠️ 已弃用：站内搜索已合并进 nav.js 的统一搜索栏，index.html 不再加载它（可删，保留无害）
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
| `doc/index.html` | docsify 总配置：站点名、主题色、相对路径、搜索开关等。改站名/主题色来这里 | 偶尔 |
| `doc/assets/nav.js` | 所有"花活"都在这：顶部统一搜索栏、20 个引擎列表、置顶按钮、折叠按钮、主题切换、给每个表格上方注入分类标题 | 偶尔 |
| `doc/assets/style.css` | 颜色、字体、间距、表格样式、移动端断点。想换配色/调间距来这里 | 偶尔 |
| `doc/assets/vendor/*` | docsify 官方库，已本地化 | ❌ 不要动 |
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

1. **推送代码**：把 `nav-site` 整个项目推送到你的 GitHub 仓库 `main` 分支（首次建仓库见下方「实操示例」）。
2. **开启 Pages**：仓库 `Settings → Pages`，Source 选 **Deploy from a branch**，分支选 **gh-pages**，目录 `/ (root)`，保存。
3. **自动部署**：以后每次 `push` 到 `main`，GitHub Actions 自动把 `doc/` 打包推到 `gh-pages` 并更新线上。
4. **访问地址**：`https://<你的用户名>.github.io/<仓库名>/`（本仓库即 `https://zhixiaotx.github.io/nav-site/`）

> 首次运行若 `gh-pages` 分支没自动出现，去 `Actions` 页面看日志，或手动在 `Settings → Pages` 选一次 gh-pages 分支即可。

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

> 三种平台都会读取 `doc/.nojekyll`，跳过 Jekyll，因此 `_sidebar.md` 等下划线文件不会被忽略。

---

## 🐣 小白 Git 教程：如何把代码推送到 GitHub

> 本教程面向**完全没用过 Git 的新手**。目标只有两个：① 把本地 `nav-site` 项目第一次推到 GitHub；② 以后每次改完代码，怎么再推上去。

### 一、第一次安装与配置（整台电脑只需做一次）

1. **下载安装 Git**：到 <https://git-scm.com/downloads> 下载，一路下一步装完。装好后，在任意文件夹里**右键 → "Git Bash Here"** 就能打开命令行窗口。
2. **验证安装**：在 Git Bash 里输入下面命令，能显示版本号就成功：
   ```bash
   git --version
   ```
3. **告诉 Git 你是谁**（只设一次，提交记录会带上这些信息）：
   ```bash
   git config --global user.name "你的名字"
   git config --global user.email "你的邮箱@xxx.com"
   ```

### 二、第一次推送：本地项目 → 新建的 GitHub 仓库

适用场景：你电脑上已经有 `nav-site` 文件夹，但 GitHub 上还**没有**这个仓库。

1. **GitHub 网页新建仓库**：右上角 ➕ → New repository → 填仓库名（如 `nav-site`）→ **不要**勾选 "Add a README file"，保持空仓库 → Create repository。
2. **本地进入项目根目录**（`nav-site` 这一层，里面有 `doc/` 和 `.github/`）：
   ```bash
   cd nav-site
   ```
3. **初始化并提交**：
   ```bash
   git init                      # 把这个文件夹变成 Git 仓库
   git add -A                   # 把所有文件加入"暂存区"
   git commit -m "first commit" # 提交，引号里写这次干了啥
   git branch -M main           # 把默认分支命名为 main
   ```
4. **关联远程仓库并推送**：
   ```bash
   git remote add origin https://github.com/你的用户名/nav-site.git
   git push -u origin main      # -u 记住远程，以后直接 git push 即可
   ```
   > ⚠️ 第一次推送会让你输 GitHub 账号密码 —— **密码那一行要填「个人访问令牌(PAT)」而不是登录密码**（GitHub 已不支持用账号密码推送）。令牌在 GitHub → Settings → Developer settings → Personal access tokens 里生成，勾选 `repo` 权限。

### 三、如果仓库已经在 GitHub 上（克隆下来再改）

仓库早就建好了，你只是想下载下来修改：

```bash
git clone https://github.com/你的用户名/nav-site.git
cd nav-site
# 然后随便改文件……
```

### 四、以后代码更新了，怎么再次推送（最常用 ⭐）

每次你改完 `doc/ziyuan/` 里的链接、或改了任何文件，**就这三步**：

```bash
git add -A                          # 1. 把改动加入暂存区
git commit -m "更新了影视资源导航"    # 2. 提交（写清楚这次改了啥）
git push origin main               # 3. 推送到 GitHub（设过 -u 后直接 git push）
```

推送成功后，GitHub Actions 会自动把 `doc/` 部署上线，约 1~2 分钟生效。

### 五、新手最常踩的坑

| 问题 | 解决办法 |
| ---- | ---- |
| `git push` 报错 `failed to push` / `non-fast-forward` | 说明仓库在别处被改过、本地不是最新。先 `git pull origin main` 拉取，再 `git push` |
| 拉取后提示冲突（conflict） | 打开标红的文件，找到 `<<<<<<<` 和 `>>>>>>>` 手动保留想要的内容，再 `git add -A && git commit -m "解决冲突" && git push` |
| 每次 push 都要输密码很烦 | 用 **SSH 密钥**或**个人访问令牌(PAT)**代替密码；也可勾选"记住凭据" |
| 想看看当前改了啥 / 历史 | `git status` 看未提交改动；`git log --oneline` 看提交记录 |
| 加错文件想撤销暂存 | `git restore --staged 文件名` |

> 💡 **一句话记住**：改完代码 → `git add -A` → `git commit -m "说明"` → `git push`。就这三条命令，日常 99% 的场景够用了。

---

## 📝 实操示例：新增一个导航分类文件

> 这是**最常用的操作**。假设你想新增一个「影视资源」导航页，全程 3 步，不懂代码也能做。

### 第 1 步：新建 md 文件

进入 `nav-site/doc/ziyuan/` 文件夹，新建文件 `影视资源.md`（文件名随意，建议英文/拼音避免乱码，用中文也行）。

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

## ⚙️ GitHub Actions 工作流详解

部署配置在 `.github/workflows/deploy.yml`，**一般不需要改**，但了解原理有助于排查：

- **触发条件**：每次 `git push` 到 `main` 分支（也支持在 Actions 页面手动 `Run workflow`）。
- **执行流程**：
  1. `actions/checkout@v4` 拉取代码；
  2. `peaceiris/actions-gh-pages@v4` 把 `doc/` 整个目录打包，**推送到 `gh-pages` 分支**（`force_orphan: true` 让该分支保持为干净的发布专用孤儿分支）；
  3. 调用 GitHub API，把仓库 Pages 部署源设为 `gh-pages` 分支（`build_type=legacy`，即从分支部署，而非 GitHub Actions 构建）。
- **所需权限**：`contents: write`（推分支）、`pages: write`（配置 Pages）、`id-token: write`（OIDC）。
- **发布目录**：`publish_dir: ./doc` —— 注意是 `doc` 不是仓库根，只有站点内容被发布。

> 一句话：**push 到 main → 自动打包 doc/ → 推 gh-pages → 线上更新**。

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
  themeColor: '#4a6cf7'         // ← 主题色（十六进制色值）
};
```

### 2. 修改 / 增删搜索引擎

编辑 `doc/assets/nav.js` 中的 `ENGINES` 数组：

```js
{ id: 'bing', name: '必应 Bing', url: 'https://www.bing.com/search?q=' }
```

- `id`：唯一标识（与 localStorage 记忆相关，改动后旧选择会失效）
- `name`：下拉框显示名
- `url`：搜索地址模板，关键词自动拼在末尾并 URL 编码
- 数组**第一项即默认引擎**（当前默认必应）

### 3. 修改左侧面板入口

编辑 `doc/_sidebar.md`，按行添加（md 在 `ziyuan/` 下时写完整相对路径）：

```markdown
- [🏠 首页](/)
- [📄 xiaoshuitongxue](ziyuan/xiaoshuitongxue.md)
- [📄 zygjdq](ziyuan/zygjdq.md)
```

### 4. 修改配色 / 间距 / 字体

编辑 `doc/assets/style.css` 顶部的 `:root` 变量（亮色）与 `body.nav-dark`（暗色），如：
`--nav-accent`（主题蓝）、`--sidebar-width`（侧栏宽）、`--nav-bg`（背景）等。

### 5. 主题 / 折叠的记忆

选择自动存浏览器 `localStorage`，清除浏览器数据后恢复默认。

---

## 📱 移动端适配说明

样式集中在 `doc/assets/style.css` 底部的三个 `@media` 断点，按设备宽度自动切换：

| 断点 | 设备 | 具体表现 |
| ---- | ---- | ---- |
| ≤768px | 平板 / 大手机横屏 | 左侧分类栏默认隐藏，用 docsify 自带左上角 ☰ 汉堡菜单展开/收起；自定义折叠按钮自动隐藏；正文顶部留 70px 避免被固定元素遮挡 |
| ≤480px | 手机 | 统一搜索栏的「引擎下拉 + 输入框 + 按钮」自动换行堆叠；表格可横向滑动；悬浮按钮缩小 |
| ≤359px | 超窄屏 | 搜索引擎下拉与按钮变整行全宽，保证不溢出 |

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

---

## 📄 License

本项目基于 docsify（MIT License）构建，导航数据来源于个人收藏整理，仅供学习交流使用。
