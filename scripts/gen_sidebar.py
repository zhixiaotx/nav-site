# -*- coding: utf-8 -*-
"""从导航数据 md 生成 docsify _sidebar.md

用法: python gen_sidebar.py
侧边栏结构: 首页 + 两个导航文件(小帅同学/资源工具), 每个导航下列出全部 # 分类,
分类锚点链接格式: <page>.md?id=cat-<page>-<index>
"""
import re
import os

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = [
    ("xiaoshuitongxue.md", "📚 小帅同学"),
    ("zygjdq.md", "🧰 资源工具"),
]

HEADING_RE = re.compile(r"^#\s+(.+?)\s*$", re.MULTILINE)


def extract_categories(md_path):
    with open(md_path, "r", encoding="utf-8") as f:
        content = f.read()
    return HEADING_RE.findall(content)


def main():
    lines = ["- [🏠 首页](/)", ""]
    for md_file, label in PAGES:
        page = md_file.replace(".md", "")
        cats = extract_categories(os.path.join(BASE, md_file))
        lines.append(f"- **{label}**")
        for i, cat in enumerate(cats):
            clean = cat.strip()
            lines.append(f"  - [{clean}]({md_file}?id=cat-{page}-{i})")
        lines.append("")

    sidebar = "\n".join(lines).rstrip() + "\n"
    out = os.path.join(BASE, "_sidebar.md")
    with open(out, "w", encoding="utf-8") as f:
        f.write(sidebar)
    print(f"生成 {out}: {len(PAGES)} 个导航, 共 {sum(len(extract_categories(os.path.join(BASE, m))) for m, _ in PAGES)} 个分类")


if __name__ == "__main__":
    main()
