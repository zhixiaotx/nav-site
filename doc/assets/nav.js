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

  // 站外搜索：按所选引擎打开新标签页
  function runWebSearch(engine, q) {
    var url;
    if (engine === 'google') {
      url = 'https://www.google.com/search?q=' + encodeURIComponent(q);
    } else if (engine === 'bing') {
      url = 'https://www.bing.com/search?q=' + encodeURIComponent(q);
    } else if (engine === 'bingcn') {
      url = 'https://cn.bing.com/search?q=' + encodeURIComponent(q);
    } else {
      url = 'https://www.baidu.com/s?wd=' + encodeURIComponent(q);
    }
    window.open(url, '_blank', 'noopener');
  }

  function ensureUI() {
    /* ---------- 站外搜索栏（注入侧边栏顶部） ---------- */
    if (!document.querySelector('.web-search')) {
      var sb = document.querySelector('.sidebar');
      if (sb) {
        var box = document.createElement('div');
        box.className = 'web-search';
        box.innerHTML =
          '<select class="ws-engine" title="选择搜索引擎">' +
          '<option value="baidu">百度</option>' +
          '<option value="google">Google</option>' +
          '<option value="bing">Bing</option>' +
          '<option value="bingcn">必应</option>' +
          '</select>' +
          '<input class="ws-input" type="text" placeholder="站外搜索关键词" />' +
          '<button class="ws-btn" type="button">搜索</button>' +
          '<button class="ws-mode" type="button">站外</button>';
        // 放到侧边栏最顶部（在官方 .search 之上）
        sb.insertBefore(box, sb.firstChild);

        var engine = box.querySelector('.ws-engine');
        var input = box.querySelector('.ws-input');
        var btn = box.querySelector('.ws-btn');
        var modeBtn = box.querySelector('.ws-mode');

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
