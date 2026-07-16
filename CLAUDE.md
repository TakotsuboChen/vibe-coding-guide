# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 仓库性质

这是一个**纯文档仓库**，不是代码项目。仓库里目前有两份 Markdown 指南：

- `vibe-coding-guide.md` — 第一版（已过时，保留作历史参考）
- `vibe-coding-guide-v2.md` — 重构版（当前版本，权威来源）
- `HANDOFF.md` — 跨会话交接文档（见下方"交接文档"一节）
- `README.md` — 项目门面

内容是《业余开发者 Vibe Coding 完全指南》，面向硬件工程师业余学编程的读者。没有源代码、没有构建系统、没有测试。

## 交接文档（HANDOFF.md）

`HANDOFF.md` **不是 Claude Code 官方功能，不会自动加载**。它是社区约定。要使用它：

- **会话开头**：对 Claude 说"读一下 HANDOFF.md，按头部 Git HEAD 复核本文件"——Claude 会读取并验证 [V] 项是否还成立
- **会话末尾**：对 Claude 说"更新 HANDOFF.md"——按指南第 7.7 节的措辞，替换 + 归档（旧文件移到 `.handoffs/时间戳-handoff.md`）+ 死路前向搬运标 [?]

HANDOFF.md 的格式约定：
- 每条陈述标 `[V]`（已验证）或 `[?]`（待复核）
- 头部带 Git HEAD SHA，用于开工会话复核
- 目标 ≤250 行，400 硬上限
- 裁剪顺序：先删叙事 → 压缩 Decisions → **永不裁剪** Failed approaches / Known traps / Verified state / Next steps

`.handoffs/` 归档目录已在 `.gitignore` 里，不进 git；只有当前 `HANDOFF.md` 进 git。

## 常用操作

由于是纯文档仓库，没有 build/lint/test 命令。日常操作就是编辑 `.md` 文件。

- 预览文档：直接用 VS Code 的 Markdown 预览，或 `code vibe-coding-guide-v2.md`
- 查看行数/章节结构：`wc -l vibe-coding-guide-v2.md` + `grep "^## " vibe-coding-guide-v2.md`
- 写入大文档时分段追加（避免单次响应过大触发连接中断）：用 Edit 工具逐章 append，每次写一章即验证

## 文档结构（big picture）

`vibe-coding-guide-v2.md` 是一份 11 章的系统性指南，章节之间是**递进关系**，不是并列：

1. 核心心智模型 — 奠基（上下文窗口、切片、主动维护、agent 边界、DRI）
2-7. 操作层 — 文件/记忆体系、项目启动、Git/GitHub、CLAUDE.md/HANDOFF 实践、会话管理
8-9. 风险层 — Skills/MCP 生态、Bug 螺旋逃生
10-11. 学习与防流产 — 6 个月里程碑、行动清单

修改文档时遵循的关键原则：
- 每条主张要么有官方文档 URL 支撑，要么标注为社区实践/推论。不编造。
- "官方功能" vs "社区约定" 必须明确区分（例如 HANDOFF.md/TODO.md 不是 Claude Code 官方功能，要讲清这个边界）。
- 对话措辞示例（用户该对 Claude 说什么）放在代码块里，方便用户复制粘贴。
- 每章结尾的 `★ Insight` 块是教育性总结，保持这个模式。

## 协作约定

- 用简体中文写作，不混入日语等其他语言
- 用户是硬件工程师、业余编程学习者——所有解释要落到"他看得懂"的粒度，带硬件类比
- 修改指南后，如果推翻了已有结论，同步更新相关章节，不要留下自相矛盾的内容
- `vibe-coding-guide.md`（v1）已过时，不要在它上面改，所有更新进 v2
