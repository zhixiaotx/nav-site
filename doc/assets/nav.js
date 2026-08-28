/* ============================================
 * 我的导航站 - 功能增强插件
 * 功能：
 *  1. 统一搜索栏（站内/站外切换；20 搜索引擎，默认必应）
 *  2. 一键置顶按钮
 *  3. 左侧面板折叠/展开
 *  4. 亮/暗主题切换
 *  5. 分类徽标注入（每个表格上方显示分类名称）
 * 注意：必须在 docsify 实例化前加载
 * ============================================ */
(function () {
  'use strict';

  /* ---------- 搜索引擎列表（20 个） ---------- */
  var ENGINES = [
    { id: 'bing',  name: '必应 Bing',     url: 'https://www.bing.com/search?q=' },
    { id: 'baidu', name: '百度',           url: 'https://www.baidu.com/s?wd=' },
    { id: 'google', name: 'Google',       url: 'https://www.google.com/search?q=' },
    { id: 'sogou', name: '搜狗',           url: 'https://www.sogou.com/web?query=' },
    { id: 'so360', name: '360 搜索',       url: 'https://www.so.com/s?q=' },
    { id: 'sm',    name: '神马',           url: 'https://m.sm.cn/s?q=' },
    { id: 'quark', name: '夸克',           url: 'https://quark.sm.cn/s?q=' },
    { id: 'toutiao', name: '头条搜索',     url: 'https://so.toutiao.com/search?dvpf=pc&keyword=' },
    { id: 'ddg',   name: 'DuckDuckGo',    url: 'https://duckduckgo.com/?q=' },
    { id: 'brave', name: 'Brave',         url: 'https://search.brave.com/search?q=' },
    { id: 'yandex', name: 'Yandex',       url: 'https://yandex.com/search/?text=' },
    { id: 'ecosia', name: 'Ecosia',       url: 'https://www.ecosia.org/search?q=' },
    { id: 'startpage', name: 'Startpage', url: 'https://www.startpage.com/sp/search?query=' },
    { id: 'github', name: 'GitHub',       url: 'https://github.com/search?q=' },
    { id: 'zhihu', name: '知乎',           url: 'https://www.zhihu.com/search?type=content&q=' },
    { id: 'bilibili', name: '哔哩哔哩',   url: 'https://search.bilibili.com/all?keyword=' },
    { id: 'weixin', name: '微信搜一搜',    url: 'https://weixin.sogou.com/weixin?type=2&query=' },
    { id: 'weibo', name: '微博',           url: 'https://s.weibo.com/weibo?q=' },
    { id: 'xhs',   name: '小红书',         url: 'https://www.xiaohongshu.com/search_result?keyword=' },
    { id: 'douban', name: '豆瓣',          url: 'https://www.douban.com/search?q=' }
  ];
  var LS_ENGINE = 'nav-ws-engine';
  var LS_MODE = 'nav-ws-mode';

  /* ---------- 统一搜索栏 ---------- */
  function buildUnifiedSearch() {
    if (document.getElementById('web-search-bar')) return null;

    var bar = document.createElement('div');
    bar.id = 'web-search-bar';
    bar.className = 'web-search';

    // 模式切换按钮
    var modeBtn = document.createElement('button');
    modeBtn.className = 'ws-mode';
    modeBtn.type = 'button';
    modeBtn.title = '切换 站内 / 站外 搜索';

    // 引擎下拉
    var engineSel = document.createElement('select');
    engineSel.className = 'ws-engine';
    engineSel.title = '选择搜索引擎';
    var savedEngine = 'bing';
    try { savedEngine = localStorage.getItem(LS_ENGINE) || 'bing'; } catch (e) {}
    ENGINES.forEach(function (en) {
      var opt = document.createElement('option');
      opt.value = en.id;
      opt.textContent = en.name;
      if (en.id === savedEngine) opt.selected = true;
      engineSel.appendChild(opt);
    });

    var input = document.createElement('input');
    input.className = 'ws-input';
    input.type = 'text';

    var btn = document.createElement('button');
    btn.className = 'ws-btn';
    btn.type = 'button';
    btn.textContent = '搜索';

    var mode = 'out';
    try { mode = localStorage.getItem(LS_MODE) || 'out'; } catch (e) {}

    function applyMode() {
      if (mode === 'in') {
        bar.classList.add('mode-site');
        modeBtn.textContent = '站内';
        modeBtn.classList.add('site');
        input.placeholder = '站内搜索：输入关键词筛选当前页链接';
      } else {
        bar.classList.remove('mode-site');
        modeBtn.textContent = '站外';
        modeBtn.classList.remove('site');
        input.placeholder = '站外搜索：输入关键词，回车即搜';
      }
    }

    function clearFilter() {
      var sec = document.querySelector('article.markdown-section');
      if (!sec) return;
      sec.querySelectorAll('table tbody tr, .cat-badge, h1.cat-heading').forEach(function (el) {
        el.style.display = '';
      });
    }

    function siteFilter(term) {
      var sec = document.querySelector('article.markdown-section');
      if (!sec) return;
      term = (term || '').trim().toLowerCase();
      // 遍历每个分类组（badge -> table）
      var groups = sec.querySelectorAll('.cat-badge');
      // 兼容旧版 h1.cat-heading
      if (groups.length === 0) groups = sec.querySelectorAll('h1.cat-heading');

      groups.forEach(function (badge) {
        // 找该分类对应的下一个表格
        var table = badge.nextElementSibling;
        while (table && table.tagName !== 'TABLE') table = table.nextElementSibling;
        if (!table) { badge.style.display = ''; return; }
        var rows = table.querySelectorAll('tbody tr');
        var any = false;
        rows.forEach(function (r) {
          var match = !term || r.textContent.toLowerCase().indexOf(term) !== -1;
          r.style.display = match ? '' : 'none';
          if (match) any = true;
        });
        badge.style.display = any ? '' : 'none';
      });
    }

    function doSearch() {
      var q = input.value.trim();
      if (mode === 'out') {
        if (!q) { input.focus(); return; }
        var engine = ENGINES.filter(function (e) { return e.id === engineSel.value; })[0] || ENGINES[0];
        try { localStorage.setItem(LS_ENGINE, engine.id); } catch (e) {}
        window.open(engine.url + encodeURIComponent(q), '_blank');
      } else {
        siteFilter(q);
      }
    }

    modeBtn.addEventListener('click', function () {
      mode = (mode === 'out') ? 'in' : 'out';
      try { localStorage.setItem(LS_MODE, mode); } catch (e) {}
      applyMode();
      if (mode === 'out') clearFilter();
    });
    btn.addEventListener('click', doSearch);
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') doSearch();
    });
    input.addEventListener('input', function () {
      if (mode === 'in') siteFilter(input.value);
    });

    bar.appendChild(modeBtn);
    bar.appendChild(engineSel);
    bar.appendChild(input);
    bar.appendChild(btn);
    applyMode();
    return bar;
  }

  /* ---------- 一键置顶按钮 ---------- */
  function buildTopButton() {
    if (document.getElementById('nav-top-btn')) return;
    var btn = document.createElement('button');
    btn.id = 'nav-top-btn';
    btn.className = 'fab-btn top-btn';
    btn.title = '回到顶部';
    btn.textContent = '\u2191';
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    document.body.appendChild(btn);

    var visible = false;
    window.addEventListener('scroll', function () {
      var y = window.scrollY || document.documentElement.scrollTop;
      if (y > 300 && !visible) { visible = true; btn.classList.add('show'); }
      else if (y <= 300 && visible) { visible = false; btn.classList.remove('show'); }
    }, { passive: true });
  }

  /* ---------- 左侧面板折叠/展开 ---------- */
  function buildSidebarToggle() {
    if (document.getElementById('nav-sb-toggle')) return;
    var btn = document.createElement('button');
    btn.id = 'nav-sb-toggle';
    btn.className = 'sb-toggle';
    btn.title = '折叠/展开侧边栏';
    btn.textContent = '\u2630';
    btn.addEventListener('click', function () {
      document.body.classList.toggle('nav-sb-closed');
      try {
        localStorage.setItem('nav-sb', document.body.classList.contains('nav-sb-closed') ? 'closed' : 'open');
      } catch (e) {}
    });
    try {
      if (localStorage.getItem('nav-sb') === 'closed' && window.innerWidth >= 768) {
        document.body.classList.add('nav-sb-closed');
      }
    } catch (e) {}
    document.body.appendChild(btn);
  }

  /* ---------- 亮/暗主题切换 ---------- */
  function themeToggle() {
    if (document.getElementById('nav-theme-toggle')) return;
    var btn = document.createElement('button');
    btn.id = 'nav-theme-toggle';
    btn.className = 'fab-btn theme-toggle';
    btn.title = '切换亮/暗主题';
    var dark = false;
    try { dark = localStorage.getItem('nav-theme') === 'dark'; } catch (e) {}
    btn.textContent = dark ? '\u2600\ufe0f' : '\ud83c\udf19';
    if (dark) document.body.classList.add('nav-dark');
    btn.addEventListener('click', function () {
      var nowDark = document.body.classList.toggle('nav-dark');
      btn.textContent = nowDark ? '\u2600\ufe0f' : '\ud83c\uff19';
      try { localStorage.setItem('nav-theme', nowDark ? 'dark' : 'light'); } catch (e) {}
    });
    document.body.appendChild(btn);
  }

  /* ========== 分类徽标注入（核心修复） ==========
   * docsify 会把每个页面的第一个 # h1 当作页面标题吃掉，
   * 导致正文里缺少第一个分类名。
   * 本函数：
   *   1. 扫描所有 h1，给它们加 cat-heading 类 + 确保可见
   *   2. 对每个表格检查：如果前方没有分类徽标，则主动创建一个
   *   3. 用 docsify 内部状态获取被吃掉的第一个 h1 文本作为首分类名
   */
  function injectCategoryBadges(section) {
    if (!section) return;

    // --- 步骤 A：标记所有现有 h1 ---
    var h1s = section.querySelectorAll('h1');
    h1s.forEach(function (h) {
      h.classList.add('cat-heading');
      // 强制确保可见（覆盖任何可能隐藏它的样式）
      if (h.style.display === 'none') h.style.display = '';
      h.style.visibility = 'visible';
      h.style.opacity = '1';
    });

    // --- 步骤 B：获取当前页标题（docsify 吃掉的第一个 h1）---
    var pageTitle = '';
    // 方法1：从 docsify 路由标题获取
    var titleEl = document.querySelector('.sidebar-nav li.active > a, .sidebar-nav li.active > p');
    if (titleEl) {
      pageTitle = titleEl.getAttribute('data-title') || titleEl.textContent.trim();
    }
    // 方法2：从页面 h1（如果有的话）
    var pageH1 = section.querySelector('h1');
    if (pageH1 && !pageTitle) {
      pageTitle = pageH1.textContent.trim();
    }

    // --- 步骤 C：扫描所有表格，确保每个表格上方都有分类徽标 ---
    var tables = section.querySelectorAll('table');
    var usedFirstTitle = false;

    tables.forEach(function (table, idx) {
      // 始终创建新徽标（不依赖 h1 的可见性）
      var badge = document.createElement('div');
      badge.className = 'cat-badge';

      // 确定分类名：优先使用对应位置的 h1 文本，其次用页面标题兜底
      var label = '';
      // 优先取同位置 h1 的文本（最准确——来自原始 md 的 # 标题）
      if (h1s[idx]) {
        label = h1s[idx].textContent.trim();
      } else if (idx === 0 && pageTitle) {
        // 第一个表格且没有对应 h1 时才用页面标题
        label = pageTitle;
      } else {
        label = '\u5206\u7c7b' + (idx + 1);
      }

      badge.textContent = label;
      table.parentNode.insertBefore(badge, table);

      // 如果该表格前已有 h1.cat-heading，隐藏它避免重复显示
      var prev = table.previousElementSibling;
      if (prev && prev !== badge) {
        // 找到前面的 h1 并隐藏
        var walk = prev;
        while (walk && walk !== badge) {
          if (walk.tagName === 'H1' && walk.classList.contains('cat-heading')) {
            walk.style.display = 'none';
            break;
          }
          walk = walk.previousElementSibling;
        }
      }
    });

    // --- 步骤 D：确保所有 cat-heading 的 anchor 隐藏 ---
    section.querySelectorAll('h1.cat-heading .anchor').forEach(function (a) {
      a.style.display = 'none';
    });
  }

  /* ---------- 注入统一搜索栏到内容顶部 ---------- */
  function injectUnifiedSearch(section) {
    var bar = buildUnifiedSearch();
    if (!bar) return;
    // 插入到内容区最顶部（在所有分类和表格之前）
    section.insertBefore(bar, section.firstChild);
  }

  /* ---------- 注册 docsify 插件 ---------- */
  window.$docsify = window.$docsify || {};
  (window.$docsify.plugins = window.$docsify.plugins || []).push(function (hook) {
    hook.doneEach(function () {
      var section = document.querySelector('article.markdown-section');
      if (!section) return;

      // 顺序很重要：先注入分类徽标 → 再注入搜索栏（搜索栏在最顶部）
      injectCategoryBadges(section);
      injectUnifiedSearch(section);

      buildTopButton();
      buildSidebarToggle();
      themeToggle();
    });
  });
})();
