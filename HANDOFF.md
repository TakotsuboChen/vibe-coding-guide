# HANDOFF — 读全文再开始干活

生成时间: 2026-07-16T22:23:00 · Git HEAD: 1395b5d
恢复方式: 对 Claude 说"读一下 HANDOFF.md，按头部 Git HEAD 复核本文件"。
信任规则: [V] = 交接时已用命令验证；[?] = 仅记忆未复核，当线索对待。

## 1. 当前目标

指南内容修正：纠正 "learning mode 是第三方插件" 的错误描述、将 Insight 块改为 GFM 告示框格式、修正 HANDOFF.md 自动加载机制说明、生成 handoff skill。大部分已完成，剩余提交。

## 2. 已验证状态 — 工作实际停在哪

- 所有章节的 `★ Insight` 块已改为 `> **💡 Insight**` 块引用格式，标题和正文之间空一行 [V] git diff 可见
- 第 10 章 "learning mode" 描述已从"第三方插件"修正为"内置 Output Style，通过 `/config` 启用" [V] git diff 可见
- 所有引用 `@HANDOFF.md` 的地方已改为 `[HANDOFF.md](HANDOFF.md)` 链接 [V] grep 无残留
- `.gitignore` 已删除 `.handoffs/` 行，归档目录现在进 git [V] git diff 可见
- 第 1 章标题"核心心智模型"改为"五个底层认知" [V] git diff 可见
- 新建 `.claude/skills/handoff/SKILL.md` 项目级 handoff skill [V] ls 确认
- handoff skill 已安装到 `~/.claude/skills/handoff/` [V] ls 确认
- 第 6 章社区 skill 一节已更新为引用本指南附赠 skill [V] 内容已确认
- 第 7 章会话循环中 HANDOFF 加载说明已更新 [V] 内容已确认
- 所有修改未 commit，等待本次 handoff 提交 [V] git status

## 3. 决策与理由

- **用 `[HANDOFF.md](HANDOFF.md)` 链接而不是 `@HANDOFF.md`**：Markdown 链接更自然，Claude 同样能识别并加载 [V]——CLAUDE.md 实践已验证
- **.handoffs/ 进 git**：交接历史本身值得版本控制，可追溯 [V]——删掉 .gitignore 条目即可
- **handoff skill 放在项目 .claude/ 下**：随项目进 git，其他贡献者也能用；装到全局是 cp 一步 [V]

## 4. 失败的尝试 — 不要再试

（无 — 本次无失败的尝试）

## 5. 已知坑

- 第 10 章保留了 CSAPP 和 Nand2Tetris 作为推荐资源，对没有硬件背景的读者可能偏硬——但这是自学 CS 社区公认的最佳路径，保留 [V]

## 6. 下一步（有序）

1. 验证所有跨章节链接是否正确（`01-core-mindset.md` 等引用）
2. 将 `chapters/index.md` 设为 README 后读者第一入口
3. （可选）加 `.github/` 目录和 issue template

## 7. 留给用户的开放问题

- 需要 push 到 remote 吗？当前只 commit 了本地。