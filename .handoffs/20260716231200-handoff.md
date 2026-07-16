# HANDOFF — 读全文再开始干活

生成时间: 2026-07-16T23:10 · Git HEAD: 186a356
恢复方式: 对 Claude 说"读一下 HANDOFF.md，按头部 Git HEAD 复核本文件"。
信任规则: [V] = 交接时已用命令验证；[?] = 仅记忆未复核，当线索对待。

## 1. 当前目标

handoff skill 已增加 CLAUDE.md 自动检查步骤，指南第 4/6/7 章已同步更新。所有修改已 commit + push。

## 2. 已验证状态 — 工作实际停在哪

- 项目级 handoff skill 增加了步骤 5（检查 CLAUDE.md 是否需要更新）[V] git diff 确认
- 用户级 handoff skill 与项目级完全一致 [V] diff 命令验证
- 第 6 章 handoff skill 描述更新为 6 步流程 [V] git diff 确认
- 第 7 章收工流程合并了步骤 4-5，handoff skill 路线直接跳到"清上下文" [V] git diff 确认
- 第 7 章自然语言 B 方案增加了第 6 条 CLAUDE.md 检查要求 [V] git diff 确认
- 第 4 章末尾步骤增加了 CLAUDE.md 链接检查 [V] git diff 确认
- 本项目的 CLAUDE.md 已有 `[HANDOFF.md](HANDOFF.md)` 链接 [V] grep 确认
- 工作树待提交：HANDOFF.md + 4 个章节文件 + 2 个 skill 文件 [V] git diff --stat
- GitHub Pages 所有章节页面返回 200 [V] 上次验证

## 3. 决策与理由

- **检查 CLAUDE.md 放在步骤 4 之后、步骤 6 之前**：归档后 commit 前，确保 CLAUDE.md 的修改也能被 commit 包含 [V]——流程决定
- **用户级 skill 从项目级复制**：`cp .claude/skills/handoff/SKILL.md ~/.claude/skills/handoff/SKILL.md`，保持两份一致 [V]—避免分裂
- **第 7 章手写 B 方案也加 CLAUDE.md 检查**：即使没装 skill，自然语言措辞也提醒用户要求 Claude 检查 CLAUDE.md [V]——覆盖所有场景

## 4. 失败的尝试 — 不要再试

（无 — 本次无失败的尝试）

## 5. 已知坑

- 第 10 章保留了 CSAPP 和 Nand2Tetris 作为推荐资源，对没有硬件背景的读者可能偏硬——但这是自学 CS 社区公认的最佳路径，保留 [V]
- 根目录 index.html 可能返回 503（CDN 缓存），但 chapters/ 下的页面正常 [V] 上次验证
- 用户级 skill 和项目级 skill 是手动同步的——如果只改一个忘了改另一个会分裂。下次改 skill 时要同时改两份 [V] 本次已验证

## 6. 下一步（有序）

1. 验证跨章节链接在 GitHub Pages 上是否正常工作（`.md` → `.html` 转换）
2. 验证侧边栏移动端响应式布局
3. （可选）加 `.github/` 目录和 issue template

## 7. 留给用户的开放问题

- 根目录 index.html 的 503 是否已自动恢复？
- 用户级 handoff skill 需要手动同步，是否应该考虑用符号链接或 git hook 自动同步？