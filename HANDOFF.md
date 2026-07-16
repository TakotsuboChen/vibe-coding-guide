# HANDOFF — 读全文再开始干活

生成时间: 2026-07-16T23:33 · Git HEAD: 9e0be33
恢复方式: 对 Claude 说"读一下 HANDOFF.md，按头部 Git HEAD 复核本文件"。
信任规则: [V] = 交接时已用命令验证；[?] = 仅记忆未复核，当线索对待。

## 1. 当前目标

从手写 Jekyll 模板（`_layouts/default.html` + `assets/css/style.css`）迁移至 Just the Docs 主题。已完成全部配置修改和文件清理，尚未 commit + push。

## 2. 已验证状态 — 工作实际停在哪

- 手写模板和 CSS 已删除 [V] `git status` 显示 deleted: `_layouts/default.html`, `assets/css/style.css`
- `_config.yml` 已改为 `remote_theme: just-the-docs/just-the-docs`，并启用了搜索、锚点、页脚、GitHub 链接 [V] `cat _config.yml`
- 全部 13 个章节 `.md` 文件已添加 `nav_order` frontmatter [V] `git diff --stat` 显示 13 个 chapters 文件有 1 行变更
- `index.md` 已加 `layout: home`，首页可从侧边栏 click 进入 [V] `cat index.md`
- `Gemfile` 已加 `jekyll-remote-theme` 依赖 [V] `cat Gemfile`
- 旧 HANDOFF.md 已归档到 `.handoffs/20260716233300-handoff.md` [V] `ls .handoffs/`
- 工作树有 18 个未提交变更 [V] `git status`

## 3. 决策与理由

- **选择 Just the Docs 而非其他框架**：Jekyll 生态、零迁移成本（改 config 即可）、兼容 GitHub Pages、自带搜索功能 [V]——用户确认选择
- **删除旧模板而非保留**：324 行手写代码全被 Just the Docs 覆盖，保留只会增加维护负担 [V]——cleanup
- **`nav_order` 用数字而非字母排序**：数字排序可精确控制章节顺序，避免字母序导致第 10 章排在 01 前面 [V]——排序逻辑

## 4. 失败的尝试 — 不要再试

（无 — 本次无失败的尝试）

## 5. 已知坑

- 第 10 章保留了 CSAPP 和 Nand2Tetris 作为推荐资源，对没有硬件背景的读者可能偏硬——但这是自学 CS 社区公认的最佳路径，保留 [V]
- 根目录 index.html 可能返回 503（CDN 缓存），但 chapters/ 下的页面正常 [V] 上次验证
- 用户级 skill 和项目级 skill 是手动同步的——如果只改一个忘了改另一个会分裂。下次改 skill 时要同时改两份 [V]
- 切换到 Just the Docs 后，旧模板中的 `use_math` 注入（MathJax）不再可用——但指南中没有使用数学公式，无影响 [V] grep 确认

## 6. 下一步（有序）

1. 验证跨章节链接在 GitHub Pages 上是否正常工作（`.md` → `.html` 转换）
2. 验证侧边栏移动端响应式布局
3. （可选）加 `.github/` 目录和 issue template

## 7. 留给用户的开放问题

- 根目录 index.html 的 503 是否已自动恢复？
- 用户级 handoff skill 需要手动同步，是否应该考虑用符号链接或 git hook 自动同步？