/* ============================================
 * 我的导航站 - 导航增强插件
 * 功能：
 *  1. markdown 表格 -> 响应式卡片网格
 *  2. 分类标题稳定锚点 id（配合 _sidebar 跳转）
 *  3. 页面顶部横向分类标签条（仅导航页）
 *  4. 卡片 favicon 多级 fallback
 *  5. 亮/暗主题切换按钮
 * 注意：必须在 docsify 实例化前加载（push plugins）
 * ============================================ */
(function () {
  'use strict';

  var FAVICON_SERVICES = [
    function (host) { return 'https://www.google.com/s2/favicons?domain=' + host + '&sz=64'; },
    function (host) { return 'https://icon.horse/icon/' + host; },
    function (host) { return 'https://favicon.im/' + host; }
  ];

  /* 当前页面名（去掉 .md 与 query） */
  function currentPage() {
    var m = location.hash.match(/^#\/([^?#]*)/);
    return m ? m[1].replace(/\.md$/, '') : '';
  }

  function isNavPage(page) {
    return page === 'xiaoshuitongxue' || page === 'zygjdq';
  }

  function hostOf(url) {
    try { return new URL(url).hostname; } catch (e) { return ''; }
  }

  /* 表格行 td -> 卡片 DOM */
  function makeCard(tds) {
    if (!tds || tds.length < 2) return null;
    var name = tds[0].textContent.trim();
    var a = tds[1].querySelector('a');
    var url = a ? a.getAttribute('href') : tds[1].textContent.trim();
    var desc = tds.length > 2 ? tds[2].textContent.trim() : '';
    if (!url) return null;

    var card = document.createElement('a');
    card.className = 'nav-card';
    card.href = url;
    card.target = '_blank';
    card.rel = 'noopener noreferrer';

    var host = hostOf(url);
    if (host) {
      var icon = document.createElement('span');
      icon.className = 'nav-card-icon';
      var idx = 0;
      var img = document.createElement('img');
      img.loading = 'lazy';
      img.alt = '';
      img.addEventListener('error', function () {
        idx++;
        if (idx < FAVICON_SERVICES.length) {
          img.src = FAVICON_SERVICES[idx](host);
        } else {
          icon.style.display = 'none';
        }
      });
      img.src = FAVICON_SERVICES[0](host);
      icon.appendChild(img);
      card.appendChild(icon);
    }

    var body = document.createElement('span');
    body.className = 'nav-card-body';
    var nm = document.createElement('span');
    nm.className = 'nav-card-name';
    nm.textContent = name;
    body.appendChild(nm);
    if (desc) {
      var dc = document.createElement('span');
      dc.className = 'nav-card-desc';
      dc.textContent = desc;
      body.appendChild(dc);
    }
    card.appendChild(body);
    return card;
  }

  /* 表格 -> 卡片网格 */
  function renderCards(section) {
    var tables = section.querySelectorAll('table');
    tables.forEach(function (table) {
      var rows = table.querySelectorAll('tbody tr');
      if (!rows.length) return;
      var grid = document.createElement('div');
      grid.className = 'nav-grid';
      rows.forEach(function (tr) {
        var card = makeCard(tr.querySelectorAll('td'));
        if (card) grid.appendChild(card);
      });
      if (grid.children.length) table.replaceWith(grid);
    });
  }

  /* 分类标题：稳定 id，供侧边栏 ?id= 锚点跳转 */
  function fixHeadings(section, page) {
    var heads = section.querySelectorAll('h1');
    heads.forEach(function (h, i) {
      h.id = 'cat-' + page + '-' + i;
      h.classList.add('cat-heading');
    });
  }

  /* 顶部横向分类标签条（仅导航页且有多个分类时） */
  function buildTabs(section, page) {
    var heads = section.querySelectorAll('h1');
    if (!isNavPage(page) || heads.length < 2) return;
    var bar = document.createElement('div');
    bar.className = 'cat-tabs';
    heads.forEach(function (h) {
      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent.trim();
      a.className = 'cat-tab';
      bar.appendChild(a);
    });
    var first = section.querySelector('h1');
    section.insertBefore(bar, first || section.firstChild);
  }

  /* 亮/暗主题切换按钮 */
  function themeToggle() {
    if (document.getElementById('nav-theme-toggle')) return;
    var btn = document.createElement('button');
    btn.id = 'nav-theme-toggle';
    btn.className = 'theme-toggle';
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

  /* 注册 docsify 插件（必须在 docsify 实例化之前） */
  window.$docsify = window.$docsify || {};
  (window.$docsify.plugins = window.$docsify.plugins || []).push(function (hook) {
    hook.doneEach(function () {
      var section = document.querySelector('article.markdown-section');
      if (!section) return;
      var page = currentPage() || 'home';
      renderCards(section);
      fixHeadings(section, page);
      buildTabs(section, page);
      themeToggle();
    });
  });
})();
