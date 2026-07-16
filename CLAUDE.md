# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 仓库性质

这是一个**纯文档仓库**，不是代码项目。内容是《业余开发者 Vibe Coding 完全指南》，面向业余编程学习者。没有源代码、没有构建系统、没有测试。

## 文件结构

```
chapters/
├── index.md                  # 目录 + 快速开始
├── 01-core-mindset.md        # 五个底层认知
├── 02-claude-code-overview.md # Claude Code 全景
├── 03-memory-system.md       # 记忆体系深潜
├── 04-project-startup.md     # 项目启动：第一个 30 分钟
├── 05-git-github.md          # Git + GitHub 从零
├── 06-claude-md-handoff.md   # CLAUDE.md 与交接文档实践
├── 07-session-management.md  # 会话管理
├── 08-skills-mcp.md          # Skills 与 MCP 生态
├── 09-bug-spiral.md          # Bug 螺旋逃生
├── 10-learning-path.md       # 学习路径
├── 11-checklist.md           # 防流产清单
└── references.md             # 参考来源
```

- [HANDOFF.md](HANDOFF.md) — 跨会话交接文档（见下方"交接文档"一节）
- [README.md](README.md) — 项目门面

## 交接文档（HANDOFF.md）

[HANDOFF.md](HANDOFF.md) 是跨会话交接文档，记录当前状态、死路、下一步、开放问题。它不是 Claude Code 官方功能，但通过此处的链接引用，Claude 会识别并加载它。

HANDOFF.md 的格式约定（更新时遵守）：
- 每条陈述标 `[V]`（已验证）或 `[?]`（待复核）
- 头部带 Git HEAD SHA，用于开工会话复核 [V] 项是否还成立
- 目标 ≤250 行，400 硬上限
- 裁剪顺序：先删叙事 → 压缩 Decisions → **永不裁剪** Failed approaches / Known traps / Verified state / Next steps
- 会话末尾更新时：替换 + 归档（旧文件移到 `.handoffs/时间戳-handoff.md`）+ 死路前向搬运标 [?]

`.handoffs/` 归档目录进 git，记录每次交接的完整历史；只有当前 `HANDOFF.md` 是活跃的，旧文件在 `.handoffs/` 里可追溯。


## 常用操作

由于是纯文档仓库，没有 build/lint/test 命令。日常操作就是编辑 `.md` 文件。

- 预览文档：直接用 VS Code 的 Markdown 预览
- 查看行数/章节结构：`wc -l chapters/*.md`
- 写入大文档时分段追加（避免单次响应过大触发连接中断）：用 Edit 工具逐章 append，每次写一章即验证

## 文档结构（big picture）

指南共 11 章 + 参考来源，章节之间是递进关系，不是并列：

1. 五个底层认知 — 奠基（上下文窗口、切片、主动维护、agent 边界、DRI）
2-7. 操作层 — 文件/记忆体系、项目启动、Git/GitHub、CLAUDE.md/HANDOFF 实践、会话管理
8-9. 风险层 — Skills/MCP 生态、Bug 螺旋逃生
10-11. 学习与防流产 — 6 个月里程碑、行动清单

修改文档时遵循的关键原则：
- 每条主张要么有官方文档 URL 支撑，要么标注为社区实践/推论。不编造。
- "官方功能" vs "社区约定" 必须明确区分（例如 HANDOFF.md/TODO.md 不是 Claude Code 官方功能，要讲清这个边界）。
- 对话措辞示例（用户该对 Claude 说什么）放在代码块里，方便用户复制粘贴。
- 每章结尾的 `> **💡 Insight**` 块是教育性总结，保持这个模式。

## 协作约定

- 用简体中文写作，不混入日语等其他语言
- 面向业余编程初学者读者——所有解释要落到"他看得懂"的粒度
- 修改指南后，如果推翻了已有结论，同步更新相关章节，不要留下自相矛盾的内容