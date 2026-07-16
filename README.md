# 业余开发者 Vibe Coding 完全指南

> 为硬件工程师、业余编程学习者量身定制的 Claude Code 实战指南。基于 Anthropic 官方文档、GitHub 社区实践、Hacker News、Martin Fowler / Simon Willison / Nolan Lawson 等从业者博客整合。

如果你是**懂硬件但不熟软件、想用 Claude Code 做点东西、却总在项目做到一半流产**的人——这份指南是写给你的。

## 这份指南解决什么

很多业余开发者用 Claude Code 的真实循环是：

> 不懂代码 → 不会选 Skills/MCP → Claude 没好 skill 指导 + 自己水平差 → 笨上加笨 → 项目报废 → 依然不懂代码 → 0 产出

本指南针对这个死循环的每一环给出可执行的破解方法。

## 它和网上其他 Claude Code 教程的区别

- **不假设你会写代码**：每一步都带"你该对 Claude 说什么"的具体对话措辞，可复制粘贴
- **区分官方功能 vs 社区约定**：清楚标注哪些是 Claude Code 官方支持（如 CLAUDE.md 自动加载）、哪些是社区实践（如 HANDOFF.md，不会自动加载）——避免把社区约定当官方功能
- **纠正常见误区**：例如"learning mode"其实是第三方插件不是官方功能、装太多 Skills 会变笨有官方硬指标（skill 列表 = 上下文 1%）
- **给出学习路径**：不只是"怎么用工具"，还有"怎么真的学到东西"——6 个月可量化里程碑

## 目录

1. 核心心智模型（上下文窗口、切片、主动维护、agent 边界、DRI）
2. Claude Code 全景：文件、记忆、模式、命令
3. 记忆体系深潜（Auto Memory / CLAUDE.md / Skills 怎么协作）
4. 项目启动：第一个 30 分钟
5. Git + GitHub 从零（PAT 认证、push 流程、clone vs 只读、License 合规）
6. CLAUDE.md 正确用法与交接文档实践（官方 vs 民间 skill）
7. 会话管理：/clear /compact /resume 与收工开工措辞
8. Skills 与 MCP 生态：选/装/评/换全流程
9. Bug 螺旋逃生与 Rebuild vs Patch 决策框架
10. 学习路径：6 个月里程碑 + 避免"只让 Claude 写"
11. 防流产清单与行动起步

## 快速开始

**读两遍**：尤其第 9 章（Bug 螺旋，业余项目流产的直接根因）和第 10 章（学习路径）。

**如果你完全不懂 Git**：从第 5 章开始，它从"git 命令在对话框还是终端"讲起。

**如果你已经在用 Claude Code 但总卡住**：直接跳第 9 章，看你之前的失败模式怎么被官方文档直接命名。

## 文件

- [`vibe-coding-guide-v2.md`](./vibe-coding-guide-v2.md) — **当前版本，权威来源**（约 2000 行）
- [`vibe-coding-guide.md`](./vibe-coding-guide.md) — 第一版（已过时，保留作历史参考）

## 这份指南本身是怎么写的

它按自己教的方法写成——分切片、每段验证、避免单次大输出。过程中还踩过一次坑：误把 `git init` 跑在 home 根目录，但因为在 push 前发现，删 `.git` 就全清了。这恰好演示了指南里"未 push 的错误完全可逆"原则。这个教训也写进了指南。

## 贡献

这是一份活文档。如果你按这套方法跑通了第一个项目，欢迎回来反馈哪里有用、哪里没用。开 issue 或 PR 都行。

## License

本指南内容采用 [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) 许可——你可以自由分享和改编，只需注明来源。

## 参考来源

指南的所有主张都带 URL 来源，集中在文末"参考来源"一节。权威来源包括：

- Anthropic 官方文档（code.claude.com/docs/en/）
- Pro Git 中文版、GitHub Docs
- TeachYourselfCS、Nand2Tetris、CSAPP
- Martin Fowler、Simon Willison、Nolan Lawson 等从业者博客
- Hacker News、Reddit 社区讨论
