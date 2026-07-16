# 业余开发者 Vibe Coding 完全指南（重构版）

> 为硬件工程师、业余编程学习者量身定制。基于 Anthropic 官方文档、GitHub 社区实践、Hacker News、Reddit、Martin Fowler / Simon Willison / Nolan Lawson 等从业者博客、TeachYourselfCS 等学习路径权威来源整合。
>
> 编写日期：2026-07-16
>
> 这份指南本身就是按它教你的方法写的——分切片、每段验证、避免单次大输出。它不是一次写完的完美文档，而是可以随你经验增长而更新的活文档。

---

## 目录

1. [核心心智模型](#1-核心心智模型)
2. [Claude Code 全景：文件、记忆、模式、命令](#2-claude-code-全景文件记忆模式命令)
3. [记忆体系深潜](#3-记忆体系深潜)
4. [项目启动：第一个 30 分钟](#4-项目启动第一个-30-分钟)
5. [Git + GitHub 从零](#5-git--github-从零)
6. [CLAUDE.md 正确用法与交接文档实践](#6-claudemd-正确用法与交接文档实践)
7. [会话管理：clear-compact-resume-与收工开工措辞](#7-会话管理clearcompactresume-与收工开工措辞)
8. [Skills 与 MCP 生态：选装评换全流程](#8-skills-与-mcp-生态选装评换全流程)
9. [Bug 螺旋逃生与 Rebuild vs Patch](#9-bug-螺旋逃生与-rebuild-vs-patch)
10. [学习路径：6 个月里程碑](#10-学习路径6-个月里程碑)
11. [防流产清单与行动起步](#11-防流产清单与行动起步)

---

## 1. 核心心智模型

在讲任何操作之前，先建立五个会贯穿全文的心智模型。理解这五点，比记住任何命令都重要。

### 1.1 上下文窗口是首要约束

Claude Code 的"记忆"叫**上下文窗口（context window）**。2026 年的模型普遍有 200K-1M tokens 的窗口，但**关键不是上限，而是性能曲线**：200-300K 之后，几乎所有模型都会出现明显的性能下降——开始忘事、变慢、答非所问。

所以"1M 上下文"不等于"可以塞到 1M 再管"。正确的心智是：**把上下文当成稀缺资源，主动管理，而不是等到爆了再补救**。官方文档把这一点说得直白：上下文窗口是你需要管理的最重要资源，LLM 性能随着上下文填满而退化。

硬件类比：这和你硬件开发时的"工作内存"一样——你的脑子同时能记住的东西有限，项目越大越容易顾此失彼。整个指南的核心都是围绕怎么管理这个窗口展开的。

### 1.2 交付能跑的切片，而不是零 bug 的完美代码

软件从来不是"没有 bug"才发布的。所有你正在用的软件都有几千个已知 bug。发布标准是"对用户来说够好"，不是"无 bug"。

**切片（slice）** = 一条从头到尾打通、用户能感知到价值的窄功能。

- 错误做法：先写完所有数据库层 → 再写完所有后端 → 再写前端。这是分层。每层写完之前你没有任何能用的东西，中间任何一刻停下来项目就流产了。
- 正确做法：做一个能跑的版本——一个输入框、一个按钮、点一下能存数据、能显示出来。丑、简陋，但从头到尾通了。

硬件类比：你不会因为 PCB 上还有可优化的走线就永远不投板。投板标准是"满足规格书"。Vibe coding 也一样——**目标是能用的切片，不是完美的代码**。

### 1.3 主动维护 > 自动魔法

你之前失败的一个核心根因，是期望 Claude Code 像数据库一样自动同步状态。真相是：

- CLAUDE.md **不会**自动更新，必须你主动说"更新它"或用 `/init`
- HANDOFF.md、TODO.md **不是** Claude Code 官方功能，不会自动加载，必须你主动让 Claude 读/写
- Claude Code **不会**帮你自动找 Skills 和 MCP
- Claude Code **不会**主动 commit/push/写文档/做 code review——这些都是"对外有副作用"或"需要你判断"的动作，是安全设计，不是它懒

**这套体系的运转，靠的是你主动维护的几个文件 + 几个机械习惯，而不是任何"自动魔法"。** 好消息是：这些习惯不依赖代码能力，纯是纪律，业余开发者完全可以做到。

### 1.4 "做什么"你驱动，"怎么做"Claude 自主

这是理解 Claude Code 的关键。Claude Code 是一个 **agent（代理）**，不是问一句答一句的聊天机器人。它的 agentic loop 是：

```
你告诉它"做什么" → 它自主决定"怎么做"（读哪些文件、改什么、跑什么）→ 反复循环直到任务完成
     （你驱动）                （它自主）
```

**它会自动做的事**：
- 改完代码后自动跑测试/编译确认没坏（agentic loop 的一部分）
- 读文件、搜索、跑只读 shell 命令（看上下文）
- 遇到模糊的地方停下来问你
- 自动保存会话、自动建检查点（`/rewind` 可回退）
- 上下文快满时自动压缩
- 发现你的偏好/模式时，自动写进 Auto Memory

**它不会自动做的事**（必须你触发）：
- git commit / push（安全设计）
- 创建/更新 CLAUDE.md（只有你说了或 `/init` 才做）
- 启动 app（`/run` 或你说"跑起来"才做）
- 端到端验证（`/verify` 要手动）
- code review（`/code-review` 要手动）
- 装 Skills/MCP、改配置

一句话：**Claude 自主执行"怎么做"，但"做什么"和"什么时候算完成"由你驱动**。

### 1.5 你是 DRI（直接负责人）

Simon Willison（Anthropic 外部但被广泛引用的从业者）的一句话值得刻在脑子里：**"智能体永远不应被视为项目的 DRI（Directly Responsible Individual）。"**

不管 Claude 写得多快多好，**你对每一行发布出去的代码负责——不只是你自己写的行，还有 AI 生成的行**。这意味着你必须能看懂、能解释、能改它写的代码。这个心智模型直接决定了第 10 章的学习路径——如果只是让 Claude 写、你不理解，项目表面在推进，你在失血。

`★ Insight ─────────────────────────────────────`
这五个心智模型是递进的：上下文管理是"怎么用工具"，切片是"怎么拆任务"，主动维护是"怎么不留失忆点"，agent 边界是"怎么和工具分工"，DRI 是"怎么对自己负责"。前四个是操作层，第五个是身份层。你之前失败的根因，操作层和身份层都有——既没管理上下文/切片，也默认了"Claude 写的我就不用懂"。重构版的后续章节，都是围绕怎么同时修这两层展开的。
`─────────────────────────────────────────────────`

---

## 2. Claude Code 全景：文件、记忆、模式、命令

这一章解决你"对各种东西都没整体认知"的困惑。读完你应该能在脑子里画出一张 Claude Code 的结构图。

### 2.1 两层 `.claude` 目录

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
├── plugins/               ← 装的插件（如 learning-output-style）
└── projects/              ← 各项目的会话记录 + 自动记忆
    └── -home-takotsubo/  ← 你在 ~ 启动 claude 时的项目空间
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

### 2.2 那三个奇怪文件夹是什么

你看到 `~/.claude/projects/` 下有 `-home`、`-home-takotsubo`、`-home-takotsubo--claude` 三个文件夹。这是 **Claude 把你的工作目录路径"转码"后生成的**：把所有非字母数字字符（包括 `/`）替换成 `-`。

- `-home` ← 工作目录是 `/home`
- `-home-takotsubo` ← 工作目录是 `/home/takotsubo`
- `-home-takotsubo--claude` ← 工作目录是 `/home/takotsubo/.claude`

每个文件夹 = 一个"项目"的会话记录（`.jsonl`）+ 自动记忆（`memory/`）。

**这暴露了你之前的一个坏习惯**：你在 `~`（即 `/home/takotsubo`）直接启动 claude 做各种事，导致所有杂事和记忆都堆在 `-home-takotsubo` 下，混在一起。

### 2.3 正确的目录习惯

**特定项目**：放在 `~/projects/项目名/`，`cd` 进去再 `claude`。这样：
- 这个项目有自己的 `CLAUDE.md`、`.claude/settings.local.json`
- Claude 会给它生成独立的 `~/.claude/projects/-home-takotsubo-projects-项目名/` 记忆空间
- 和其他项目的记忆互不污染

**非特定对话**（比如查资料、问概念）：可以在 `~` 启动，但**不要在这里写真实项目代码**。

### 2.4 权限模式（你问的 auto/plan/其他）

这是你最先需要理解的概念。模式控制 Claude 在操作之前是否需要**问你要许可**。

| 模式（界面名） | 配置值 | 一句话 | 业余开发者推荐 |
|---|---|---|---|
| **Manual** | `default` | 每次改文件/跑命令都要问 | 入门必备 |
| **Accept edits** | `acceptEdits` | 改文件不问，跑外部命令还问 | 进阶可用 |
| **Plan** | `plan` | 只读不写，先出方案等你批准 | 必备 |
| **Auto** | `auto` | 有安全分类器把关，几乎不问 | 账号满足条件后用 |
| Bypass permissions | `bypassPermissions` | 完全不问，危险 | 忽略——仅在隔离容器中用 |

**你现在用的是 auto mode**——这是有安全分类器把关的较自由模式，不是所有账号都有，需要较新的模型。它让你少打断，但代价是 Claude 可能自己做了你不知道的操作。如果你不放心，切到 Accept edits 或 Manual。

**怎么切换**：
- 会话中按 **`Shift+Tab`** 循环：Manual → Accept edits → Plan
- 启动时：`claude --permission-mode plan`
- 配置文件永久设定：在 `~/.claude/settings.json` 中写 `"permissions": { "defaultMode": "acceptEdits" }`

**推荐路线**：
1. 刚接触：Manual，看着每一步
2. 有点信心：Accept edits，Claude 直接改文件，你看 diff
3. 搞大改动前：先切 Plan，让 Claude 调研出方案，你批准后再执行
4. 账号满足条件：Auto，只关注方向

### 2.5 斜杠命令分级清单

Claude Code 有 50+ 个斜杠命令，但业余开发者只需要一部分。这里给**完整分级清单**，每条一句话，标"必备/进阶/忽略"。

**必备（每天都会用）**

| 命令 | 干什么 | 什么时候用 |
|---|---|---|
| `/help` | 显示所有可用命令 | 想不起来时 |
| `/clear` | 清空当前对话开始新会话（旧会话保留可恢复） | 切片完成、换方向时 |
| `/context` | 彩色网格显示上下文占用 | 觉得 Claude 变笨时先看这个 |
| `/plan` | 进入计划模式，只调研不出手 | 大改动前先看方案 |
| `/model` | 切换底层模型 | 想换更强/更省的模型 |
| `/config` | 打开设置 | 改主题、改默认模式 |

**进阶（进入日常流程后）**

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

**再进阶**

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

**目前可以忽略**

`/batch`（大规模并行重构）、`/sandbox`（沙箱隔离）、`/security-review`（安全审计）、`/simplify`（只清理不找 bug）、`/ultraplan`（云端深度规划）、`/plugin`（插件管理）、`/hooks`（钩子配置）、`/agents`（子代理配置）——等你跑通基础流程、手感建立后再按需学。

`★ Insight ─────────────────────────────────────`
工具掌握有个反直觉规律：**用熟少量工具的人，比浅尝大量工具的人产出高**。每件工具都有"激活成本"——你要记得它、判断该不该用、用错了还要回退。10 个用熟的命令 + 1 个清晰的 CLAUDE.md，比 50 个半生不熟的命令 + 空白 CLAUDE.md 强得多。这就像你焊台再多，不如把一台风台和烙铁用熟。先 `/powerup` 学工具本身，再 `/init` 起项目，是新手最该走的两步。
`─────────────────────────────────────────────────`

---

## 3. 记忆体系深潜

这是你最大的困惑之一："memory 下面有好多个 md 不止 MEMORY.md，你都没讲清楚"。这一章把整个记忆体系讲透。

### 3.1 记忆目录的实景结构

以你当前环境为例，`~/.claude/projects/-home-takotsubo/memory/` 下实际是这样：

```
~/.claude/projects/-home-takotsubo/memory/
├── MEMORY.md                       # 索引文件（入口，每会话自动加载前 200 行/25KB）
├── language-preference.md          # 主题文件（按需读取，不自动加载）
├── user-profile.md                 # 主题文件
├── collaboration-style.md          # 主题文件
├── env-setup-decisions.md          # 主题文件
├── no-real-name.md                 # 主题文件
├── proxy-backend-setup.md         # 主题文件
├── wsl-mirrored-network-constraints.md  # 主题文件
└── ask-with-guided-options.md      # 主题文件
```

**它们是什么**：这是 Claude Code 的**自动记忆（Auto Memory）**系统。Claude 在会话中自己写笔记，按主题分成多个 .md 文件。

**谁写的**：Claude 自动写的。你不需要手动创建任何文件。Claude 在对话中判断"这个信息将来有用"，然后自己写进这些文件。

**为什么按主题分**：因为 `MEMORY.md` 有大小限制——每次会话只加载前 200 行或 25KB（先到为准）。所以 Claude 的策略是：`MEMORY.md` 只放**简短索引**（每行一条链接），详细内容放到主题文件里。主题文件不会被自动加载到上下文，只有 Claude 需的时候才去读。

**主题文件的格式**：每条记忆文件开头有 YAML frontmatter，包含 `name`、`description`、`metadata`（记录了创建该记忆的会话 ID）。这让 Claude 知道这条记忆是什么、来自哪个会话。

### 3.2 "自动记忆"到底什么时候触发？为什么很少触发？

你的体感是对的：Claude 确实很少自动记忆。原因是 **Claude 对"什么值得记住"非常挑剔**。官方文档原话：

> Claude doesn't save something every session. It decides what's worth remembering based on whether the information would be useful in a future conversation.

所以不是你关了它，而是 Claude 的"值得记"标准很高。自动记忆默认是开启的。

### 3.3 怎么让 Claude 一定记住？（关键技能）

**主动说"记住"**。Claude 对"记住"这个指令很敏感，你一说它就会写记忆文件。

**对话措辞示例**（直接复制使用）：

| 你想存什么 | 对 Claude 说的话 |
|---|---|
| 你的身份 | "记住我是硬件工程师，软件开发是业余爱好，想边写边学。" |
| 技术栈偏好 | "记住我偏好前沿高性能技术栈，比如 Rust、Go、Bun。" |
| 协作风格 | "记住写代码时要讲解，不要只丢代码给我，我需要学到东西。" |
| 语言偏好 | "记住全程用简体中文，不要混入日语。" |
| 工具偏好 | "记住不要用 yarn，我全程用 pnpm。" |

### 3.4 验证是否记住了

运行 `/memory` 命令。它会列出所有已加载的 CLAUDE.md 文件、规则文件，同时提供一个链接打开 auto memory 文件夹。

### 3.5 五大机制对比表

这是你"搞不清谁是谁"的根因。一次性把五样东西的定位讲清：

| 机制 | 谁写 | 谁读 | 什么时候用 | 加载时机 |
|---|---|---|---|---|
| **Auto Memory**（`~/.claude/projects/.../memory/`） | Claude 自动写 | Claude 自动读 | Claude 发现的偏好、构建命令、调试技巧 | MEMORY.md 前 200 行/25KB 每会话加载；主题文件按需读 |
| **CLAUDE.md** | 你写 | Claude 读 | 给 Claude 的持久指令：编码规范、构建命令、项目架构 | 每会话完整加载 |
| **HANDOFF.md** | **不是官方功能**，你或 Claude 写（需你触发） | Claude 读（需你让它读） | 跨会话交接当前状态 | **不会自动加载**，必须你主动让 Claude 读 |
| **TODO.md** | **不是官方功能**，你或 Claude 写 | Claude 读（需你让它读） | 待办清单 | **不会自动加载** |
| **Skills（SKILL.md）** | 你写 | 你或 Claude 按需调用 | 可复用工作流 | 描述每会话加载（约 450 tokens）；完整内容只在调用时加载 |

**关键纠正**：HANDOFF.md 和 TODO.md **不是** Claude Code 的官方功能。它们是社区/其他 AI 工具（如 Cursor）的约定。Claude Code 官方只自动加载 CLAUDE.md 和 Auto Memory。如果你写了一个 HANDOFF.md，**Claude 不会自动读它**——你必须在会话开头说"读 HANDOFF.md"或用 `@HANDOFF.md` 语法导入。

第 6 章会讲怎么用社区 skill（如 ostikwhy-blip）让 HANDOFF.md 半自动化。

### 3.6 MEMORY.md 索引文件怎么工作

看你的 `MEMORY.md` 就明白了：

```markdown
# 记忆索引

- [语言偏好](language-preference.md) — 全中文约定（含不混入日语等语言的原则）
- [用户画像](user-profile.md) — 硬件工程师，业余开发，想在 vibe coding 中学习
- [协作风格](collaboration-style.md) — 边写边讲、风险操作每次确认、全中文含 commit
```

**格式规则**：
- 每行一条记忆，用 Markdown 列表 `- [标题](文件名.md) — 一句话摘要`
- 文件路径是相对于 `memory/` 目录的相对路径
- 每条记忆文件本身有 YAML frontmatter

**工作流程**：
1. 会话启动时：Claude 读取 `MEMORY.md` 的前 200 行（或 25KB），加载到上下文
2. 会话进行中：Claude 通过索引知道每条记忆在哪个文件，需要时读具体文件
3. Claude 想记新东西时：先写主题文件（如 `user-profile.md`），然后在 `MEMORY.md` 末尾加一行索引

**你能手动编辑吗**：能。官方文档明确说自动记忆文件是普通 markdown，你可以随时编辑或删除。你可以直接用 VS Code 打开编辑，或删除某一行索引来"遗忘"那条记忆。

### 3.7 跨项目的全局记忆 vs 项目级记忆

**记忆是按项目隔离的**。每个项目有自己的 `~/.claude/projects/<项目>/memory/`。

`<项目>` 怎么确定：
- 如果在 git 仓库里：用仓库标识
- 如果不在 git 仓库里：用项目根目录路径

| 你在哪启动 claude | 记忆堆在哪 |
|---|---|
| `~`（非 git 仓库） | `~/.claude/projects/-home-takotsubo/memory/` |
| `~/projects/xxx`（是 git 仓库） | `~/.claude/projects/-home-takotsubo-projects-xxx/memory/` 或按 git repo 标识 |

**全局记忆不存在**——没有"在所有项目间共享的自动记忆"。如果你想让 Claude 在所有项目都知道你的身份，把它写进 `~/.claude/CLAUDE.md`（用户级 CLAUDE.md，每会话自动加载）。

**记忆是机器本地的**——不会自动同步到别的机器或云端。

### 3.8 记忆会不会失效、过期？怎么删？

**不会自动过期**。Claude 写入的记忆文件会一直保留。但有隐性失效风险：
- 如果 `MEMORY.md` 超过 200 行，后面的行不会被自动加载
- 如果多条记忆互相矛盾，Claude 可能随机选一个
- 如果记忆内容过时（你换技术栈了），Claude 不知道它过时了

**删一条错的记忆**：
- 方法一（对话里说）："忘掉我之前说的'用 yarn'那条记忆，把它从记忆里删掉。"
- 方法二（手动编辑）：直接打开对应主题文件删除，并删 `MEMORY.md` 里那行索引
- 方法三（`/memory` 命令）：运行 `/memory`，选择 auto memory 文件夹，编辑或删除

### 3.9 你的"一步到位"配置建议

**想让所有项目都知道你**：把关键身份信息写进 `~/.claude/CLAUDE.md`。对 Claude 说：

> "把以下内容加到 ~/.claude/CLAUDE.md：我是硬件工程师，业余开发，想边写边学。偏好前沿高性能技术栈。全程用简体中文，不要混入日语。"

**项目级偏好**：在该项目目录里对 Claude 说"记住 X"，Claude 会写进该项目的 memory。

`★ Insight ─────────────────────────────────────`
记忆体系的设计哲学是"分层 + 按需"：稳定的、每次都要知道的（CLAUDE.md）每次全量加载；易变的、工作中发现的（Auto Memory）只加载索引，需要时再读主题文件。这就像你硬件设计时的 BOM 表 + datasheet——BOM 是每次都要看的索引，datasheet 是需要时才翻的详情。理解了这个分层，你就知道为什么 MEMORY.md 要保持简洁（否则超过 200 行后面的不被加载），也知道为什么 Claude 很少主动记忆——它只在"将来有用"时才记，避免索引膨胀。
`─────────────────────────────────────────────────`

---

## 4. 项目启动：第一个 30 分钟

这是防流产最关键的一段。你之前的困惑是"README 不会写、CLAUDE.md 不会写、TODO.md 是什么、什么时候开对话说什么"。这一章把每一步讲成"你该说什么、Claude 会做什么"。

### 4.1 核心原则：你给想法，Claude 写文件

你不会写 README、CLAUDE.md、TODO.md 没关系——**Claude 会写**。你的职责是给出模糊想法，Claude 的职责是把它变成结构化文件。你只需要在对话框里说话，不需要打开编辑器手敲。

### 4.2 30 分钟例行（修正版，每步带对话措辞）

**步骤 1：建目录 + git init（你来敲或让 Claude 跑）**

```bash
mkdir ~/projects/我的项目 && cd ~/projects/我的项目
git init
```

`git init` 是干嘛的：把一个普通文件夹变成"Git 仓库"，让 Git 开始追踪里面文件的变化历史。没 init 的文件夹，Git 当它不存在；init 之后，Git 在里面建一个隐藏目录 `.git/`，存所有版本快照。类比：普通文件夹像草稿纸，`git init` 后像装上"时光机"，每次 `commit` 存一个快照，随时能回滚。

如果你不想自己敲，可以在 Claude Code 对话框说"在 ~/projects/我的项目 初始化一个 git 仓库"，Claude 会替你跑。但第一次学建议自己敲一遍，看清输出。

**步骤 2：写 README.md（让 Claude 写，你给模糊想法）**

开 Claude Code（在项目目录里输入 `claude`），说：

> "我想做一个 [你的模糊想法，比如：给串口日志做解析的小工具]。帮我写一份 README.md，一句话说清楚这东西要干嘛。我现在想法还很模糊，你先按你理解的写，我看再改。"

Claude 会用 Write 工具直接给你创建 `README.md`。你看了觉得不对，就说"不是这个意思，我想要的是 X"，它会改。

**步骤 3：写 CLAUDE.md（让 Claude 写）**

接着说：

> "再帮我写一份 CLAUDE.md，包含：项目目标、技术栈选择（我 Python 不熟，你推荐入门友好的）、第一个最小切片的目标、编码约定。我水平是业余初学者，你按这个定位写。"

**注意**：这里不是 `/init`——`/init` 是分析已有代码库生成 CLAUDE.md，适合项目跑起来之后用。**空文件夹起步时，直接让 Claude 帮你写 CLAUDE.md**，比 `/init` 更合适。

**步骤 4：写 TODO.md（让 Claude 写）**

> "再写一份 TODO.md，把我脑子里'以后想做'的想法全倒进去。我现在脑子里有这些想法：[随便列，哪怕不成句]。你帮我整理成分级 TODO。"

**TODO.md 是什么**：一个待办清单文件。和 README（说项目是什么）不同，TODO 记"以后要做什么"。它的核心作用是**防 scope creep**——把"以后想做但不属于当前切片的想法"放进去，不立刻做，清空脑子。

**三者分工**：
- **README.md**：项目是什么（对外说明，进 git）
- **CLAUDE.md**：给 Claude 的项目约定（技术栈、编码规则、当前切片，每会话自动加载，进 git）
- **TODO.md**：以后想做什么（待办清单，不自动加载，进 git）

**步骤 5：实现最小切片（让 Claude 做）**

> "现在实现第一个最小切片——能跑、能看见的最蠢版本，丑没关系。不要一次做完所有功能，只做最窄的一条。"

**关键**：第一个切片要小到让你觉得"这太简单了吧"。想做一个博客：第一个切片 = 一个页面，能显示"Hello"，能存一篇文章标题到文件。不做用户系统、不做评论。想做一个 CLI：第一个切片 = 一个命令，跑起来能打印"hello"。

**步骤 6：亲眼看它能工作**

改完后，对 Claude 说：

> "帮我把 app 跑起来看看，用 /run"

或直接输入 `/run`。Claude 会启动 app，让你眼见为实。

**为什么不是 Claude 自动验证**：Claude 改完代码后会自动跑测试/编译确认没坏（agentic loop 的一部分），但**启动 app 看效果**需要你触发 `/run` 或说"跑起来看看"——这是你判断"切片是否真的能工作"的环节，不是 Claude 能替你决定的。

**步骤 7：git commit（让 Claude 跑或自己敲）**

> "帮我 commit 当前所有改动，提交信息按 Conventional Commits 规范自动写。"

Claude 会跑 `git add .` + `git commit -m "feat: xxx"`。如果你想自己敲（敏感操作建议自己敲一遍）：

```bash
git add .
git commit -m "feat: 实现最小切片能跑"
```

**步骤 8：更新 CLAUDE.md + 写 HANDOFF.md（让 Claude 写）**

> "更新 CLAUDE.md 的'当前进度'一节：标记第一个切片完成，写下一切片目标。同时写一份 HANDOFF.md 到项目根，记录：当前状态、下次会话第一件事、踩了什么坑。"

**注意**：HANDOFF.md 不是官方功能，Claude 不会自动读它。但下次会话开头你说"读 HANDOFF.md"，Claude 就会读。第 6 章讲怎么用社区 skill 让这步半自动化。

### 4.3 为什么这 30 分钟能防流产

流产的本质是三件事：**做了一半没有能用的东西 → 下次打开忘了在干嘛 → 不想碰了**。

这套例行直接打这三点：
- 步骤 5-6：任何时候都有能跑的东西
- 步骤 3、8：任何时候停下来都能续上（CLAUDE.md 每会话自动加载，HANDOFF.md 你让 Claude 读）
- 步骤 4：回来时不用回忆，看 TODO 就行

30 分钟后你拥有：一个能跑的东西、一个存档点、一份交接说明、一份明确清单。项目已经不会流产了。

### 4.4 关键纪律：切片要小

**第一个切片一定要小到让你觉得"这太简单了吧"**。新手最大的本能冲动是"一次做完"。这个冲动是流产的头号杀手。切片式开发反直觉——它要求你**故意只做一小部分，然后停下来**。但这是软件工程几十年验证下来的反脆弱结构：任何时候项目停住，它都是"能跑的半成品"而不是"没跑完的废墟"。硬件类比：先做出能上电点灯的最小系统，再加外设。

`★ Insight ─────────────────────────────────────`
你之前困惑"我什么时候开对话、开了说什么"——答案是：**建好目录 + git init 后，立刻在项目目录里 `claude` 开对话，第一句话就是给出你的模糊想法让 Claude 写 README + CLAUDE.md + TODO**。你不需要先写好这些文件再开对话，对话本身就是写这些文件的过程。Claude 是你的"文书"，你是"出想法的人"。这彻底反转了你之前的困惑——你以为要自己先写好文档才能开始，其实文档是和 Claude 对话的产物。
`─────────────────────────────────────────────────`

---

## 5. Git + GitHub 从零

你是业余初学者，不懂 git 也不懂 github。这一章从零讲。参考 Pro Git 中文版、GitHub Docs。

### 5.1 先回答你最困惑的三个问题

**Q1: git 命令是在 Claude Code 对话框里输入，还是另开一个终端手动敲？**

两种都行，Claude Code 本身就跑在终端里，背后能调用 Bash 执行系统命令（包括 git）：

- **方式 A（推荐新手学阶段）**：在 Claude Code 对话框用自然语言下指令，比如"帮我 commit 一下当前改动"。Claude 替你跑 `git add` + `git commit`，并把提交信息写进去。
- **方式 B（敏感操作 / 学习阶段）**：另开一个 WSL 终端标签页（VSCode 里 `Ctrl+Shift+\`` 新开终端），自己手敲 `git status`、`git log`。这样你能看清每一步发生了什么，且不会被 AI 误操作。

**实战建议**：第一次学某个命令时用方式 B 手敲一遍看输出，熟练后用方式 A 让 Claude 跑。`push`、`reset --hard`、`push -f` 这类不可逆操作，永远自己敲。

**Q2: Claude Code 会不会自动帮我跑 git？**

**默认不会自动 commit/push**。Claude Code 只会在你明确要求时执行 git 命令。它会改你的代码文件，但不会替你"存档"。这是优点——避免 AI 误把半成品推上 GitHub。

**Q3: git init 到底干嘛的？**

把一个普通文件夹变成"Git 仓库"，让 Git 开始追踪里面文件的变化历史。没 init 的文件夹 Git 当它不存在；init 之后 Git 在里面建一个隐藏目录 `.git/`，存所有版本快照。类比：普通文件夹像草稿纸，`git init` 后像装上"时光机"，每次 `commit` 存一个快照，随时能回滚。Vibe coding 时 Claude 改坏代码，你能 `git restore` 一秒回滚——这就是为什么要 init。

### 5.2 Git 是什么、为什么 vibe coding 需要它

**What**：分布式版本控制系统——在本地硬盘上给项目拍"快照"，每次提交存一个时间点，可以随时回到任意历史状态、对比差异、开分支并行实验。

**Why（不用 git 会怎样）**：
- Claude 改坏代码 → 没法回滚，只能靠记忆或备份
- 想同步到 GitHub → 没 git 就没 push
- 想借鉴开源项目 → GitHub 上几乎所有项目都是 git 仓库，不会 git 就没法 clone/读历史
- 多设备协作 → 没法同步

Vibe coding 的核心风险是"AI 一把梭改飞了"，git 是你的安全网。

### 5.3 安装与一次性配置

**安装 Git（WSL2 Debian）**：
```bash
sudo apt update && sudo apt install -y git
git --version   # 应输出 git version 2.x
```

**一次性身份配置（每台电脑只需一次）**：
```bash
git config --global user.name "Takotsubo"
git config --global user.email "你的邮箱@example.com"
```

`user.name` 用你的 handle「Takotsubo」即可（符合你的偏好，不用真名）。`user.email` 要和 GitHub 账号同一个邮箱，便于关联贡献图。

可选顺手配：
```bash
git config --global init.defaultBranch main      # 新仓库默认分支叫 main
git config --global pull.rebase false           # pull 时用 merge，新手友好
git config --global core.editor "code --wait"  # 提交信息用 VSCode 编辑
git config --global credential.helper store    # 记住 GitHub 凭据，不用每次输
```

**注册 GitHub 账号**：去 https://github.com/signup 注册。建议用户名用 `Takotsubo` 或常用 handle（公开仓库会暴露在 URL 里）。开两步验证（2FA）：Settings → Password and authentication → Two-factor authentication，强烈建议。

### 5.4 GitHub 认证：PAT vs SSH，新手用哪个

**结论：新手用 PAT（Personal Access Token）更简单**，不用管 SSH 权限坑。

| 方式 | 优点 | 缺点 | 适合谁 |
|---|---|---|---|
| **PAT** | 配置一条命令、不依赖文件权限、跨终端/WSL 稳 | 长串 token 易丢、需记过期时间 | 新手、临时 |
| **SSH key** | 一次配好永久用、不用每次输 token | 要管 `~/.ssh` 权限、WSL 偶发权限坑 | 长期重度 |

**PAT 配置（推荐新手）**：
1. GitHub: Settings → Developer settings → Personal access tokens → **Fine-grained tokens** → Generate new token
2. 选仓库权限：选 "All repositories" 或指定仓库；权限勾 `Contents: Read and write`、`Metadata: Read`（必勾）
3. 设过期时间（90 天 / 1 年）
4. 生成后**立即复制** token（页面关掉就再也看不到）
5. 第一次 `git push` 时，Git 提示输用户名/密码——把 token 粘到密码框，用户名填 GitHub 用户名
6. `git config --global credential.helper store` 让 Git 记住

**SSH 配置（进阶切换）**：
```bash
ssh-keygen -t ed25519 -C "你的邮箱@example.com"   # 一路回车
cat ~/.ssh/id_ed25519.pub                          # 复制输出
```
把输出的整行粘到 GitHub: Settings → SSH and GPG keys → New SSH key。测试：`ssh -T git@github.com`，应输出 "Hi Takotsubo! ..."。

**WSL2 特坑**：`~/.ssh` 和里面文件权限必须正确，否则 SSH 拒用：`chmod 700 ~/.ssh && chmod 600 ~/.ssh/id_* && chmod 644 ~/.ssh/*.pub`。

### 5.5 本地工作流：8 个命令

每个命令讲 What/Why/How，给"我开终端手敲"和"我对 Claude 说什么"两种方式。

| 命令 | 作用 | Claude Code 措辞 |
|---|---|---|
| `git init` | 把文件夹变成仓库（建 `.git/`） | "在当前目录初始化一个 git 仓库" |
| `git status` | 看哪些文件改了/新增/未追踪 | "看一下当前 git status" |
| `git add .` | 把改动放进暂存区（待提交清单） | "把所有改动 add 进暂存区" |
| `git commit -m "说明"` | 把暂存区打包成永久快照 | "commit 一下，信息按 Conventional Commits 自动写" |
| `git log --oneline --graph` | 看历史提交列表（紧凑带分支图） | "显示最近的 git log，紧凑模式" |
| `git diff` | 看当前还没 add 的改动 | "看一下当前所有未提交的 diff" |
| `git restore <文件>` | 丢弃这个文件里还没 commit 的改动（读档） | "把当前改动全丢弃，恢复到上次 commit" |
| `git switch -c <分支名>` | 创建并切到新分支；`git switch <名>` 切回 | "创建一个叫 xxx 的新分支并切过去" |

**一条完整的最小循环（背下来）**：
```
改代码 → git status → git add . → git status 确认 → git commit -m "feat: XXX"
```
这就是 90% 的日常。

**提交信息规范**（Conventional Commits，社区通行）：
- `feat: 添加 XXX 功能`
- `fix: 修复 YYY bug`
- `docs: 更新 README`
- `chore: 杂项`

### 5.6 GitHub 远程：建仓库、push、clone

**在 GitHub 上建仓库**：浏览器开 https://github.com/new：
- Repository name：小写连字符，如 `power-board-utils`
- Public/Private：新手建议 Private 起步，成熟了再切 Public
- **Initialize with README：如果本地已有内容，不要勾**，否则远程会有初始 commit，push 时要处理冲突
- License：开源仓库才需要选（MIT/Apache 最宽松）

**关联本地与远程**：
```bash
git remote add origin https://github.com/Takotsubo/项目名.git
git remote -v   # 验证
```

**push（本地推到远程）**：
```bash
git push -u origin main   # 第一次 push，-u 绑定上游
git push                  # 以后只需这一条
```

**clone（把远程仓库拉到本地）**：
```bash
cd ~/projects
git clone https://github.com/Takotsubo/项目名.git
```
clone 完自动建好 remote `origin` 和分支跟踪，可以直接 `git push`。

**pull（拉远程更新到本地）**：每次开始干活前先 `git pull`，避免 push 时冲突。

**首次推送已有本地项目到新 GitHub 仓库（完整流程）**——GitHub 建空仓库（不勾 README）后，本地：
```bash
cd ~/projects/my-app
git init
git add .
git commit -m "chore: initial commit"
git branch -M main
git remote add origin https://github.com/Takotsubo/my-app.git
git push -u origin main
```

**Claude Code 一气呵成版**（你直接说）：
> "这是个新项目，帮我完成初始化：git init、add 所有文件、用 Conventional Commits 写 initial commit、关联远程 https://github.com/Takotsubo/my-app.git 并 push 到 main"

### 5.7 让 Claude 跑 git 的最佳实践

**原则：自然语言 + 明确动作**。模糊指令有风险。对比：

| 模糊（不推荐） | 明确（推荐） |
|---|---|
| "保存一下" | "commit 当前改动，信息写 'fix: 修复电源纹波计算'" |
| "上传" | "push 到 origin/main" |
| "回到之前" | "restore main.py 到 HEAD~1" |

**推荐日常节奏**：
1. 让 Claude 改代码（一轮对话）
2. 你另开终端跑 `git diff` 看 Claude 改了什么（养成习惯，防 AI 飞改）
3. 满意 → 在对话框说"commit 一下，信息按改动自动写"
4. 攒了几个 commit → 说"push 到远程"
5. 改坏了 → 终端自己 `git restore` 或在对话框说"把当前改动全丢弃"

**让 Claude 不要乱碰 git**：
> "接下来只改代码，不要执行任何 git 命令，commit 由我来手动做"

这能避免 Claude Code 自作主张帮你 commit 半成品。

### 5.8 借鉴开源项目：clone 全库 vs 只读部分

这是你的核心困惑之一。Claude Code 倾向用 git 命令直接读云端少部分代码，但这并不总是最佳。

**三种姿势对比**：

| 姿势 | 何时用 | 优点 | 缺点 |
|---|---|---|---|
| **A. git clone 全库** | 要长期跟踪/魔改/贡献 PR / 项目不大 | 完整历史、能离线、能切 tag/分支、Claude 全文搜 | 占空间、大仓慢 |
| **B. 浅克隆 `git clone --depth 1`** | 只想要最新代码、不要历史 | 快 10 倍以上、省空间 | 拿不到历史/旧 tag |
| **C. 只读部分文件**（WebFetch raw 文件） | 只想看一两个文件学写法 / 只读不魔改 | 极快、不污染本地 | 没法跑项目、Claude 看不到全局 |

**推荐决策树**：
1. **只想抄一个文件/函数的写法** → 让 Claude 用 WebFetch 抓 GitHub raw 链接（`https://raw.githubusercontent.com/用户/仓库/分支/路径/文件`）。看完用完即弃。
   - Claude Code 措辞："抓一下 https://raw.githubusercontent.com/oven-sh/bun/main/README.md 给我看"
2. **想整体学一遍、要跑起来** → `git clone --depth 1` 浅克隆到 `~/projects/`，省时省地
3. **要长期魔改、可能贡献回去** → 完整 `git clone` + fork 流程

**Fork + clone（长期魔改或贡献开源标准流程）**：
1. GitHub 上打开目标仓库，点右上 **Fork** → 复制到你账号下
2. WSL 里：
   ```bash
   git clone git@github.com:Takotsubo/原仓库名.git
   cd 原仓库名
   git remote add upstream https://github.com/原作者/原仓库名.git
   ```
3. 改完想推回自己 fork：`git push origin main`
4. 想同步原作者更新：`git fetch upstream && git merge upstream/main`
5. 想给原作者提 PR：GitHub 网页上 Contribute → Open pull request

**License 合规（重要）**：
- 仓库有 `LICENSE` 文件才能抄，且要遵守条款（MIT/Apache 要求保留版权声明；GPL 要求衍生作品也开源）
- **没有 LICENSE ≠ 公有领域**，默认版权归作者，**不能抄**，只能学思路
- 把别人代码 push 到自己公开仓库时，至少在 README 注明 source

### 5.9 .gitignore 基础

**What**：一个文本文件，列出"哪些文件/目录 Git 不要追踪、不要 commit"。

**Why**：
- 不要把敏感信息（`.env`、API key、私钥）推上 GitHub——公开仓库泄露密钥是真实事故
- 不要把生成物（`node_modules/`、`__pycache__/`、`dist/`、`.venv/`）推上去——体积大、可重建、污染 diff
- 不要把 IDE 配置（`.idea/`）推上去——因人而异

**How**：仓库根建一个文件叫 `.gitignore`，内容一行一条：

```gitignore
# Secrets
.env
.env.*
*.pem

# Python
__pycache__/
*.pyc
.venv/

# Node
node_modules/
dist/

# IDE
.idea/
.vscode/

# OS
.DS_Store

# 构建产物
build/
*.hex
*.bin
```

**When**：项目一开始就建，第一行 commit 就要有 `.gitignore`。一旦发现某文件被追踪了才加进 .gitignore，不会自动移除，要手动 `git rm --cached 文件名`。

**Claude Code 措辞**：
> "帮我建一个适合 Python + Node 项目的 .gitignore，包含 .env、venv、node_modules、IDE 配置"

### 5.10 常见错误与恢复

**commit 信息写错了**：
```bash
git commit --amend -m "新的正确信息"   # 改最近一次 commit 信息
```
如果已 push 过，amend 后要 `git push --force-with-lease`（不要裸 `--force`）。新手优先在 push 前改。

**不小心 commit 了 .env（密钥）**：
```bash
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "chore: remove .env from tracking"
git push
```
**严重情况**：已 push 到公开仓库 → 立刻去 GitHub 改 Private + 把密钥轮换（git 历史删不干净，公开过的密钥视为已泄露，必须重置）。

**push 失败 `! [rejected] non-fast-forward`**：远程有你本地没有的 commit。解决：
```bash
git pull --rebase origin main
git push
```

**push 失败 `Permission denied`**：
- PAT 路线：token 过期，重生成一个
- SSH 路线：`ssh -T git@github.com` 测试，查 `~/.ssh` 权限
- remote URL 写错：`git remote -v` 检查，错的话 `git remote set-url origin <新URL>`

**合并冲突**：`git pull` 时本地和远程改了同一行，Git 不会替你选。文件里出现 `<<<<<<<`/`=======`/`>>>>>>>` 标记。解决：用编辑器删掉标记保留想要的内容，`git add 冲突文件`，`git commit`。
- Claude Code 措辞："帮我解决当前的合并冲突，把所有冲突都保留我本地版本"

**想撤销最近一次 commit（还没 push）**：
```bash
git reset --soft HEAD~1    # 撤销 commit，改动留在暂存区
git reset --mixed HEAD~1   # 撤销 commit，改动留在工作区（默认）
git reset --hard HEAD~1    # 撤销 commit + 丢弃改动（危险，不可逆）
```
已 push 过的 commit：用 `git revert 提交哈希` 生成反向 commit，安全推上去。

**后悔药**：
```bash
git reflog                    # 看所有 HEAD 移动历史（含已 reset 掉的）
git reset --hard HEAD@{2}     # 跳到 reflog 第 2 行那个状态
```
`git reflog` 几乎能找回一周内任何状态（除非 `.git/` 被删）。

### 5.11 速查表

| 想干啥 | 命令 |
|---|---|
| 初始化新仓库 | `git init` |
| 看状态 | `git status` |
| 加改动到暂存 | `git add .` |
| 提交快照 | `git commit -m "信息"` |
| 看历史 | `git log --oneline --graph` |
| 看改动 | `git diff HEAD` |
| 撤销工作区改动 | `git restore 文件名` |
| 关联远程 | `git remote add origin <URL>` |
| 第一次推送 | `git push -u origin main` |
| 以后推送 | `git push` |
| 拉远程更新 | `git pull` |
| 克隆仓库 | `git clone <URL>` |
| 浅克隆 | `git clone --depth 1 <URL>` |
| 改最近提交信息 | `git commit --amend -m "新信息"` |
| 后悔药 | `git reflog` |

`★ Insight ─────────────────────────────────────`
Git 的本质不是"版本控制"，是**给你的开发过程装上存档键**。对业余开发者，它的价值不在协作，而在"敢于放手让 Claude 试"——任何改动都可以 restore 回来。这就像硬件调试时有热风台随时能拆焊，你才敢上手试。没有 Git 的 vibe coding 等于没有 undo 键的编辑器，一次搞砸就劝退。结合第 1 章的"你是 DRI"心智模型，git 还给了你"对每行代码负责"的物质基础——你能追到任何一行是谁、什么时候、为什么改的。
`─────────────────────────────────────────────────`

---

## 6. CLAUDE.md 正确用法与交接文档实践

这章解决你两个核心痛点：(1) CLAUDE.md 怎么写、怎么更新、和 `/init` 什么关系；(2) HANDOFF.md 到底是不是自动的、第一次第二次交接怎么办。

### 6.1 CLAUDE.md 的真相

CLAUDE.md **不是**自动生成的数据库，也**不会**在会话中自动更新。它的本质是：

- **你写给 Claude 看的项目说明**，每次会话开始 Claude 都会完整读一遍
- `/clear` 之后，它是 Claude 知道"这个项目在干嘛"的唯一自动入口
- 内容应该是**相对稳定的项目级约定**，不是日志

关键事实：

| 问题 | 答案 |
|------|------|
| Claude 会自动生成 CLAUDE.md 吗？ | 不会。要么你手动写，要么 `/init` 生成草稿，要么直接对 Claude 说"帮我写 CLAUDE.md" |
| 会话中 Claude 会自动更新它吗？ | **不会**。必须你主动说"把这条加到 CLAUDE.md"或"更新 CLAUDE.md 的当前进度" |
| `/clear` 后会失忆吗？ | 会忘对话，但会重新读 CLAUDE.md。所以它是接续点 |
| `/init` 什么时候跑？ | 项目有一些代码之后跑才有意义（它靠分析代码库生成） |
| 空文件夹时怎么办？ | 不要 `/init`，直接对 Claude 说"帮我写 CLAUDE.md" |

### 6.2 /init 和更新 CLAUDE.md 的关系（你特别困惑的点）

这是你问的核心："更新 CLAUDE.md 跟 /init 又有什么关系？开发到中途怎么更新 CLAUDE.md？"

**`/init` 是什么**：一个一次性命令，让 Claude 分析代码库（检测构建系统、测试框架、代码模式），生成一份初始 CLAUDE.md。如果已存在 CLAUDE.md，`/init` 会建议改进而不是覆盖。

**两者的关系**：
- **项目刚开始（空文件夹或刚有少量代码）**：不要 `/init`，直接对 Claude 说"帮我写 CLAUDE.md"——它会根据你的想法生成
- **项目跑起来、有结构了**：跑一次 `/init`，让它分析代码库补全你没想到的约定（构建命令、测试命令、目录结构）
- **开发到中途想更新**：**不要**再跑 `/init`（它会以为是新项目要重新生成）。直接对 Claude 说"更新 CLAUDE.md 的当前进度一节"或"把这条约定加到 CLAUDE.md"

**中途更新的时机（你怎么知道什么时候该更新）**：
- 完成一个切片 → 更新"当前进度"一节
- 做了一个重要的技术决策（比如换了某个库）→ 加到"技术栈"或"决策记录"一节
- 发现 Claude 反复犯同一个错 → 把"不要这样做"的规则加进去
- `/clear` 之前 → 一定更新一次，保证下次会话能续上

**具体更新措辞**：
> "更新 CLAUDE.md：把当前切片标记为完成，写下一切片目标。另外把'使用 pnpm 而不是 npm'加到编码约定里。"

### 6.3 CLAUDE.md 应该写什么（你写不出来的问题）

你说"技术细节一条都写不出来"。**所以让 Claude 写**。你的职责是给模糊信息，Claude 负责结构化。

**你给 Claude 的措辞**：
> "帮我写一份 CLAUDE.md。项目是 [你的模糊想法]。我水平是业余初学者，偏好 [Python/JS 等，或者让 Claude 推荐]。第一个切片目标是 [你想的最小功能]。编码约定我不懂，你按社区最佳实践帮我定。构建/测试/运行命令我也不知道，你看用什么技术栈合适，帮我写。"

Claude 会根据你的输入 + 它的判断，生成一份完整的 CLAUDE.md。你看了觉得不对就说"技术栈换 X""切片改小一点"，它会改。

**目标长度**：200 行以内。推荐结构：

```markdown
# 项目概要
- 一句话：这是什么
- 技术栈：语言、框架、关键依赖
- 项目结构：src/ 还是 flat？测试放哪？

# 构建/测试/运行命令
- 安装依赖: pip install -r requirements.txt
- 运行: python main.py
- 测试: pytest

# 编码约定
- 命名风格（snake_case for Python）
- 错误处理模式
- 日志规范

# 当前进度（这一节会更新）
- 已完成：最小切片（2026-07-10）
- 当前切片：XXX
- 下一步：YYY

# 决策记录（这一节记"为什么"，git 看不到的）
- 选了 X 而不是 Y，因为...
```

### 6.4 HANDOFF.md 的真相

**HANDOFF.md 不是 Claude Code 的官方功能**。官方推荐的跨会话连续性机制是三件套：CLAUDE.md + Auto Memory + `/resume`/`/compact`。HANDOFF.md 是**民间社区约定**（主要来自 Cursor 等其他 AI 工具），Claude Code 官方文档里查无此词。

这意味着：
- Claude **不会自动写** HANDOFF.md，必须你触发
- Claude **不会自动读** HANDOFF.md，必须你说"读 HANDOFF.md"或用 `@HANDOFF.md` 语法导入
- 如果你要用 HANDOFF.md，要么每次手动让 Claude 读/写，要么装社区 skill 让它半自动化（见 6.6）

**你需要 HANDOFF.md 吗？** 官方路线（CLAUDE.md + Auto Memory + `/resume`）对 90% 场景够用。**只有项目长到单会话 context 装不下、且需要跨多天跨切片硬核防失忆时，才上 HANDOFF.md**。你现在的阶段，官方路线够用。

### 6.5 三件套分工：CLAUDE.md vs HANDOFF.md vs TODO.md

| 文件 | 时间属性 | 内容 | 谁写 | 改动频率 |
|---|---|---|---|---|
| **CLAUDE.md** | 稳定（长期规则） | 构建命令、代码规范、项目架构、决策记录 | 你写（或让 Claude 写） | 周/月级 |
| **HANDOFF.md** | 易变（当前状态快照） | 当前目标、已验证状态、死路、下一步、开放问题 | Claude 在交接时写（你触发） | 每次会话末 |
| **TODO.md** | 未来（待办清单） | 待做任务、已知 bug、未来计划 | 你 + Claude 协作 | 天级 |

**口诀**：
- **CLAUDE.md 是"宪法"**——稳定、规则性、写一次用很久、每会话自动加载
- **HANDOFF.md 是"白板"**——易变、当前状态、每次擦了重写、不会自动加载
- **TODO.md 是"购物清单"**——未来、待办、做完划掉、不会自动加载

**关键边界**：
- 不要把 TODO 塞进 CLAUDE.md（TODO 易变，会污染稳定的宪法）
- 不要把"构建命令"塞进 HANDOFF.md（构建命令是长期规则，进 CLAUDE.md）
- 不要把"决策理由"塞进 TODO.md（TODO 只记"做什么"，"为什么"进 CLAUDE.md 的决策记录段）

### 6.6 社区 skill：让 HANDOFF.md 半自动化

只有一个真的可用的 Claude Code handoff skill：**ostikwhy-blip/claude-code-handoff-skill**（22 star，MIT，原生 SKILL.md 形态）。

**装法**：
```bash
cd ~
git clone https://github.com/ostikwhy-blip/claude-code-handoff-skill.git
mkdir -p ~/.claude/skills
cp -r claude-code-handoff-skill ~/.claude/skills/handoff
ls ~/.claude/skills/handoff/   # 应看到 SKILL.md + assets/
```

装完进任意 git 项目起 claude 会话，输入 `/handoff`，Claude 会跑 git 三件套 + 重读引用文件 + 重跑测试 → 在项目根写 `HANDOFF.md`，旧文件归档到 `.handoffs/时间戳-handoff.md`。新会话第一句说 `resume from the handoff`，Claude 读文件、按头部 SHA 复核 `[V]` 项、报漂移、抛开放问题、确认计划后继续。

### 6.7 第一次交接写了 HANDOFF.md，第二次怎么办

这是你问的核心："第一次的 HANDOFF.md 呢？是增量累积还是替换？有没有完整日志？"

**社区实际做法是"替换 + 归档 + 死路搬运"**，不是增量累积也不是直接覆盖：

- 新 `HANDOFF.md` 写到项目根，旧文件移到 `.handoffs/时间戳-handoff.md`（自动加 .gitignore，不进 git）
- **唯一例外**：旧文件里的"Failed approaches / 死路"和"Known traps / 坑"段落，如果仍未解决，会**前向搬运**到新文件并降级标 `[?]`（待复核）
- 所以本质是"每次写一份全新的，但死路历史被保留"

**不要建 LOG.md/DEVLOG.md**：git 本身就是天然的 chronological log（commit message + `git log --oneline` + `git reflog`），手写日志是重复劳动。`.handoffs/` 归档目录本身就是"关键节点快照序列"，比逐 turn 日志精炼。

### 6.8 HANDOFF.md 模板（≤250 行，400 硬上限）

```markdown
# HANDOFF — 读全文再开始干活

生成时间: 2026-07-16T22:00:00 · Git HEAD: a3f1b2c
恢复方式: 跑 /handoff 或说 "resume from the handoff"，会按头部 SHA 复核本文件。
信任规则: [V] = 交接时已用命令验证；[?] = 仅记忆未复核，当线索对待。

## 1. 当前目标
<!-- ≤5 行。单一目标 + 完成定义 -->
让 POST /orders 幂等；完成定义：重复 Idempotency-Key 返回原 200 且不写第二行。[V] 测试文件已存在

## 2. 已验证状态 — 工作实际停在哪
<!-- 每条 = claim + 证据 + tag -->
- orders.controller.ts 已加 Idempotency-Key 解析 [V] git diff 可见
- 测试当前失败：期望 200 实得 500 [V] 测试输出见下

### 测试/build 输出 tail（本次交接 run 的真实输出）
```
FAIL  orders.idempotency.test.ts
  expect(201).toBe(200)
```

## 3. 决策与理由
- 去重逻辑放中间件不放 controller [V]——controller 会被多个路由复用。否决方案：controller 内 if 判断，难复用。

## 4. 失败的尝试 — 不要再试
<!-- 最值钱的一段。每条: 试了什么 → 怎么失败 → 具体原因 → 别再试 -->
- 在 controller 加去重表 → 死锁 [V]——两个并发请求都锁同一行。不要在 controller 层加同步锁。

## 5. 已知坑
- orders.controller.ts 看起来没用 legacy/ 目录，但 runtime 会动态 require legacy/orders-adapter.js [V]——别删 legacy 目录。

## 6. 下一步（有序）
1. 在 src/middleware/idempotency.ts 新建 IdempotencyMiddleware，用内存 Map 存已见 key
2. 在 orders.controller.ts 注入并应用中间件
3. 重跑测试，期望通过

## 7. 留给用户的开放问题
- 生产环境要不要换 Redis 做幂等存储？本地 dev 先用内存 Map 行不行？
```

**裁剪顺序**：超预算时先删叙事散文 → 把 Decisions 压到每条一行 → **永不裁剪** Failed approaches / Known traps / Verified state / Next steps。

`★ Insight ─────────────────────────────────────`
CLAUDE.md、HANDOFF.md、TODO.md 三件套的分工，本质是软件工程里"策略与机制分离"的应用：机制（技术栈、命令）很少变，进 CLAUDE.md；策略（当前做哪块）天天变，进 HANDOFF.md；未来计划进 TODO.md。你之前把它们混在一起，所以觉得更新 CLAUDE.md 像在写日志、不更新又失忆。分开就清爽了。HANDOFF.md 虽然不是官方功能，但它的"替换+归档+死路搬运"模式解决了官方 `/compact` 解决不好的"死路遗忘"问题——`/compact` 会把死路也压缩掉，导致下次重试。这是它有价值的根本原因。
`─────────────────────────────────────────────────`

---

## 7. 会话管理：/clear /compact /resume 与收工开工措辞

你之前大量用 /compact 且觉得不好用——你的体感完全正确，研究证实了为什么。这章给完整的会话循环。

### 7.1 /compact 到底做了什么

`/compact` 把当前对话历史**替换成一段结构化摘要**。它不是"压缩无损保存"，而是**有损摘要**——信息会丢失。

### 7.2 为什么多次 /compact 会"慢性失忆"

每次 /compact 都会丢失信息，机制上有三层损失：

1. **摘要的摘要的摘要**：多次 /compact 时，第二次摘要的是"第一次摘要后的内容"，信息层层稀释
2. **skill 描述不会重新注入**：只有你实际调用过的 skill 被保留，其他 skill 的描述在 compact 后丢失
3. **嵌套目录的 CLAUDE.md 不自动重新注入**：项目根的 CLAUDE.md 会重新读，但子目录的不会

这就是你体感到"头部信息越来越被稀释"的根因。官方原文逐字说：一个干净的会话 + 更好的初始提示，几乎总是胜过一个堆满纠正的长会话。

### 7.3 命令对比

| 命令 | 干什么 | 区别 |
|---|---|---|
| `/clear` | 清空对话开始新会话，旧会话保存可恢复 | 旧会话**完整保留**在本地，可 `/resume` 找回 |
| `/compact` | 压缩当前对话为摘要，**不建新会话** | 释放上下文空间，但保持同一个会话（最多用一次） |
| `/context` | 显示上下文使用情况 | 只查看，不改变状态 |
| `/rewind` | 打开回退菜单，可回退代码和/或对话 | 回到**同一个会话**的历史点 |
| `/branch` | 从当前对话创建**新分支**（拷贝历史到新 ID） | 保持原会话不变，在新分叉试不同方向 |
| `/fork` | 生成一个后台子代理，继承完整对话 | 让副手去干活，不阻塞主会话 |
| `/resume` | 切换到另一个已保存的会话 | 完全切换到不同对话 |

### 7.4 正确的会话循环

```
┌─ 新会话开始 → Claude 自动读 CLAUDE.md + Auto Memory
│  （如有 HANDOFF.md，你说"读 HANDOFF.md"让它读）
│
├─ 做一个切片（一条能跑的窄功能）
│
├─ 切片完成 → /run 或 /verify 亲眼看它工作
│
├─ git add . && git commit -m "feat: xxx"
│
├─ 主动说："更新 CLAUDE.md 的当前进度 + 写 HANDOFF.md"
│
└─ /clear 开始下一个切片
```

### 7.5 什么时候 /clear

用 `/context` 看上下文占用（彩色网格）。在这些时机 /clear：

- **一个切片完成并 commit 后**（最推荐）：干净开始下一切片
- **上下文到 200-300K 的甜点区之前**：不要等爆了再清
- **Claude 开始忘事、变慢**：立即清
- **想换方向**（从功能 A 转去功能 B）：先 commit + 更新 CLAUDE.md/HANDOFF.md，再清

### 7.6 单次会话内 /compact 的合法用法

如果你必须在一个会话内继续，且上下文快满了：

- **最多 /compact 一次**
- 用带说明的 compact：`/compact 保留修改过的文件清单和测试命令`
- compact 完立刻去更新 CLAUDE.md/HANDOFF.md，为下次 /clear 做准备

**绝对不要**多次 /compact 续命——这正是你之前失败的路径。

### 7.7 完整收工会话末尾流程（从"刚做完切片"到"安全 /clear"）

**步骤 1：跑测试确认切片真的完成**
> 你说：先把当前切片的测试跑一遍，把输出 tail 给我看。

**步骤 2：触发交接（二选一）**

A. 装了 ostikwhy-blip skill：
> 你说：/handoff

B. 没装 skill，用自然语言：
> 你说：我这次会话快结束了，请帮我写一份 HANDOFF.md 到项目根目录。要求：1. 先跑 git status / git log -5 / git diff 确认当前仓库实际状态，不要凭记忆写。2. 每条陈述标 [V]（本次刚验证）或 [?]（仅记忆，需复核）。3. 段落：当前目标 / 已验证状态 / 决策与理由 / 失败的尝试（标不要再试）/ 已知坑 / 下一步 / 留给我的开放问题。4. 如果已存在 HANDOFF.md，先读它的"失败尝试"和"已知坑"段，仍未解决的条目搬到新文件并标 [?]，旧文件移到 .handoffs/时间戳-handoff.md。5. 目标 ≤250 行，400 硬上限。先删叙事，绝不删"失败尝试 / 已知坑 / 下一步"。

**步骤 3：审核 HANDOFF.md**
> 你说：把生成的 HANDOFF.md 完整读给我，我标出哪些 [V] 我要复核。

重点看"Failed approaches"和"Open questions"两段——这两段是下次会话最值钱的。

**步骤 4：更新 CLAUDE.md**
> 你说：更新 CLAUDE.md 的当前进度一节，标记这个切片完成，写下一切片目标。

**步骤 5：commit**
> 你说：把 HANDOFF.md 和这次切片的代码一起 commit，message 用 "feat: <切片名>"。

注意：`.handoffs/` 归档目录默认在 `.gitignore` 里，不进 git；只有当前 `HANDOFF.md` 进 git。

**步骤 6：清上下文**
- 同一任务还要继续且 context 还行 → 不清，继续干
- 切换到不相关任务 → `/clear`（旧会话仍可 `/resume`）
- 收工睡觉 → 直接退出，下次 `claude --continue` 或 `/resume`

### 7.8 完整开工会话开头流程（从"刚 cd 进项目"到"开始写代码"）

**步骤 1：启动 Claude Code**
```bash
cd ~/your-project
claude
# 或恢复上次会话：
claude --continue
# 或选历史会话：
claude --resume
```

**步骤 2：让 Claude 读交接文档（如有 HANDOFF.md）**
> 你说：读一下 HANDOFF.md，然后按头部 Git HEAD SHA 复核每条 [V] 项是否还成立，报告所有漂移，把开放问题抛给我，确认计划后我们继续。

**步骤 3：没有 HANDOFF.md 时（纯官方路线）**
> 你说：先读 CLAUDE.md 和 README，然后跑 git log --oneline -10 和 git status，告诉我上次停在哪、接下来该做什么。

**步骤 4：回答开放问题**
> 你说：（针对 HANDOFF.md 第 7 段的问题逐条回答）

**步骤 5：确认下一步后开始**
> 你说：按 Next steps 第 1 条开始，先告诉我你打算改哪个文件、怎么改，我确认后再动手。

**关键点**：开工第一件事不是写代码，是让 Claude **验证 HANDOFF.md 的 [V] 项是否还成立**。如果停了一周，仓库状态可能已变，`[V]` 可能已失效。验证后才能信任。

`★ Insight ─────────────────────────────────────`
/compact 和 /clear 的取舍，本质是"谁来做摘要"的问题。/compact 让 Claude 自动摘要，省事但失控；/clear + HANDOFF.md 让你手动摘要，费力但可控。业余开发者的关键优势是"人知道什么重要"——你比 Claude 更清楚哪些是死路、哪些决策关键。把摘要权拿回自己手里，是长期项目能延续的根本。收工/开工的两套措辞看起来啰嗦，但它们把"会话边界"从模糊的"我觉得该清了"变成了机械可执行的步骤——这是从"凭感觉"到"靠流程"的关键升级。
`─────────────────────────────────────────────────`

---

## 8. Skills 与 MCP 生态：选装评换全流程

这章解决你"不懂代码 → 不会选 Skills/MCP → 笨上加笨 → 项目报废"的死循环。关键纠正：你怕的是"裸奔没有优秀 Skills 指导"，不是怕"装太多"。要同时讲清"装太多变笨"和"裸奔也笨"两边的平衡。

### 8.1 Skill 是什么

Skill 是一个文件夹，里面有一个 `SKILL.md` 作为入口，外加可选的脚本、模板、参考文档。一句话：**skill 是给 Claude 看的"说明书"，告诉它在某类任务上该怎么做**。

和 CLAUDE.md 的区别：CLAUDE.md 是常驻上下文（每轮都在），skill 的正文**只在被调用时才加载**，平时只占一个名字+描述的极小开销。所以长篇参考资料写成 skill 几乎零成本，直到真正用到才付 token。

### 8.2 SKILL.md 的结构

```yaml
---
name: my-skill                # 可选，默认用文件夹名
description: 做什么、什么时候用  # 强烈推荐，Claude 靠它判断要不要自动触发
disable-model-invocation: true # 可选，true=只能你手动 /调，Claude 不会自动触发
user-invocable: false          # 可选，false=对你隐藏，只让 Claude 自动用
allowed-tools: Bash(git *)     # 可选，skill 激活时预批准的工具
---

正文：markdown 指令。Claude 调用这个 skill 时会把整段正文塞进对话。
```

只有 `description` 是推荐写的，其它全可选。description 在 skill 列表里被截断到 1,536 字符，所以关键用例要放前面。

### 8.3 自动触发 vs 手动调用

默认情况下，**你和 Claude 都能调用任何 skill**。两种触发路径：

| 路径 | 机制 | 例子 |
|---|---|---|
| **Claude 自动用** | 启动时只加载 name+description。你说的话匹配上 description，Claude 就把整个 SKILL.md 正文读进上下文，然后照着做 | 你说"帮我看看改了啥"，Claude 自动触发 `summarize-changes` skill |
| **你手动调** | 你输入 `/skill-name`，直接强制加载 | 你输入 `/deploy`，无论对话在说什么都执行部署流程 |

两个 frontmatter 字段可以锁死方向：

- `disable-model-invocation: true` → **只有你能 `/名字` 调，Claude 不会自己触发**。用于有副作用、你不想让 AI 自己决定的流程（部署、commit、发消息、删数据）
- `user-invocable: false` → **对你隐藏，只有 Claude 能自动触发**。用于"背景知识"型 skill

**对业余开发者的实操建议**：有副作用的 skill（部署、commit、发通知）一律加 `disable-model-invocation: true`；纯知识/规范类 skill 保持默认让 Claude 自己判断；你觉得 Claude 该用却没用，就直接 `/名字` 手动触发。

### 8.4 怎么装一个 skill

Skill 的三种存放位置：

| 位置 | 路径 | 作用范围 |
|---|---|---|
| Personal（个人） | `~/.claude/skills/<skill-name>/SKILL.md` | 你的所有项目 |
| Project（项目） | `<项目>/.claude/skills/<skill-name>/SKILL.md` | 仅这个项目，可提交 git 共享 |
| Plugin（插件） | `<plugin>/skills/<skill-name>/SKILL.md` | 插件启用范围，用 `插件名:skill名` 命名空间 |

**从 GitHub 下载一个 skill 装上的具体步骤**：

```bash
# 1. 确保 skills 目录存在
mkdir -p ~/.claude/skills

# 2. clone 到 skills 目录下，文件夹名就是 skill 名
cd ~/.claude/skills
git clone https://github.com/某人/某skill pr-summary

# 3. 确认结构：~/.claude/skills/pr-summary/SKILL.md 必须存在
ls ~/.claude/skills/pr-summary/SKILL.md
```

文件夹名 = 你 `/` 后面要敲的名字。所以 `pr-summary` 文件夹夹 → 你输入 `/pr-summary` 触发。

**装完怎么验证**：
- 输入 `/` 看自动补全菜单
- 输入 `What skills are available?` 让 Claude 列出
- **Live change detection**：你在 `~/.claude/skills/` 下增删改 `SKILL.md`，当前会话内就生效，不用重启

### 8.5 怎么知道一个 skill 好不好、适不适合我

这是你的核心痛点：不会选。下面是一套可执行的评估清单。

**看 skill 本身的信号**：

| 信号 | 好 | 坏 |
|---|---|---|
| README/SKILL.md 是否讲清做什么、不做什么 | 有明确 scope 和边界 | 含糊"提升代码质量"无具体动作 |
| description 是否具体 | "当用户问 X、Y、Z 时触发" | "让 Claude 更聪明"（等于没说） |
| 是否声明 allowed-tools | 明确只预批准必要工具 | 给自己 `Bash(*)` 全权（危险） |
| 正文是否简洁 | 官方建议 < 500 行，细节挪到参考文件 | 几千行全堆正文（每轮占大量 token） |
| 有没有示例/测试 | 有 examples/ 或 evals/ | 纯文字声明无验证 |

**看仓库的社区信号（GitHub）**：
- **Star 数**：高 star 不等于适合你。更要看**最近 commit 时间**——一个月内还在更新比 star 数更可靠
- **Issues 区**：看 open issues 里有没有"skill 产出错误代码""trigger 不准"抱怨，作者是否回复
- **README 是否有安装步骤和卸载方法**：负责任的 skill 会告诉你怎么删
- **License**：MIT/Apache 是正常信号；没有 license 文件要警惕
- **是否在 Anthropic 官方 marketplace**：能进官方 marketplace 的至少过了基本审查

### 8.6 "坏 skill 指导出来的代码会不会变屎山"——会，机制和避免方法

**会。** 这是真实风险，不是吓唬。机制有三层：

**第一层：description 写歪 → Claude 在不该用的时候用它**
比如 skill 的 description 是"用于优化代码"，Claude 可能在你只是想加个注释时也触发它，然后用一套不相关的"优化"流程把简单改动搞复杂。症状：简单任务被过度设计。

**第二层：正文指令本身是错的或过时的 → Claude 照着错的做**
比如 skill 里写"用某 API 的 v2 接口"，但该 API 已经升到 v4 且 v2 已删除。Claude 会忠实按 skill 写 v2 调用，产出编译不过或运行即崩的代码。**这就是为什么需要 context7 MCP 来补实时文档**。

**第三层：正文过长 + allowed-tools 过宽 → token 浪费 + 权限失控**
- 正文 3000 行的 skill 一旦触发，后续每轮都占巨量 token，Claude 真正能用来看你代码的上下文被挤掉
- 某些 skill 给自己 `allowed-tools: Bash(*)`，意味着 skill 激活期间 Claude 可以不经你确认跑任意 shell 命令

**官方对"装太多"的明确警告**：装太多 skill → 描述被截 → Claude 匹配不到该用的 skill → 又退回裸奔状态。这是个两头堵的陷阱：**装太多反而和没装一样**。预算机制：skill 列表的总字符预算 = 模型上下文窗口的 **1%**。

**怎么避免坏 skill 把项目带沟里**：

| 防御手段 | 怎么做 |
|---|---|
| **git 兜底** | 每次让 Claude 改代码前先 commit，坏 skill 产出后 `git restore` 回滚。最硬的保险 |
| **看 diff** | 每轮改动用 `git diff` 看一眼，不懂的行就问 Claude"这行为什么这么写" |
| **用 /code-review** | commit 前跑一遍，它会指出明显问题 |
| **限制 allowed-tools** | 装第三方 skill 时检查 frontmatter，把 `Bash(*)` 改成具体命令或删掉 |
| **disable-model-invocation** | 有副作用的 skill 一律设成只手动触发 |
| **配 context7 MCP** | 让 Claude 查实时文档而不是只信 skill 里的过时信息 |

### 8.7 装多少合适？怎么判断临界点

**官方硬指标**：
- Skill 列表预算 = 上下文窗口的 **1%**（可调）
- Auto-compaction 后所有 skill 共享 **25,000 token** 预算，每个保留前 5,000 token
- MCP 工具默认开启 tool search（deferred loading），只有真正用到的工具才进上下文，所以 MCP 装多一些对上下文压力比 skill 小

**用 `/context` 看实际占用**：`/context` 命令显示当前上下文各部分占用，其中 **Skills 行** = skill 列表总大小。

- Skills 行 < 上下文窗口的 2% → 健康，可以再装
- Skills 行接近 1% 预算上限 → 已经在砍描述了，别再加
- `/context` 整体占用 > 70% → 接近 compaction，该 `/clear` 或开新会话

**给业余开发者的具体数字建议**：
- **起步**：personal skills 2-3 个 + bundled skills 用自带的（`/code-review`、`/verify`、`/run`）
- **成长期**：用两周后发现某个重复操作想固化成 skill 再加，**总个人 skill 数控制在 8 个以内**
- **红线**：`/doctor` 报告 skill 列表超预算，或 `/context` 的 Skills 行明显偏大 → 精简
- **MCP 不受此限那么严**：tool search 默认开启，装 5-10 个 MCP 对上下文影响很小

### 8.8 业余开发者 Starter Pack

**推荐的个人 Skills（放 `~/.claude/skills/`）**：

| Skill | 来源 | 一句话理由 |
|---|---|---|
| **commit** | 自己写或参考 anthropics/skills | 固化你的 commit 流程（看 diff → 写规范 commit message），加 `disable-model-invocation: true` 防止 Claude 自己乱提交 |
| **summarize-changes** | 官方文档示例 | 每次改完一键总结改了啥、标红风险 |
| **code-review（bundled）** | Claude Code 自带 | commit 前跑一遍找 bug，**不用装，直接 `/code-review`** |
| **verify / run（bundled）** | Claude Code 自带 | 跑起来看改动是否真的生效 |
| **skill-creator（plugin）** | 官方 marketplace | 评估你装的 skill 好不好用，A/B 测试 |

起步其实**只需要自己写 1-2 个**（commit、summarize-changes），其余用 bundled。

**推荐的 MCP（用 `claude mcp add` 装）**：

| MCP | 一句话理由 | 安装命令 |
|---|---|---|
| **context7** | 实时拉取库的最新版文档，**治"skill 里的 API 写法过时"这个病** | `npx ctx7 setup --claude` |
| **sequential-thinking** | 让 Claude 把复杂问题拆成多步思考再动手，减少一拍脑袋就写的烂代码 | `claude mcp add --transport stdio sequential-thinking -- npx -y @modelcontextprotocol/server-sequential-thinking` |
| **fetch** | 抓网页/JSON 转成 markdown 给 Claude，比让它瞎猜网上的内容强 | `claude mcp add --transport stdio fetch -- npx -y mcp-fetch-server` |

**起步建议：先装 context7 + sequential-thinking + fetch 这三个**，用一周，再决定要不要加。

**不建议业余开发者一上来就碰的**：各种 LSP plugin（clangd/gopls）、数据库类 MCP（需要真实凭证）、`mcp-server-dev`（自己开发 MCP 用的）。

### 8.9 大型方法论 skill 集合（如 Superpowers）怎么评估适不适合自己

你提到 Superpowers 和其他一堆看不懂的 skill。不单独评价某个，给你一个**评估任何大型方法论 skill 集合适不适合自己的判断框架**：

1. **它假设的工作流和你实际场景匹配吗？** Superpowers 这类假设你做的是有明确需求的功能开发、用 git worktree、能跑 TDD。如果你的项目是"改两行配置看看效果"的探索性 vibe coding，整套流程是过度约束，会让简单任务变重
2. **它的 skill 数量会不会撑爆你的上下文预算？** 大型集合一次注入十几个 skill 的 description，小项目可能直接占满 1% 预算。装之前先看 `/doctor`
3. **你能不能读懂它的 SKILL.md？** 如果你打开它的 SKILL.md 看不懂它在要求 Claude 做什么，那你也无法判断 Claude 是不是在正确执行——这等于把方向盘完全交出去。**业余开发者的底线：至少能读懂 skill 在说什么**
4. **有没有退路？** 装 plugin 后能不能干净卸载（`/plugin uninstall`）？会不会在项目里留下 `.claude/` 配置？先在一个 throwaway 测试项目里试
5. **它要不要额外依赖？** 有些 skill 要 Python/Node 特定版本
6. **小步试**：先只启用其中 1-2 个 skill，用一周，再决定要不要全开

**给你的直接建议**：这类大型方法论 skill 集合现在对你太重。等你写过 2-3 个小项目、能看懂 SKILL.md 之后，再考虑先试它单个 skill。

### 8.10 MCP 是什么、怎么装、从哪找

**MCP 是什么**：Model Context Protocol，开放标准，让 Claude Code 连接外部工具和数据源。一句话：**MCP 让 Claude 能直接读你的数据库、抓网页、查 GitHub issue、调 API，而不是你手动复制粘贴进对话**。

官方建议信号："当你发现自己总是在把另一个工具的数据复制进对话时，就装个 MCP"。

**三种传输方式**：
- **http**（推荐，云端服务）：Notion、Sentry、GitHub
- **stdio**（本地进程）：filesystem、sequential-thinking、本地脚本
- **sse**（已废弃，用 http 代替）

**安装命令**：
```bash
# 远程 HTTP server
claude mcp add --transport http notion https://mcp.notion.com/mcp

# 带 Bearer token
claude mcp add --transport http github https://api.githubcopilot.com/mcp/ \
  --header "Authorization: Bearer YOUR_PAT"

# 本地 stdio server（注意 -- 分隔符）
claude mcp add --transport stdio airtable \
  --env AIRTABLE_API_KEY=YOUR_KEY \
  -- npx -y airtable-mcp-server
```

stdio 命令必须用 `--` 把 Claude 自己的参数和 server 的参数分开。

**三种 scope（装哪）**：

| Scope | 作用范围 | 存哪 | 共享 |
|---|---|---|---|
| local（默认） | 仅当前项目，仅你自己 | `~/.claude.json` | 否 |
| project | 仅当前项目，团队共享 | 项目根 `.mcp.json`（可提交 git） | 是 |
| user | 你的所有项目 | `~/.claude.json` | 否 |

业余开发者起步用 **local 或 user**。`claude mcp add --scope user ...` 装一次所有项目都能用。

**管理和验证**：
```bash
claude mcp list              # 列出所有
claude mcp get <name>         # 看某个详情
claude mcp remove <name>      # 删除
/mcp                          # 会话内看状态、做 OAuth 登录
```

**从哪找 MCP**：
- **Anthropic Directory**：https://claude.ai/directory 官方审核的 connector 列表
- **modelcontextprotocol/servers**：https://github.com/modelcontextprotocol/servers 官方参考实现仓库
- **claude.ai 的 connectors**：https://claude.ai/customize/connectors

**安全提示**：官方明确警告——连接 MCP server 前要确认你信任它，尤其是会抓取外部内容的 server，有 **prompt injection 风险**（外部内容里藏指令骗 Claude）。别随便 clone 别人的项目就自动信任它的 `.mcp.json`。

### 8.11 Skill 更新：怎么更新？中途换 skill 会不会让旧代码变屎山？

**更新方式**：
- **手动 clone 的 skill**：`cd ~/.claude/skills/<skill名> && git pull`。Live change detection 当场生效
- **plugin 安装的 skill**：`/plugin marketplace update <marketplace名>` 然后 `/plugin update <plugin名>`，再 `/reload-plugins`
- **自己写的 skill**：直接编辑 `SKILL.md`，保存即生效

**中途换 skill 会让旧代码变屎山吗？** 会，但风险可控。机制：skill 换了 → Claude 对同一段代码的"正确做法"判断变了 → 新代码用新风格、老代码还是旧风格 → 风格不一致 = 屎山的开始。

**用 git 保护的具体做法**：
1. 换 skill 前先 commit 当前状态，留个干净的回滚点
2. 换 skill 后让 Claude 跑一遍 `/code-review` 全项目
3. 不要一次性大改：让 Claude 按新 skill 只改新增部分，老代码分批迁移，每次 commit 一个可回滚的小步
4. CLAUDE.md 里记录当前用哪个 skill 版本
5. 保留旧 skill 一段时间：`disable-model-invocation: true` 而不是直接删，万一要回滚

**skill 版本管理**：把 `~/.claude/skills/` 整体当成一个 git 仓库管理，skill 更新就是 commit。项目级 skill（`.claude/skills/`）和项目代码一起进 git，每个项目锁定自己的 skill 版本。

### 8.12 自己写一个 skill 难不难？业余开发者能不能写？

**能，而且很简单。** 官方 quickstart 的完整示例只有不到 20 行。

**最小可用 skill**：

```bash
mkdir -p ~/.claude/skills/my-first-skill
```

创建 `~/.claude/skills/my-first-skill/SKILL.md`：

```yaml
---
name: my-first-skill
description: 当用户问"今天改了啥"或要写 commit message 时触发。总结 git 未提交改动并标红风险。
---

## 当前改动
!`git diff HEAD`

## 你的任务
用 2-3 个要点总结上面的改动，然后列出你注意到的风险（缺错误处理、硬编码值、需要更新的测试）。如果 diff 为空，说没有未提交改动。
```

进 Claude Code，输入 `/my-first-skill`，或直接说"今天改了啥"，它会自动触发。

**关键概念：`!`反引号` 动态注入**——`` !`git diff HEAD` `` 这一行在 skill 发给 Claude 之前，Claude Code 会先执行命令、把输出替换进来。Claude 看到的是真实 diff 内容，不是命令本身。这是写 skill 最有用的特性之一。

**业余开发者写 skill 的路线图**：
1. 抄官方 summarize-changes 示例，改命令，跑通
2. 把你发现自己重复粘贴进对话的指令固化成 skill
3. 加 frontmatter 控制行为——有副作用的加 `disable-model-invocation: true`
4. 用 `/skill-creator` 的 evaluate 功能跑 A/B 测试
5. 把常用参考文档放成单独文件，SKILL.md 只写导航

**你不需要会写代码就能写 skill**：SKILL.md 本质是 markdown + 几行 YAML。你完全可以让 Claude 帮你写——直接对 Claude 说"帮我写一个 skill，它的作用是 X，放在 ~/.claude/skills/ 下"，Claude 会用 Write/Edit 工具直接给你创建好。

`★ Insight ─────────────────────────────────────`
你陷入的死循环——"不懂代码 → 不会选 Skills/MCP → Claude 更傻"——的破解点**不是"学更多 Skills"，而是"先做对基础，再装少量精选 Skills"**。裸奔的 Claude Code + 好的 CLAUDE.md + git + 切片，比装满 Skills 的 Claude Code 强得多。Skills 是乘数，但你基础是 0 时，乘数再大也是 0。先把基础做对（前 7 章），再加 Skills（这章）。每个 Skill/MCP 都有三重成本：上下文 token、认知负担、误触发风险。业余开发者最稀缺的是上下文窗口和注意力，不是工具数量。这和 PCB 设计同理——元件越多故障点越多，简洁的设计反而可靠。
`─────────────────────────────────────────────────`

---

## 9. Bug 螺旋逃生与 Rebuild vs Patch

这是你之前所有项目流产的直接原因。这一章请反复读。

### 9.1 你的失败模式被官方文档直接命名了

Anthropic 官方 Best practices 把三个失败模式列在一起，**你的螺旋就是这三个的叠加态**：

1. **Correcting over and over**（反复纠正）
2. **Kitchen sink session**（一个会话混多任务）
3. **Infinite exploration**（无限探索代码）

官方原文逐字解释了为什么无限找 bug 是**数学上必然**的：

> A reviewer prompted to find gaps will usually report some, even when the work is sound, because that is what it was asked to do. Chasing every finding leads to over-engineering.

（一个被要求"找问题"的 reviewer 总会报告一些问题，即使代码没问题——因为这是它被要求做的。追每个发现会导致过度工程。）

### 9.2 为什么"再查一遍"永远有 bug

**核心机制**：每次"修 bug"本身就是一段新代码改动 = 一个新 diff = 新的可审查面。

你让它"审查所有代码"，它审的是刚改过的代码，改动又产生新的可挑毛病的地方。这是一个**不动点不存在的递归**——除非代码完全不变，否则总能找到"可以更严谨"的地方。

所以 N 轮之后你既不会得到"零 bug"，也不会得到"明显收敛"，你会得到**一个看起来永远有下一件事要做的列表**。这不是 Claude 笨，是任务定义本身错了。

硬件类比：你让 QA"再测一遍板子找问题"，每次修复后重新测，永远能找到可以优化走线的地方。投板标准是"满足规格书"，不是"走线完美"。

### 9.3 正确的心智模型

**Bug 实际上是无限的。目标不是"零 bug"，目标是"一个能工作的切片"。**

- 软件从来不是"没有 bug"才发布的。所有你用着的软件都有几千个已知 bug
- "找 bug"是**发散任务**（无穷可生成），"做出能用的东西"是**收敛任务**（有终点）
- 你用发散工具去追收敛目标，永远到不了
- **关键转换：把"找 bug"换成"跑有终止条件的检查"**——跑测试、跑 build、`/verify`。检查通过即停，不是"再 review 一轮"

### 9.4 逃生清单（机械规则，照做）

1. **两轮规则**：让 Claude 审查最多**两轮**。第二轮还在挑的问题，记进 TODO.md，**不在当前会话修**。继续修就进入"修→审→再修"的死循环

2. **严重度规则**：只修"会让当前切片不能用的 bug"。边缘情况、风格、性能、"以后可能出问题"——全部进 TODO，不在当下修

3. **新 bug 计数规则**：如果一轮审查找到的"真 bug"数量比上一轮还多，**立即停**。这通常意味着上一轮的"修复"在引入新问题，继续只会更糟

4. **换"找 bug"为"跑检查"**：给 Claude 一个返回 pass/fail 的检查（测试/build/截图/`/verify`），检查通过即停

5. **限制 reviewer 范围**：明确说——"只报影响正确性的问题，其他当可选"。这是官方原文的用法

6. **用 `/code-review` 而不是自然语言审查**：它在 fresh 子代理里审当前 diff，不受主会话历史污染，reviewer 不会因为"刚刚一起写过"而偏袒

7. **时间规则**：在一个切片上"审查+修"超过总时间的一半，就停。剩下时间应该用来推进下一个切片或 commit

### 9.5 TODO.md 在审查中的作用（你问的点）

你问："怎么又记进 TODO.md 了，这个前面又说是我自己写（但我不会写），中途到底是我手动更新还是 Claude Code 自己更新，跟 HANDOFF.md 又是什么关系？"

**澄清**：
- TODO.md **不是官方功能**，Claude 不会自动维护它
- 但你可以让 Claude 帮你维护——对 Claude 说"把这条 bug 记进 TODO.md，不在当前会话修"
- Claude 会用 Write/Edit 工具更新 TODO.md，不需要你手敲
- **和 HANDOFF.md 的关系**：HANDOFF.md 是"当前会话状态快照"（每次交接重写），TODO.md 是"累积的待办清单"（持续追加）。审查时发现的不紧急 bug，进 TODO；会话末交接时，HANDOFF.md 会引用 TODO 里相关的条目

**具体措辞**：
> "审查当前 diff，只报影响正确性的 bug。第二轮挑的问题全部记进 TODO.md，标'非紧急，以后处理'，不在当前会话修。"

### 9.6 为什么"扫所有代码找 bug"是反模式

因为它把你的注意力从"交付功能"转到"清查代码库"。对非程序员的个人项目，**代码库整洁度不是你的交付物，能用的功能才是**。

"扫一次全库找 bug"的正确用途只有一种：**接手别人/过去的自己写的陌生代码时做一次摸底**，摸完就停，别养成习惯。

### 9.7 你之前的具体失败路径

```
让 Claude 按 Plan 执行 → 找到 Bug → 修复
  ↓
担心有别的严重 Bug → 让 Claude 审查所有代码（自然语言）
  ↓
找到 Bug → 修复 → 再说一遍"审查所有代码"
  ↓
又能找到 → 重复十几次还能找到
  ↓
同一个会话中重复多遍 → 上下文堆积 400-500K → 性能严重下降
  ↓
想 /compact 或 /clear → 遇到失忆问题（见第 7 章）
  ↓
Claude 提议"从头构建"或"修复部分先跑起来"
  ↓
你已经卡住、失去信心 → 觉得继续也是屎山 → 项目流产
```

这个路径里每一步都有对应的破解：
- "审查所有代码" → 第 9.4 节两轮规则 + /code-review
- "上下文 400-500K" → 第 7 章 /clear + HANDOFF.md
- "Claude 提议 rebuild vs patch" → 第 9.8 节决策框架
- "失忆" → 第 6 章主动维护 CLAUDE.md/HANDOFF.md

### 9.8 Rebuild vs Patch 决策框架

当 Claude 说"我可以从零重写（大工程）"或"打补丁继续"时，用这几条**不需要懂代码也能套**的启发式。

**倾向 Patch（打补丁）的情况**：
- **能跑的代码不少**。已经有几百行能工作的代码 → 重写等于把战果扔掉。Joel Spolsky 的经典论点：旧代码里那些"看起来很丑的毛"往往是真机调试出来的边界修复，扔掉等于把这些坑重新踩一遍
- **bug 在边缘**，不在骨架。比如"某个按钮点两次会重复提交"——这是边角，patch 掉就行
- **架构是对的，只是实现脏**。数据流、模块划分大体合理，只是代码丑 → 局部重构，不要推倒
- **你是新手，重写对你风险更高**。重写需要你脑子里有清晰的目标架构，你还没有

**倾向 Rebuild（重写）的情况**：
- **几乎没有能跑的代码**。只有几十行实验性代码、还没形成任何用户价值 → 重写成本极低，扔掉不可惜
- **架构本身就是错的**。比如选错了技术栈（该用数据库却用了文件、该是事件驱动却写成了轮询）。这种 bug 不在某一行代码，而在地基，patch 不动
- **同一个问题反复以不同形式出现**。修了这个那个又坏，说明根在架构。**判断法**：连续 3 次以上"修 A → B 坏 → 修 B → C 坏"的连环崩，就别 patch 了
- **上下文已 400-500K**：已经超过 200K 硬窗口意味着你已多次 compact，结构信息已丢失
- **你完全看不懂现在的代码在干嘛**（谨慎用：新手看不懂 ≠ 代码烂，可能是你还没学到。让 Claude 先解释一遍，再判断）

**一句话决策法**：
> **"有多少能跑的代码" × "bug 在地基还是在边角"：能跑的多且 bug 在边角 → patch；能跑的少或 bug 在地基 → rebuild。**

新手默认倾向 **patch**。重写是高阶操作，需要更多判断力，在你积累出"我看得懂这个项目结构"的感觉之前，能 patch 就 patch。

### 9.9 Rebuild ≠ 丢代码（关键）

**Rebuild 不等于把旧代码删了重写。** 用 Git 的分支：

```bash
git switch -c rebuild-v2   # 新分支重写
# 在新分支里重新生成代码...
# 万一重写更糟：
git switch main            # 切回旧分支，旧代码完好
```

旧分支留着，重写在新分支做，任何时候都能切回来。这消除了"重写 vs patch"的心理负担——你可以两个都试。

`★ Insight ─────────────────────────────────────`
Bug 螺旋的本质，是你把"收敛任务"（做出能用的切片）误用"发散工具"（无限找问题）去推进。这个陷阱不只在你身上——Anthropic 官方文档专门写 Callout 警告它，说明这是所有 Claude Code 用户最常见的失败模式。知道这一点后，你下次再想"再让 Claude 查一遍"时，会有一个声音提醒你：停下来，跑个检查就够，剩下的进 TODO。这个"停下"的肌肉记忆，是业余开发者最重要的 vibe coding 技能。Rebuild vs Patch 的决策，关键不是"代码烂不烂"，而是"能跑的代码有多少"——这保护了你之前的战果，避免每次卡住都从零开始。
`─────────────────────────────────────────────────`

---

## 10. 学习路径：6 个月里程碑

你之前说"看不到提升的清晰路径，是不是要啃 CS 专业书系统学一遍"。这章给你一条清晰可量化的路径。来源：TeachYourselfCS、Martin Fowler、Simon Willison、Nolan Lawson 等从业者博客。

### 10.1 先厘清：你开的"learning mode"到底是什么

经查证官方全部 167 个文档页面、settings、commands、70+ 环境变量——Claude Code **没有内置的 "learning mode"**。你启用的是第三方插件 `learning-output-style`，位于 `~/.claude/plugins/marketplaces/claude-plugins-official/plugins/learning-output-style/`。

它通过一个 SessionStart 钩子向每个会话注入额外指令，让 Claude 表现得像一个互动编程导师。核心指令（从脚本原文确认）：
- **不自动实现一切**，而是识别用户可以贡献 5-10 行有意义代码的机会
- 在业务逻辑、错误处理、算法选择处**请求你的贡献**
- 在写代码前后用 `★ Insight` 块提供教育性解释

**所以"learning mode"对你学习的帮助是真实但有限的**：它改变了 Claude 的输出风格（会解释、会留空给你填），但它本身不会让你学会任何东西——你不主动填那些空，它就只是更啰嗦的 Claude。它的真正价值在于制造"摩擦点"，你需要主动抓住这些摩擦点。可用 `/plugins` 或 `/hooks` 查看其状态。

### 10.2 要不要系统啃 CS 专业书？社区共识

**共识：这是错误的二元对立——两者结合，但顺序和取舍很关键。**

**不推荐"先啃完整 CS 课本再动手"**：
- 《Teach Yourself CS》(TYCS) 明确指出：自学者最容易掉进的坑是"理论读过即忘"。它推荐每门课 100-200 小时，但强调**配套项目和视频**，而非纯读书
- TYCS 作者 Oz Nova 给出的"如果只读两本"建议是：**CS:APP（CSAPP）** 和 **Designing Data-Intensive Applications (DDIA)**。其余七科按需选读，不必全啃
- **Martin Fowler** 给出最清晰的理论框架：学习循环分三步——观察/理解 → 实验 → 回忆/应用。AI 跳过了最关键的第三步："AI 可以在几秒内生成完美方案，但它无法给你带来通过自己挣扎创建它所获得的经验。"

**硬件工程师的特殊情况：CSAPP 是黄金起点**：
- TYCS：计算机系统是"自学软件工程师最被忽视的领域"，推荐 CSAPP 因为它"实用，面向程序员"
- **CSAPP 本身就是项目驱动的**——11 个实验室（Bomb Lab、Attack Lab、Data Lab 等），全部用 C 写，强制你理解内存、指针、汇编。**AI 基本无法替你做这些实验室**，这对硬件工程师是天然优势
- 你已有硬件背景，CSAPP 正好填补"硬件到软件"之间的鸿沟：从汇编、内存层次、链接一路讲到并发
- 替代/前置：若 CSAPP 太硬，**Nand2Tetris**（https://www.nand2tetris.org/）从 NAND 门到操作系统全栈自建，免费、项目驱动。硬件工程师可在前几章几乎零摩擦通过，后面软的部分才是学习重点

**算法导论（CLRS）不要通读**：TYCS 不推荐 CLRS，推荐 **Skiena《Algorithm Design Manual》**，理由是"少证明、多实战"。配 100 道 LeetCode 足够。

**可执行结论**：CSAPP + 实验室（必做）+ Skiena 算法（按需）+ 一个真实项目 + Claude Code 当结对伙伴。不要从头到尾啃专业书，也不要纯项目驱动跳过基础。

### 10.3 "在 vibe coding 中学习"到底怎么学

社区已沉淀出一套成熟技术体系。按优先级排列：

**方法 1：生成-学习-破坏-修复循环（最推荐）**
来自 XDA Developers《我用 vibe-coding 真正学习了编程》：
1. 逐行提问，要求 AI 解释**为什么**选这种方法（不是"这是什么"）
2. 故意破坏代码，**自己修复，不让 AI 修**
3. 阅读文档，学底层原理
4. "从创造开始，理解随之而来——只要你刻意去追寻它。Vibe coding 是起跑线，不是终点。"

**方法 2：审问我模式**
来自 Nolan Lawson《Using AI to write better code more slowly》：
- 用 Matt Pocock 的 `/grill-me` 技能，在合并 PR 前让 Claude 逐块审问你，直到你能完整解释每一行
- 把 AI 当**审查伙伴**而非编写者
- 关键句："AI 生成的代码就是别人的代码。阅读和理解别人的代码比写代码难得多。"
- "开发者要对发布的每一行代码负责——不只是自己写的行，还有 AI 生成的行。"

**方法 3：AI 作为调查工具，而非解决方案提供者**
- 遇到 bug，先自己调试（比如时区问题），**在让 AI 修之前**自己定位
- 智能体发现 bug，你仍然需要理解它们——领域知识是先决条件

**方法 4：Fowler 的学习闭环第三步——从记忆中重新实现**
这是最容易被跳过的、也最关键的一步：
- AI 帮你理解和写出方案后，**关掉 AI，从空白文件重新实现一遍**
- "这种检索和使用知识的行为将碎片化的信息转化为持久的技能。"
- Fowler 的核心警告：**"微小的失败和'顿悟'时刻是学习的核心特性，而不是需要被自动化掉的 bug。"**

**方法 5：Simon Willison 的对抗性验证**
- 手动测试 AI 输出，超越自动化测试：用 `python -c` 手动跑选项看能否发现边缘情况
- **修复流程，而不是单个 bug**：当代码出问题，修生成代码的流程（提示、CLAUDE.md 指令），而不是手动补丁
- 保持人类作为 DRI："智能体永远不应被视为项目的 DRI。"

**方法 6：写"是什么和为什么"推理日志**
让 Claude Code 维护一个 markdown 文件记录你的推理——把它写下来会强迫你理解它。

### 10.4 learning mode 怎么用才对学习有帮助

见 10.1：它不是官方功能，是 `learning-output-style` 插件。要让它真正帮你学习，**不能只是让它更啰嗦**，要主动配合：

**当 Claude 留 TODO 给你时，必须自己填**
插件会在业务逻辑、错误处理、算法选择处留 5-10 行空给你。**这是你学习的最大机会窗口**——不要跳过说"你帮我写吧"，自己写，写错了让 Claude 审查你的实现。

**把 `★ Insight` 块当成复习卡**
把它们抄进一个 `insights.md` 文件，每周回看——这是你自己提炼的"专业语言"。

**关掉它的"自动驾驶"**
在 CLAUDE.md 里加一条规则：
> "在写任何超过 10 行的实现前，先用伪代码或要点描述你打算怎么做，等我确认后再写。"

这把 Claude 从"编写者"降级为"结对伙伴"，强行把你拉回设计层。

**用 `/powerup` 学 Claude Code 本身**
官方 v2.1.90 引入的 `/powerup` 是终端内动画互动课程，教你怎么用 Claude Code 的功能（不是教编程）。先把这个学完，否则你连工具都用不顺。

### 10.5 6 个月里程碑路径

**第 1 个月：Python 基础 + 工具链 + 一个能跑的东西**

里程碑：
- 装好 Python、VS Code、Claude Code，配置好 `learning-output-style` 插件
- 用 Python 写一个**命令行小工具**（不是 todo app——选你硬件相关的，比如：解析串口日志、CSV 转 JSON、给某个固件版本号做 bump 脚本）
- 全程用 Claude Code，但**每段代码都按 10.3 的"生成-学习-破坏-修复"循环走**

验证标准：
- 能解释自己项目里每一个函数的作用，不看代码也能说
- 能独立从空文件写出至少 3 个函数，不查 AI
- Git 基本操作（init / add / commit / log）熟练

**第 3 个月：CSAPP 实验室 + 第二个项目（带测试）**

里程碑：
- 完成 CSAPP 的 **Data Lab** 和 **Bomb Lab**（C 语言、位运算、汇编逆向）。这是硬件工程师的优势区
- 第二个项目：带**单元测试**和**错误处理**的 Python 项目
- 引入 Claude Code 的 `CLAUDE.md` 写项目规则

验证标准：
- Bomb Lab 能独立拆解至少 3 个 phase
- 能用 `pytest` 写测试，能解释"为什么先写测试再写实现"
- 能在 PR 里指出 Claude 生成代码的至少 1 个问题（命名、冗余、边界）

**第 6 个月：读一个开源项目 + 独立产出**

里程碑：
- 选一个**小型、活跃、文档好**的 Python 开源项目
- 给它提一个 PR——哪怕只是文档改进或一个小 bug 修复
- 自己的项目升级到：有结构（模块/包）、有 CI（GitHub Actions 跑测试）、有 README 写明设计决策

验证标准：
- 能在 30 分钟内对一个陌生 Python 文件画出调用关系草图
- 开源项目 maintainer 接受你的 PR（或给出可操作的修改意见）
- 你自己项目的代码，6 个月后回来能 10 分钟内重新进入状态

### 10.6 该学什么语言入门

**2026 年社区共识：Python 第一。**

- Stack Overflow 2025 开发者调查：Python 增长最快（同比 +7 个百分点），由 AI/数据科学拉动
- dev.to 2026 指南："从 Python 或 JavaScript 开始。Python 用于数据/AI/通用；JS 用于 Web/快速视觉反馈。开始比完美的选择更重要——编程原则可以在语言之间迁移。"

**给硬件工程师的特定理由**：
1. **Python 在嵌入式/硬件领域无处不在**：MicroPython、CircuitPython、Adafruit 库、pyserial、numpy、Raspberry Pi 生态。你写的 Python 能直接和你的硬件背景对接
2. **CSAPP 实验室用 C**——这正好补你第二语言。Python 在前，C 在 CSAPP 实验室里并行学，是天然组合
3. **JS 的优势是视觉反馈快**——但对你（不做前端为主）不是首选

**不推荐作为第一门**：Rust（学习曲线陡，虽然你喜欢高性能栈，但应等基础扎实后再学）、Go（同理，等 Python 熟了再学第二门更高效）。

### 10.7 怎么避免"只会让 Claude 写，自己什么都没学到"

这是 vibe coding 最大的学习风险，社区对此**达成了惊人共识：陷阱真实存在，且对被动使用者致命**。

**认清陷阱长什么样**：
- 《The vibe coder's career path is doomed》最残酷的描述：失去"心智地图"——"Vibe coding 用速度换取了清晰度。你不是在编程，你是在当保姆。"
- HN 评论者："当我在 vibe coding 时，我并没有学习如何自己解决问题——你碰壁了，甚至不知道如何寻求正确的修复方法。"
- Simon Willison 警告**"偏差的正常化"**：每次模型在无人监控下正确编写代码，都会让你在错误的时间信任它

**可执行的对抗措施（按重要性排序）**：
1. **短缰绳 + 特定目的**：用 Claude Code 做代码库导航、调查、琐碎改动；一遇到核心逻辑，自己跳进去。不要因为忘了文件在哪就让 AI 去改——如果你连文件位置都不知道，你已经迷失了
2. **对抗"对手动修改代码的抵触"**：如果你发现自己不愿手动改一行代码，那是危险信号。刻意手动改，哪怕慢
3. **每段 AI 代码，关掉 AI 重写一遍**（Fowler 第三步）
4. **每段 AI 代码，用 `/grill-me` 让 Claude 反向考你**（Nolan Lawson）
5. **手动测试 AI 输出**，不止跑自动化测试（Simon Willison）
6. **写"是什么和为什么"日志**，强迫自己表达

**平衡性反方观点**（避免过度悲观）：
- 也有人见证了新手通过 Cursor + 学习 AI 输出成为"真正的开发者"
- 区别在于**你是否处理 AI 留下的烂代码**——只要你做"处理烂代码"的那个人，你就还在学习

### 10.8 推荐的精选资源（少数，不堆砌）

**书（3 本，按优先级）**：
1. **CS:APP（Computer Systems: A Programmer's Perspective）** — 自学软件工程师最被忽视的科目，硬件工程师的黄金起点，11 个强制互动实验室。TYCS 头号推荐
2. **Designing Data-Intensive Applications (DDIA, Martin Kleppmann)** — TYCS"如果只读两本"的第二本，覆盖分布式/数据库/存储，适合你想往高性能栈走的方向
3. **Skiena《Algorithm Design Manual》** — 算法实战导向，替代 CLRS 的证明密集。配 100 道 LeetCode

**课/交互平台（3 个）**：
1. **Nand2Tetris**（https://www.nand2tetris.org/）— 免费全栈自建，从 NAND 到操作系统。硬件工程师前几章零阻力
2. **CSAPP 官方实验室**（https://csapp.cs.cmu.edu/）— Bomb Lab / Attack Lab / Data Lab，AI 无法替你做
3. **LeetCode（按需）**— 配 Skiena，做 100 题足够，不要刷成应试

**Claude Code 学习**：
- `/powerup`（官方终端互动课程，学工具本身）
- 本地 `learning-output-style` 插件（已装，配合 10.4 方法用）

刻意不列一堆。这 3+3+工具就够你用 6 个月。

### 10.9 硬件工程师学软件的独特优势和劣势

**优势（扬长）**：
1. **底层心智模型已有**：寄存器、内存、中断、时序、二进制——这些是 CSAPP 前 5 章的内容，软件背景的人要学一学期，你已经会。Bomb Lab 的汇编逆向对你相对容易
2. **Nand2Tetris 前半程零摩擦**：逻辑门、ALU、CPU 你都懂，可以直接进入软件层
3. **真实硬件接口的学习动机**：Python + pyserial + 你的硬件，能立刻做出有意义的工具，不是空泛的 todo app
4. **对"性能"的直觉**：你知道一个 cache miss 多贵，软件人不知道。这对你学高性能栈（DDIA、Rust）是长期优势

**劣势（补短）**：
1. **抽象层次跳跃不适应**：硬件是"一切都在明处"，软件是"层层抽象藏起细节"。这是软件工程的核心机制，不是 bug
2. **不熟悉高层抽象的"约定"**：设计模式、依赖注入、接口与实现分离——这些是软件人呼吸的空气，对你是新概念
3. **工具链生态陌生**：pip / npm / venv / Docker / CI
4. **"系统化测试"思维弱**：硬件测试是波形和边界条件，软件测试是单元/集成/属性测试，方法论不同
5. **容易低估"可维护性"**：硬件交付后改不动，软件交付后改 100 次

**扬长补短的具体动作**：
- 扬长：第 1-3 个月用 CSAPP + Nand2Tetris 快速建立信心，用硬件相关 Python 项目保持动机
- 补短：第 3 个月起刻意学**设计模式**（用《Head First Design Patterns》或 Claude 解释）、**单元测试**（pytest 实操）、**依赖管理**（venv + pip-tools）
- 不补：不要试图补"前端审美"——那是另一个 6 个月。专注后端/系统/工具链

### 10.10 "读开源项目"对学习有用吗

**有用，但读法决定一切。盲目读大型项目是浪费时间。**

**读什么级别**：
- **不要**：Linux kernel、CPython、React——太大，你会迷失
- **要**：小型、活跃、文档好、单一职责的 Python 项目。候选：`httpie`（HTTP CLI，代码干净）、`rich`（终端美化，单文件可读）、`tqdm`（进度条，极小）、`pyserial`（和你硬件背景相关）

**怎么读**：
1. **先跑起来，不改一行**：clone、装依赖、跑通 README 的 demo。读不懂的代码连跑都跑不起来，没意义
2. **从入口追一条调用链**：找到 `main()`，顺着一条用户操作追到底，画调用关系图。Claude 可以帮生成调用图，但图要你自己画一遍
3. **改一个小东西，看会不会坏**：改一个字符串、改一个默认值，跑测试看反应
4. **读测试文件**：好项目的测试就是活的文档。读 `test_xxx.py` 比读源码更快理解意图
5. **挑一个 issue 试着修**：从 `good first issue` 标签里挑——这是从"读"到"贡献"的跳板

### 10.11 怎么判断自己在进步——可量化信号

**每周可测**：

| 信号 | 怎么测 | 通过标准 |
|---|---|---|
| 不看 AI 能解释的函数数 | 随机挑 3 个本周 AI 写的函数，关掉 Claude 自己讲 | 能讲清 2/3 |
| 手动改代码不抵触 | 本周手动改的行数 vs AI 改的行数 | 至少 1:3 |
| `★ Insight` 笔记积累 | 抄进 `insights.md` 的条数 | 每周 +3 条 |
| 独立写出的函数 | 从空文件写，不查 AI | 每周 +2 个 |

**每月里程碑**：

| 月 | 信号 |
|---|---|
| 1 | 能 10 分钟内从空文件写出一个 50 行的 Python 脚本并跑通 |
| 3 | 能在 PR 里指出 Claude 代码的至少 1 个真实问题 |
| 6 | 给开源项目提的 PR 被接受或获可操作反馈；自己项目 6 个月后回来看 10 分钟内进入状态 |

**负信号（出现就停下来反思）**：
- 你忘了项目里某个文件的位置，第一反应是问 Claude 而不是自己找
- 你无法解释上周自己"写"的代码
- 你 3 周没手动改过任何代码，全是 AI 在改
- 你的 `insights.md` 3 周没新增

这些是"偏差正常化"和"失去心智地图"的早期症状。

### 10.12 一页速查（贴在显示器旁）

1. **learning mode 是插件不是功能**，要主动配合（填 TODO、抄 Insight、关掉自动驾驶）
2. **Python 第一**，CSAPP + 实验室并行，CLRS 不通读用 Skiena
3. **学习闭环第三步必做**：AI 帮你后，关掉 AI 重写一遍
4. **`/grill-me` + 生成-学习-破坏-修复**，每段 AI 代码都走一遍
5. **短缰绳**：Claude 做导航/调查/琐碎，核心逻辑自己写
6. **读小型开源项目**：跑通 → 追一条调用链 → 改一个小东西 → 提 PR
7. **负信号**：忘了文件位置、无法解释上周代码、3 周没手动改——任一出现就停
8. **6 个月目标**：独立项目 + 开源 PR + 6 个月后能 10 分钟重进入自己代码

`★ Insight ─────────────────────────────────────`
你是硬件工程师，**CSAPP + Python + 短缰绳式 Claude Code + 强制手动重写**，是你比纯软件背景的人学得更快、且不会被 AI 取代的路径。这章的核心心智是第 1 章的"你是 DRI"在学习层面的落地——你对每行 AI 代码负责，所以你必须能看懂、能解释、能改它。vibe coding 不是学习的替代品，是学习的加速器，前提是你主动抓住"摩擦点"（TODO 空位、Insight、手动重写、grill-me）而不是让 Claude 全自动。你之前"看不到提升路径"的迷茫，根因是缺这套摩擦机制——learning mode 插件装了但没主动配合，所以只是更啰嗦的 Claude。现在有了这套可量化的里程碑，你能清楚知道自己在哪。
`─────────────────────────────────────────────────`

---

## 11. 防流产清单与行动起步

### 11.1 提交节奏

- [ ] 每个 working slice 完成 → commit
- [ ] 每次让 Claude 做危险动作前 → commit
- [ ] `/clear` 前 → commit
- [ ] 每 30-60 分钟至少一次 commit，哪怕是 WIP
- [ ] commit message 写人话，别写 "fix" / "update"，写"加登录页，还没接后端"

### 11.2 切片纪律

- [ ] 项目里**永远有一个能跑的版本**，哪怕只能跑一个最蠢的功能
- [ ] 下一个 slice 只加**一条**新功能，不一次加五条
- [ ] 一个 slice 没跑通之前，不开始下一个
- [ ] 第一个 slice 要小到让你觉得"这太简单了吧"

### 11.3 交接文档

- [ ] 项目根目录放 `CLAUDE.md`（稳定约定，每会话自动加载，进 git）
- [ ] 可选：`HANDOFF.md`（当前状态，需你让 Claude 读，进 git）
- [ ] 可选：`TODO.md`（未来待办，需你让 Claude 读，进 git）
- [ ] 每次收工时花 2 分钟说："更新 CLAUDE.md 的当前进度 + 写 HANDOFF.md"
- [ ] HANDOFF.md 必写"下次会话第一件事"和"放弃的方案"
- [ ] commit message 写人话

### 11.4 /clear 时机

- [ ] 一个 slice 完成并 commit 后 → /clear
- [ ] 对话明显变慢、Claude 开始忘事 → /clear
- [ ] 想换方向 → 先 commit + 更新 CLAUDE.md/HANDOFF.md，再 /clear
- [ ] 用 `/context` 看占用，到 200-300K 甜点区前主动 /clear

### 11.5 范围纪律（防 scope creep）

- [ ] 把"以后想做但不属于当前 slice 的想法"写进 `TODO.md`，**不立刻做**。这一条是防流产最有效的
- [ ] 一个 slice 的定义写在一句话里，超出这句话的"顺便改一下"全部进 TODO
- [ ] 每次开新会话先问自己：今天要做的那一条 slice 是什么？只做它

### 11.6 Bug 审查纪律

- [ ] 审查最多两轮，第二轮的问题进 TODO
- [ ] 只修影响当前切片的 bug，其他进 TODO
- [ ] 用 `/code-review` 而不是自然语言审查
- [ ] 新 bug 比上轮多 → 立即停
- [ ] 把"找 bug"换成"跑检查"（测试/build/`/verify`），检查通过即停

### 11.7 Skills/MCP 纪律

- [ ] 起步：context7 + sequential-thinking + fetch 三个 MCP，summarize-changes + commit 两个自己写的 skill
- [ ] 个人 skill 总数控制在 8 个以内
- [ ] 有副作用的 skill 加 `disable-model-invocation: true`
- [ ] 用 `/context` 看 Skills 行占用，超 2% 就精简
- [ ] 不懂一个 skill 在干嘛就别装——至少能读懂 SKILL.md

### 11.8 学习纪律

- [ ] 每段 AI 代码，关掉 AI 从空白重写一遍
- [ ] 抄 `★ Insight` 进 `insights.md`，每周回看
- [ ] learning mode 留的 TODO 空位必须自己填
- [ ] 负信号出现（忘了文件位置、无法解释上周代码、3 周没手动改）→ 立即停
- [ ] 每月对照 10.11 的里程碑信号检查进度

### 11.9 为什么这套能防流产

流产的本质是"做了一半没有能用的东西，下次打开已经忘了在干嘛，不想碰了"。

切片 + commit + 交接文档 + 范围纪律 + bug 审查纪律 + 学习纪律六件套直接打这三点：
- 任何时候都有能用的东西（切片 + commit）
- 任何时候停下来都能续上（交接文档）
- 回来时不用回忆（TODO + HANDOFF + CLAUDE.md）
- 不会越做越乱（范围纪律 + bug 审查纪律）
- 不会失血（学习纪律，确保你看得懂自己"写"的代码）

### 11.10 你的下一步行动

**立刻做（今天）**：
1. 读两遍这份指南，特别是第 9 章 Bug 螺旋和第 10 章学习路径
2. 跑 `/powerup` 学 Claude Code 本身
3. 把身份写进 `~/.claude/CLAUDE.md`：对 Claude 说"把以下内容加到 ~/.claude/CLAUDE.md：我是硬件工程师，业余开发，想边写边学。偏好前沿高性能技术栈。全程用简体中文。"

**本周做**：
1. 装好 Git（`sudo apt install -y git`）+ 配置身份 + 注册 GitHub + 生成 PAT（见第 5 章）
2. 装三个 MCP：context7 + sequential-thinking + fetch（见第 8 章）
3. 选一个你真的想做的小项目（命令行小工具，不要选大的）

**两周内做**：
1. 严格按第 4 章的 30 分钟例行启动它
2. 每个切片完成后，严格按第 11 章清单过一遍
3. 跑完 3-5 个切片，你会建立"我能让一个项目活着"的信心

**一个月内做**：
1. 对照 10.5 的第 1 个月里程碑检查
2. 开始 CSAPP + Nand2Tetris（硬件背景优势区）

### 11.11 一句话总纲

**CLAUDE.md 记录项目状态 + Git 做安全网 + HANDOFF.md + /clear 控制上下文 + 切片式推进 + 主动学习防失血 = 业余开发者的项目可以长期延续，且你在进步。**

---

## 参考来源

**Anthropic 官方文档**
- Best practices for Claude Code: https://code.claude.com/docs/en/best-practices
- How Claude remembers your project (memory/CLAUDE.md): https://code.claude.com/docs/en/memory
- Explore the context window: https://code.claude.com/docs/en/context-window
- Sessions: https://code.claude.com/docs/en/sessions
- Checkpointing: https://code.claude.com/docs/en/checkpointing
- Permission modes: https://code.claude.com/docs/en/permission-modes
- Commands 参考: https://code.claude.com/docs/en/commands
- Common workflows: https://code.claude.com/docs/en/tutorials
- Set up Claude Code in a large codebase: https://code.claude.com/docs/en/large-codebases
- Create custom subagents: https://code.claude.com/docs/en/sub-agents
- Skills: https://code.claude.com/docs/en/skills
- MCP: https://code.claude.com/docs/en/mcp
- Hooks: https://code.claude.com/docs/en/hooks-guide
- Plugins: https://code.claude.com/docs/en/plugins

**Git + GitHub**
- Pro Git 中文版（官方书，免费）: https://git-scm.com/book/zh/v2
- Git 官方文档: https://git-scm.com/docs
- GitHub Docs 入门: https://docs.github.com/en/get-started
- 创建仓库: https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-new-repository
- PAT 管理: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens
- SSH 连接 GitHub: https://docs.github.com/en/authentication/connecting-to-github-with-ssh
- Fork 工作流: https://docs.github.com/en/pull-requests/collaborating-with-pull-requests/working-with-forks
- .gitignore 模板集: https://github.com/github/gitignore

**Skills / MCP 生态**
- Agent Skills 标准: https://agentskills.io
- Quickstart: https://agentskills.io/skill-creation/quickstart
- 官方示例 skill 仓库: https://github.com/anthropics/skills
- 官方 plugin marketplace: https://github.com/anthropics/claude-plugins-official
- MCP 官方参考 servers: https://github.com/modelcontextprotocol/servers
- context7: https://github.com/upstash/context7
- ostikwhy-blip handoff skill: https://github.com/ostikwhy-blip/claude-code-handoff-skill
- guvencem handoff-md CLI: https://github.com/guvencem/handoff-md
- Anthropic Directory（MCP 发现）: https://claude.ai/directory

**学习路径**
- Teach Yourself CS: https://teachyourselfcs.com/
- Nand2Tetris: https://www.nand2tetris.org/
- CSAPP 官方实验室: https://csapp.cs.cmu.edu/
- Stack Overflow 2025 开发者调查: https://survey.stackoverflow.co/2025
- Martin Fowler 学习闭环: https://martinfowler.com/articles/llm-learning-loop.html
- Nolan Lawson "Using AI to write better code more slowly": https://nolanlawson.com/2026/05/25/using-ai-to-write-better-code-more-slowly/
- Simon Willison "Vibe coding and agentic engineering": https://simonwillison.net/2026/May/6/vibe-coding-and-agentic-engineering/
- Simon Willison "Directly Responsible Individuals": https://simonwillison.net/2026/Jul/12/directly-responsible-individuals/
- XDA "我用 vibe-coding 真正学习了编程": https://www.xda-developers.com/used-vibe-coding-to-learn-programming-worked-better-than-any-course/
- "The vibe coder's career path is doomed": https://blog.florianherrengt.com/vibe-coder-career-path.html

**软件工程经典**
- Martin Fowler 实用测试金字塔: https://martinfowler.com/articles/practical-test-pyramid.html
- Joel Spolsky "Things You Should Never Do"（为什么不重写）: https://www.joelonsoftware.com/2000/04/06/things-you-should-never-do-part-i/

---

> 这份指南本身也适用切片原则——它不是一次写完的完美文档，而是一个可以随你经验增长而更新的活文档。如果你在实践中发现某条规则不 work，回来改它。如果你按这套方法跑通了第一个项目，也欢迎回来告诉我哪里有用、哪里没用，我们一起迭代它。
