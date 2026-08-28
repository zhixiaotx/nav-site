# -*- coding: utf-8 -*-
"""扫描 ziyuan/ 下所有 md，自动重命名为 ASCII 安全名（保留中文显示名），并生成 docsify _sidebar.md

用法:
    python gen_sidebar.py

说明:
    - 文件名统一改为 ASCII（如 ai.md / nav12.md），避免 docsify + GitHub Pages 对非 ASCII
      文件名路由失败（表现为点击分类后一直“加载中”）。
    - 侧边栏显示名仍用文件原始中文名；链接指向 ASCII 文件。
    - 新增导航：直接把 .md 丢进 ziyuan/（名字随便起），运行本脚本即可。
"""
import os
import re

DOC = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ZIYUAN = os.path.join(DOC, "ziyuan")
SIDEBAR = os.path.join(DOC, "_sidebar.md")


def slugify(base, used):
    ascii_part = "-".join(re.findall(r"[A-Za-z0-9]+", base)).lower()
    slug = ascii_part if (ascii_part and len(ascii_part) <= 30) else "nav"
    orig = slug
    n = 2
    while slug in used:
        slug = f"{orig}-{n}"
        n += 1
    used.add(slug)
    return slug


def main():
    files = sorted(f for f in os.listdir(ZIYUAN) if f.endswith(".md"))
    used = set()
    mapping = []  # (label, slug)
    for f in files:
        base = f[:-3]
        slug = slugify(base, used)
        newname = slug + ".md"
        oldpath = os.path.join(ZIYUAN, f)
        newpath = os.path.join(ZIYUAN, newname)
        if oldpath != newpath:
            os.rename(oldpath, newpath)
            print(f"{base}  ->  {newname}")
        mapping.append((base, slug))

    lines = ["- [🏠 首页](/)", ""]
    for label, slug in mapping:
        lines.append(f"- [📄 {label}](ziyuan/{slug}.md)")
    lines.append("")
    with open(SIDEBAR, "w", encoding="utf-8") as fp:
        fp.write("\n".join(lines).rstrip() + "\n")
    print(f"\n已处理 {len(mapping)} 个导航文件；_sidebar.md 已更新。")


if __name__ == "__main__":
    main()
