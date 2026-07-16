---
title: Claude Code 全景
nav_order: 2
---

# Claude Code 全景：文件、记忆、模式、命令

这一章帮你画出 Claude Code 的结构图。

## 两层 `.claude` 目录

Claude Code 有两个 `.claude` 目录，作用完全不同：

| 层级 | 位置 | 作用 | 谁来写 |
|------|------|------|--------|
| **全局用户** | `~/.claude/` | 你个人所有项目通用的配置、记忆、skills | 你 |
| **项目级** | `项目/.claude/` | 这个项目专用的配置、skills、权限 | 你 |

全局 `~/.claude/` 下的关键内容：

```
~/.claude/
├── CLAUDE.md              ← 你个人的全局偏好（所有项目通用，每会话自动加载）
├── settings.json          ← 全局设置（权限、hooks、默认模式等）
├── skills/                ← 全局 skills（所有项目可用）
│   └── <skill名>/SKILL.md
├── plugins/               ← 装的插件
└── projects/              ← 各项目的会话记录 + 自动记忆
    └── <项目路径转码>/
        ├── memory/        ← 自动记忆
        │   ├── MEMORY.md
        │   └── 各种主题.md
        └── <会话id>.jsonl ← 会话记录
```

项目级 `.claude/` 下的关键内容：

```
项目/
├── CLAUDE.md              ← 项目约定（团队/个人共享，进 git，每会话自动加载）
├── .claude/
│   ├── settings.local.json  ← 个人权限配置（gitignore）
│   └── skills/              ← 项目专用 skills
└── ...
```

## 那三个奇怪文件夹是什么

`~/.claude/projects/` 下有类似 `-home`、`-home-username`、`-home-username--claude` 的文件夹。这是 **Claude 把你的工作目录路径"转码"后生成的**：把所有非字母数字字符（包括 `/`）替换成 `-`。

每个文件夹 = 一个"项目"的会话记录（`.jsonl`）+ 自动记忆（`memory/`）。

**重要教训**：不要在 `~`（home 目录）直接启动 claude 做各种事，否则所有杂事和记忆都堆在一起。

## 正确的目录习惯

**特定项目**：放在 `~/projects/项目名/`，`cd` 进去再 `claude`。这样：
- 这个项目有自己的 `CLAUDE.md`、`.claude/settings.local.json`
- Claude 会给它生成独立的 `~/.claude/projects/~projects-项目名/` 记忆空间
- 和其他项目的记忆互不污染

**非特定对话**（比如查资料、问概念）：可以在 `~` 启动，但**不要在这里写真实项目代码**。

## 权限模式

模式控制 Claude 在操作之前是否需要**问你要许可**。

| 模式（界面名） | 配置值 | 一句话 | 推荐 |
|---|---|---|---|
| **Manual** | `default` | 每次改文件/跑命令都要问 | 入门必备 |
| **Accept edits** | `acceptEdits` | 改文件不问，跑外部命令还问 | 进阶可用 |
| **Plan** | `plan` | 只读不写，先出方案等你批准 | 必备 |
| **Auto** | `auto` | 有安全分类器把关，几乎不问 | 账号满足条件后用 |
| Bypass permissions | `bypassPermissions` | 完全不问，危险 | 忽略——仅在隔离容器中用 |

**怎么切换**：
- 会话中按 **`Shift+Tab`** 循环：Manual → Accept edits → Plan
- 启动时：`claude --permission-mode plan`
- 配置文件永久设定：在 `~/.claude/settings.json` 中写 `"permissions": { "defaultMode": "acceptEdits" }`

**推荐路线**：
1. 刚接触：Manual，看着每一步
2. 有点信心：Accept edits，Claude 直接改文件，你看 diff
3. 搞大改动前：先切 Plan，让 Claude 调研出方案，你批准后再执行
4. 账号满足条件：Auto，只关注方向

## 斜杠命令分级清单

Claude Code 有 50+ 个斜杠命令，但新手只需要一部分。这里给**完整分级清单**，每条一句话，标"必备/进阶/忽略"。

### 必备（每天都会用）

| 命令 | 干什么 | 什么时候用 |
|---|---|---|
| `/help` | 显示所有可用命令 | 想不起来时 |
| `/clear` | 清空当前对话开始新会话（旧会话保留可恢复） | 切片完成、换方向时 |
| `/context` | 彩色网格显示上下文占用 | 觉得 Claude 变笨时先看这个 |
| `/plan` | 进入计划模式，只调研不出手 | 大改动前先看方案 |
| `/model` | 切换底层模型 | 想换更强/更省的模型 |
| `/config` | 打开设置 | 改主题、改默认模式 |

### 进阶（进日常流程后）

| 命令 | 干什么 | 什么时候用 |
|---|---|---|
| `/init` | 分析代码库生成 CLAUDE.md | 项目第一次用 Claude Code 时必用 |
| `/run` | 启动项目应用并观察 | 想眼看改动效果 |
| `/verify` | 端到端验证改动真的有效 | 准备 commit 前 |
| `/code-review` | 审查当前 diff 找 bug | 准备"出货"前 |
| `/diff` | 看未提交改动和每轮差异 | commit 前看一眼 |
| `/rewind` | 回退菜单，恢复代码/对话到之前点 | Claude 改崩了"读档" |
| `/resume` | 从会话选择器恢复之前的会话 | 接着上次没做完的做 |
| `/branch` | 从当前对话分出一个分支 | 想试不同方案又不丢原路 |
| `/rename` | 给当前会话命名 | 同时开多个会话时区分 |
| `/usage` 或 `/cost` | 看 token 用量和费用 | 关心花了多少钱 |
| `/status` | 显示当前状态（不中断回复） | 看 Claude 在干什么 |
| `/memory` | 编辑记忆文件，管理自动记忆 | 想手动调整 Claude 记住的东西 |

### 再进阶

| 命令 | 干什么 | 什么时候用 |
|---|---|---|
| `/compact` | 压缩对话为摘要释放空间 | 单会话内 context 快满（最多一次） |
| `/goal` | 设定条件 Claude 持续工作直到达成 | 大任务"直到所有测试通过" |
| `/loop` | 按间隔重复执行某提示 | 监控场景 |
| `/background` | 把当前会话转后台，释放终端 | 任务要跑很久 |
| `/fork` | 生成继承完整对话的后台子代理 | 让副手查资料不堵主会话 |
| `/skills` | 管理自定义技能 | 创建了自定义技能后 |
| `/mcp` | 管理 MCP 服务器连接 | 需要连接外部服务时 |
| `/permissions` | 管理工具权限规则 | 减少重复批准 |
| `/add-dir` | 给当前会话加额外可访问目录 | 需要访问项目外文件 |
| `/cd` | 把会话移到另一个工作目录 | 换目录干活但不退出 |
| `/export` | 导出当前对话为文本 | 保存记录 |
| `/powerup` | 终端内互动课程学 Claude Code 本身 | 新手先学完这个 |

### 目前可以忽略

`/batch`（大规模并行重构）、`/sandbox`（沙箱隔离）、`/security-review`（安全审计）、`/simplify`（只清理不找 bug）、`/ultraplan`（云端深度规划）、`/plugin`（插件管理）、`/hooks`（钩子配置）、`/agents`（子代理配置）——跑通基础流程后再按需学。

---

> **💡 Insight**
>
> 工具掌握有个反直觉规律：**用熟少量工具的人，比浅尝大量工具的人产出高**。每件工具都有"激活成本"——你要记得它、判断该不该用、用错了还要回退。10 个用熟的命令 + 1 个清晰的 CLAUDE.md，比 50 个半生不熟的命令 + 空白 CLAUDE.md 强得多。先 `/powerup` 学工具本身，再 `/init` 起项目，是新手最该走的两步。