/* ============================================================
 * nav.js —— 干净 docsify 插件（不拦截 XHR / fetch，不影响挂载）
 * 提供：① 站外搜索栏（引擎下拉 + 输入框 + 搜索按钮 + 站内/站外切换）
 *       ② 白天/黑夜主题切换按钮（右下角，记忆到 localStorage）
 *       ③ 右下角一键置顶按钮
 * 站内搜索由官方 search.min.js 提供，本文件不重复实现。
 * 参考 zhixiaotx/blog 的插件写法：仅用 hook，不碰网络层。
 * ============================================================ */
(function () {
  'use strict';

  // 站点搜索：驱动官方 search 插件
  function runSiteSearch(q) {
    var si = document.querySelector('.search input');
    if (!si) return false;
    si.value = q;
    si.dispatchEvent(new Event('input', { bubbles: true }));
    si.focus();
    return true;
  }

  // 20 个国内外常用搜索引擎（key 用于标识，url 为搜索结果页模板，{q} 处拼关键词）
  // 默认引擎为必应 Bing（DEFAULT_ENGINE）
  var DEFAULT_ENGINE = 'bing';
  var SEARCH_ENGINES = [
    { key: 'bing',     name: '必应 Bing',   url: 'https://www.bing.com/search?q=' },
    { key: 'baidu',    name: '百度',        url: 'https://www.baidu.com/s?wd=' },
    { key: 'google',   name: 'Google',      url: 'https://www.google.com/search?q=' },
    { key: 'bingcn',   name: '必应国内',     url: 'https://cn.bing.com/search?q=' },
    { key: 'sogou',    name: '搜狗',        url: 'https://www.sogou.com/web?query=' },
    { key: 'so360',    name: '360 搜索',     url: 'https://www.so.com/s?q=' },
    { key: 'sm',       name: '神马搜索',     url: 'https://m.sm.cn/s?q=' },
    { key: 'toutiao',  name: '头条搜索',     url: 'https://so.toutiao.com/search?keyword=' },
    { key: 'quark',    name: '夸克搜索',     url: 'https://quark.sm.cn/s?q=' },
    { key: 'weixin',   name: '微信搜一搜',   url: 'https://weixin.sogou.com/weixin?query=' },
    { key: 'zhihu',    name: '知乎',        url: 'https://www.zhihu.com/search?type=content&q=' },
    { key: 'weibo',    name: '微博',        url: 'https://s.weibo.com/weibo?q=' },
    { key: 'bilibili', name: '哔哩哔哩',     url: 'https://search.bilibili.com/all?keyword=' },
    { key: 'douyin',   name: '抖音',        url: 'https://www.douyin.com/search?keyword=' },
    { key: 'xhs',      name: '小红书',      url: 'https://www.xiaohongshu.com/search_result?keyword=' },
    { key: 'taobao',   name: '淘宝',        url: 'https://s.taobao.com/search?q=' },
    { key: 'jd',       name: '京东',        url: 'https://search.jd.com/Search?keyword=' },
    { key: 'github',   name: 'GitHub',      url: 'https://github.com/search?q=' },
    { key: 'ddg',      name: 'DuckDuckGo',  url: 'https://duckduckgo.com/?q=' },
    { key: 'yahoo',    name: 'Yahoo',       url: 'https://search.yahoo.com/search?p=' }
  ];

  function engineUrl(key) {
    for (var i = 0; i < SEARCH_ENGINES.length; i++) {
      if (SEARCH_ENGINES[i].key === key) return SEARCH_ENGINES[i].url;
    }
    return SEARCH_ENGINES[0].url; // 找不到则回退到默认（必应）
  }

  function getSavedEngine() {
    try { return localStorage.getItem('nav-engine'); } catch (e) { return null; }
  }
  function saveEngine(key) {
    try { localStorage.setItem('nav-engine', key); } catch (e) {}
  }

  // 站外搜索：按所选引擎打开新标签页
  function runWebSearch(engine, q) {
    var url = engineUrl(engine) + encodeURIComponent(q);
    window.open(url, '_blank', 'noopener');
  }

  function ensureUI() {
    /* ---------- 站外搜索栏（注入侧边栏顶部） ---------- */
    if (!document.querySelector('.web-search')) {
      var sb = document.querySelector('.sidebar');
      if (sb) {
        var box = document.createElement('div');
        box.className = 'web-search';
        // 动态生成 20 个搜索引擎下拉项；默认选中必应（记忆上次选择）
        var savedEngine = getSavedEngine();
        var activeEngine = savedEngine || DEFAULT_ENGINE;
        var opts = '';
        for (var i = 0; i < SEARCH_ENGINES.length; i++) {
          var e = SEARCH_ENGINES[i];
          opts += '<option value="' + e.key + '"' +
            (e.key === activeEngine ? ' selected' : '') + '>' + e.name + '</option>';
        }
        box.innerHTML =
          '<select class="ws-engine" title="选择搜索引擎">' + opts + '</select>' +
          '<input class="ws-input" type="text" placeholder="站外搜索关键词" />' +
          '<button class="ws-btn" type="button">搜索</button>' +
          '<button class="ws-mode" type="button">站外</button>';
        // 放到侧边栏最顶部（在官方 .search 之上）
        sb.insertBefore(box, sb.firstChild);

        var engine = box.querySelector('.ws-engine');
        var input = box.querySelector('.ws-input');
        var btn = box.querySelector('.ws-btn');
        var modeBtn = box.querySelector('.ws-mode');

        engine.addEventListener('change', function () {
          saveEngine(engine.value); // 记忆所选引擎
        });

        function doSearch() {
          var q = input.value.trim();
          if (!q) { input.focus(); return; }
          if (box.classList.contains('mode-site')) {
            if (!runSiteSearch(q)) {
              // 官方搜索插件未就绪时退回站外
              runWebSearch(engine.value, q);
            }
          } else {
            runWebSearch(engine.value, q);
          }
        }

        btn.addEventListener('click', doSearch);
        input.addEventListener('keydown', function (ev) {
          if (ev.key === 'Enter') doSearch();
        });
        modeBtn.addEventListener('click', function () {
          var site = box.classList.toggle('mode-site');
          modeBtn.textContent = site ? '站内' : '站外';
          modeBtn.classList.toggle('site', site);
          engine.style.display = site ? 'none' : '';
          input.placeholder = site ? '站内搜索关键词' : '站外搜索关键词';
        });
      }
    }

    /* ---------- 悬浮按钮：主题切换 ---------- */
    if (!document.querySelector('.theme-toggle')) {
      var theme = document.createElement('button');
      theme.className = 'fab-btn theme-toggle';
      theme.type = 'button';
      theme.title = '切换白天 / 黑夜';
      theme.setAttribute('aria-label', '切换主题');
      theme.textContent = '🌙';
      document.body.appendChild(theme);
      theme.addEventListener('click', function () {
        var dark = document.body.classList.toggle('nav-dark');
        try { localStorage.setItem('nav-theme', dark ? 'dark' : 'light'); } catch (e) {}
        theme.textContent = dark ? '☀️' : '🌙';
      });
      // 恢复上次主题
      var saved;
      try { saved = localStorage.getItem('nav-theme'); } catch (e) {}
      if (saved === 'dark') {
        document.body.classList.add('nav-dark');
        theme.textContent = '☀️';
      }
    }

    /* ---------- 悬浮按钮：一键置顶 ---------- */
    if (!document.querySelector('.top-btn')) {
      var top = document.createElement('button');
      top.className = 'fab-btn top-btn';
      top.type = 'button';
      top.title = '回到顶部';
      top.setAttribute('aria-label', '回到顶部');
      top.textContent = '↑';
      document.body.appendChild(top);
      top.addEventListener('click', function () {
        window.scrollTo(0, 0);
        var c = document.querySelector('.content');
        if (c) c.scrollTop = 0;
      });
    }
  }

  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop || 0;
    var c = document.querySelector('.content');
    if (c) y = Math.max(y, c.scrollTop);
    var top = document.querySelector('.top-btn');
    if (top) top.classList.toggle('show', y > 300);
  }

  // 把滚动监听挂到【当前】.content（docsify 翻页会替换该元素，故每次 doneEach 重挂）
  function bindScroll() {
    window.addEventListener('scroll', onScroll);
    var c = document.querySelector('.content');
    if (c) c.addEventListener('scroll', onScroll);
  }

  // 注册为 docsify 插件（参考 blog：仅用 hook，不碰网络层）
  window.$docsify = window.$docsify || {};
  window.$docsify.plugins = [].concat(window.$docsify.plugins || [], function (hook) {
    hook.mounted(function () {
      ensureUI();
      bindScroll();
      onScroll();
    });
    hook.doneEach(function () {
      ensureUI();
      bindScroll();
      onScroll();
    });
  });
})();
