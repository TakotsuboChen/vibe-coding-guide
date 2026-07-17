# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 仓库性质

这是一个**文档仓库**，用 [Docusaurus](https://docusaurus.io/) 构建静态站点。内容是《业余开发者 Vibe Coding 完全指南》，面向业余编程学习者。

## 开始工作前

1. 先读 [HANDOFF.md](HANDOFF.md) — 当前会话的状态快照，记录了目标、已验证状态、死路和下一步。
2. 本项目默认调用 [说人话技能](.claude/skills/shuorenhua/SKILL.md) 对所有中文输出去 AI 味。规则：
   - 所有面向用户的文本（解释、回复、文档修改建议、Insights 等）自动去除模板感、收束腔、虚假主语、语域混搭和表演性技术腔
   - 保护范围：数字、版本号、命令、报错信息、URL、术语、责任主体等事实片段不因改写而丢失
   - 例外：代码块内的技术注释、文件名、路径、命令输出等不适用改写
   - 无需每次手动说"说人话"——除非明确要求"正式一点"或"保留当前风格"

## 技术栈

- **框架**：Docusaurus 3.x (React)
- **构建**：Node.js 18+，`npm run build`
- **部署**：GitHub Pages（`.github/workflows/deploy.yml`），push 到 main 后自动构建发布

## 常用命令

```bash
npm start       # 本地开发服务器（热重载）
npm run build   # 生产构建，输出到 build/
npm run serve   # 本地预览构建结果
```

## 文件结构

```
docs/                           # 文档内容（Markdown）
├── index.md                    # 目录 + 快速开始
├── core-mindset.md             # 五个底层认知
├── claude-code-overview.md     # Claude Code 全景
├── memory-system.md            # 记忆体系深潜
├── project-startup.md          # 项目启动：第一个 30 分钟
├── git-github.md               # Git + GitHub 从零
├── claude-md-handoff.md        # CLAUDE.md 与交接文档实践
├── session-management.md       # 会话管理
├── skills-mcp.md               # Skills 与 MCP 生态
├── bug-spiral.md               # Bug 螺旋逃生
├── learning-path.md            # 学习路径
├── checklist.md                # 防流产清单
└── references.md               # 参考来源
src/                            # 自定义页面和样式
├── pages/
│   ├── index.tsx               # 首页（Landing Page）
│   └── index.module.css        # 首页样式
├── css/
│   └── custom.css              # 全局自定义样式
└── theme/
    └── themeConfig.ts
.claude/skills/                  # 项目级技能
├── handoff/SKILL.md            # 交接 skill
└── shuorenhua/SKILL.md         # 说人话 skill
HANDOFF.md                      # 跨会话交接文档
README.md                       # 项目门面
sidebars.ts                     # 侧边栏配置
docusaurus.config.ts            # Docusaurus 配置
```

## 文档写作原则

指南共 11 章 + 参考来源，章节之间是递进关系，不是并列：

1. 五个底层认知 — 奠基（上下文窗口、切片、主动维护、agent 边界、DRI）
2-7. 操作层 — 文件/记忆体系、项目启动、Git/GitHub、CLAUDE.md/HANDOFF 实践、会话管理
8-9. 风险层 — Skills/MCP 生态、Bug 螺旋逃生
10-11. 学习与防流产 — 6 个月里程碑、行动清单

修改时要遵循：
- 每条主张要么有官方文档 URL 支撑，要么标注为社区实践/推论。不编造。
- "官方功能" vs "社区约定" 必须明确区分（例如 HANDOFF.md/TODO.md 不是 Claude Code 官方功能，要讲清这个边界）。
- 对话措辞示例（用户该对 Claude 说什么）放在代码块里，方便用户复制粘贴。
- 每章结尾的 `> **💡 Insight**` 块是教育性总结，保持这个模式。
- 修改后如果推翻了已有结论，同步更新相关章节，不要留下自相矛盾的内容。

## 协作约定

- 用简体中文写作，不混入日语等其他语言
- 面向业余编程初学者读者——所有解释要落到"他看得懂"的粒度
