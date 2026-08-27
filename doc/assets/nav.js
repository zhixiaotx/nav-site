/* ============================================
 * 我的导航站 - 功能增强插件
 * 功能：
 *  1. 统一搜索栏（站内/站外一键切换；站外=20 搜索引擎，站外默认必应，可切换+记忆）
 *  2. 一键置顶按钮
 *  3. 左侧面板折叠/展开（桌面端）
 *  4. 亮/暗主题切换按钮（localStorage 记忆）
 *  5. 分类标题(h1)标记 + 醒目样式
 * 注意：必须在 docsify 实例化前加载（push plugins）
 * ============================================ */
(function () {
  'use strict';

  /* ---------- 搜索引擎列表（20 个，第一个为默认必应） ---------- */
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

  /* ---------- 统一搜索栏（站内 / 站外 切换） ---------- */
  function buildUnifiedSearch() {
    if (document.getElementById('web-search-bar')) return null;

    var bar = document.createElement('div');
    bar.id = 'web-search-bar';
    bar.className = 'web-search';

    // 模式切换：站外(out) / 站内(in)
    var modeBtn = document.createElement('button');
    modeBtn.className = 'ws-mode';
    modeBtn.type = 'button';
    modeBtn.title = '切换 站内 / 站外 搜索';

    // 搜索引擎下拉（仅站外模式显示）
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
      sec.querySelectorAll('table tbody tr, h1.cat-heading').forEach(function (el) {
        el.style.display = '';
      });
    }

    // 站内搜索：按关键词筛选当前页表格行，并隐藏无匹配的分类标题
    function siteFilter(term) {
      var sec = document.querySelector('article.markdown-section');
      if (!sec) return;
      term = (term || '').trim().toLowerCase();
      sec.querySelectorAll('h1.cat-heading').forEach(function (h) {
        var t = h.nextElementSibling;
        while (t && t.tagName !== 'TABLE') t = t.nextElementSibling;
        if (!t) { h.style.display = ''; return; }
        var rows = t.querySelectorAll('tbody tr');
        var any = false;
        rows.forEach(function (r) {
          var match = !term || r.textContent.toLowerCase().indexOf(term) !== -1;
          r.style.display = match ? '' : 'none';
          if (match) any = true;
        });
        h.style.display = any ? '' : 'none';
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
      if (mode === 'out') clearFilter(); // 切到站外时恢复全部行
    });
    btn.addEventListener('click', doSearch);
    input.addEventListener('keydown', function (ev) {
      if (ev.key === 'Enter') doSearch();
    });
    input.addEventListener('input', function () {
      if (mode === 'in') siteFilter(input.value); // 站内实时筛选
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
    btn.textContent = '↑';
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

  /* ---------- 左侧面板折叠/展开（桌面端） ---------- */
  function buildSidebarToggle() {
    if (document.getElementById('nav-sb-toggle')) return;
    var btn = document.createElement('button');
    btn.id = 'nav-sb-toggle';
    btn.className = 'sb-toggle';
    btn.title = '折叠/展开侧边栏';
    btn.textContent = '☰';
    btn.addEventListener('click', function () {
      document.body.classList.toggle('nav-sb-closed');
      try { localStorage.setItem('nav-sb', document.body.classList.contains('nav-sb-closed') ? 'closed' : 'open'); } catch (e) {}
    });
    try {
      if (localStorage.getItem('nav-sb') === 'closed' && window.innerWidth >= 768) {
        document.body.classList.add('nav-sb-closed');
      }
    } catch (e) {}
    document.body.appendChild(btn);
  }

  /* ---------- 亮/暗主题切换按钮 ---------- */
  function themeToggle() {
    if (document.getElementById('nav-theme-toggle')) return;
    var btn = document.createElement('button');
    btn.id = 'nav-theme-toggle';
    btn.className = 'fab-btn theme-toggle';
    btn.title = '切换亮/暗主题';
    var dark = false;
    try { dark = localStorage.getItem('nav-theme') === 'dark'; } catch (e) {}
    btn.textContent = dark ? '☀️' : '🌙';
    if (dark) document.body.classList.add('nav-dark');
    btn.addEventListener('click', function () {
      var nowDark = document.body.classList.toggle('nav-dark');
      btn.textContent = nowDark ? '☀️' : '🌙';
      try { localStorage.setItem('nav-theme', nowDark ? 'dark' : 'light'); } catch (e) {}
    });
    document.body.appendChild(btn);
  }

  /* ---------- 分类标题(h1)标记 ---------- */
  function markHeadings(section) {
    var heads = section.querySelectorAll('h1');
    heads.forEach(function (h) { h.classList.add('cat-heading'); });
  }

  /* ---------- 统一搜索栏插入到内容顶部 ---------- */
  function injectUnifiedSearch(section) {
    var bar = buildUnifiedSearch();
    if (!bar) return;
    section.insertBefore(bar, section.firstChild);
  }

  /* ---------- 注册 docsify 插件（必须在 docsify 实例化之前） ---------- */
  window.$docsify = window.$docsify || {};
  (window.$docsify.plugins = window.$docsify.plugins || []).push(function (hook) {
    hook.doneEach(function () {
      var section = document.querySelector('article.markdown-section');
      if (!section) return;
      markHeadings(section);
      injectUnifiedSearch(section);
      buildTopButton();
      buildSidebarToggle();
      themeToggle();
    });
  });
})();
