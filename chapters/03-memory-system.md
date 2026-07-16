# 记忆体系深潜

这一章把整个记忆体系讲透。

## 记忆目录的实景结构

`~/.claude/projects/<项目名>/memory/` 下的典型结构：

```
memory/
├── MEMORY.md                       # 索引文件（入口，每会话自动加载前 200 行/25KB）
├── language-preference.md          # 主题文件（按需读取，不自动加载）
├── user-profile.md                 # 主题文件
├── collaboration-style.md          # 主题文件
├── env-setup-decisions.md          # 主题文件
└── ...                             # 更多主题文件
```

**它们是什么**：这是 Claude Code 的**自动记忆（Auto Memory）**系统。Claude 在会话中自己写笔记，按主题分成多个 .md 文件。

**谁写的**：Claude 自动写的。你不需要手动创建任何文件。Claude 在对话中判断"这个信息将来有用"，然后自己写进这些文件。

**为什么按主题分**：因为 `MEMORY.md` 有大小限制——每次会话只加载前 200 行或 25KB（先到为准）。所以 Claude 的策略是：`MEMORY.md` 只放**简短索引**（每行一条链接），详细内容放到主题文件里。主题文件不会被自动加载到上下文，只有 Claude 需要的时候才去读。

**主题文件的格式**：每条记忆文件开头有 YAML frontmatter，包含 `name`、`description`、`metadata`（记录了创建该记忆的会话 ID）。这让 Claude 知道这条记忆是什么、来自哪个会话。

## "自动记忆"到底什么时候触发？为什么很少触发？

Claude 确实很少自动记忆。原因是 **Claude 对"什么值得记住"非常挑剔**。官方文档原话：

> Claude doesn't save something every session. It decides what's worth remembering based on whether the information would be useful in a future conversation.

所以不是你关了它，而是 Claude 的"值得记"标准很高。自动记忆默认是开启的。

## 怎么让 Claude 一定记住？（关键技能）

**主动说"记住"**。Claude 对"记住"这个指令很敏感，你一说它就会写记忆文件。

**对话措辞示例**（直接复制使用）：

| 你想存什么 | 对 Claude 说的话 |
|---|---|
| 你的身份 | "记住我是初学者，想边写边学。" |
| 技术栈偏好 | "记住我偏好 Python 和 JavaScript。" |
| 协作风格 | "记住写代码时要讲解，不要只丢代码给我，我需要学到东西。" |
| 语言偏好 | "记住全程用简体中文。" |
| 工具偏好 | "记住不要用 yarn，我全程用 pnpm。" |

## 验证是否记住了

运行 `/memory` 命令。它会列出所有已加载的 CLAUDE.md 文件、规则文件，同时提供一个链接打开 auto memory 文件夹。

## 五大机制对比表

一次性把五样东西的定位讲清：

| 机制 | 谁写 | 谁读 | 什么时候用 | 加载时机 |
|---|---|---|---|---|
| **Auto Memory**（`~/.claude/projects/.../memory/`） | Claude 自动写 | Claude 自动读 | Claude 发现的偏好、构建命令、调试技巧 | MEMORY.md 前 200 行/25KB 每会话加载；主题文件按需读 |
| **CLAUDE.md** | 你写 | Claude 读 | 给 Claude 的持久指令：编码规范、构建命令、项目架构 | 每会话完整加载 |
| **HANDOFF.md** | **不是官方功能**，你或 Claude 写（需你触发） | Claude 读（可在 CLAUDE.md 中用 `[HANDOFF.md](HANDOFF.md)` 链接让 Claude 识别并加载） | 跨会话交接当前状态 | **不会自动加载**，除非在 CLAUDE.md 里加了链接引用 |
| **TODO.md** | **不是官方功能**，你或 Claude 写 | Claude 读（需你让它读） | 待办清单 | **不会自动加载** |
| **Skills（SKILL.md）** | 你写 | 你或 Claude 按需调用 | 可复用工作流 | 描述每会话加载（约 450 tokens）；完整内容只在调用时加载 |

**关键纠正**：HANDOFF.md 和 TODO.md **不是** Claude Code 的官方功能。它们是社区/其他 AI 工具（如 Cursor）的约定。Claude Code 官方只自动加载 CLAUDE.md 和 Auto Memory。但 HANDOFF.md 可以通过一个技巧被 Claude 加载：在 CLAUDE.md 里写 `[HANDOFF.md](HANDOFF.md)` 链接（本指南自己就是这么做的，参见 CLAUDE.md 的交接文档一节）。TODO.md 没有对应的加载技巧，需要你主动让 Claude 读。

## MEMORY.md 索引文件怎么工作

看一个典型的 `MEMORY.md` 示例：

```markdown
# 记忆索引

- [语言偏好](language-preference.md) — 全中文约定
- [用户画像](user-profile.md) — 初学者，业余开发，想在 vibe coding 中学习
- [协作风格](collaboration-style.md) — 边写边讲、风险操作每次确认
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

## 跨项目的全局记忆 vs 项目级记忆

**记忆是按项目隔离的**。每个项目有自己的 `~/.claude/projects/<项目>/memory/`。

`<项目>` 怎么确定：
- 如果在 git 仓库里：用仓库标识
- 如果不在 git 仓库里：用项目根目录路径

| 你在哪启动 claude | 记忆堆在哪 |
|---|---|
| `~`（非 git 仓库） | `~/.claude/projects/-home-用户名/memory/` |
| `~/projects/xxx`（是 git 仓库） | `~/.claude/projects/-home-用户名-projects-xxx/memory/` 或按 git repo 标识 |

**全局记忆不存在**——没有"在所有项目间共享的自动记忆"。如果你想让 Claude 在所有项目都知道你的身份，把它写进 `~/.claude/CLAUDE.md`（用户级 CLAUDE.md，每会话自动加载）。

**记忆是机器本地的**——不会自动同步到别的机器或云端。

## 记忆会不会失效、过期？怎么删？

**不会自动过期**。Claude 写入的记忆文件会一直保留。但有隐性失效风险：
- 如果 `MEMORY.md` 超过 200 行，后面的行不会被自动加载
- 如果多条记忆互相矛盾，Claude 可能随机选一个
- 如果记忆内容过时（你换技术栈了），Claude 不知道它过时了

**删一条错的记忆**：
- 方法一（对话里说）："忘掉我之前说的'用 yarn'那条记忆，把它从记忆里删掉。"
- 方法二（手动编辑）：直接打开对应主题文件删除，并删 `MEMORY.md` 里那行索引
- 方法三（`/memory` 命令）：运行 `/memory`，选择 auto memory 文件夹，编辑或删除

## 配置建议

**想让所有项目都知道你**：把关键身份信息写进 `~/.claude/CLAUDE.md`。对 Claude 说：

> "把以下内容加到 ~/.claude/CLAUDE.md：我是初学者，业余开发，想边写边学。偏好 Python。全程用简体中文。"

**项目级偏好**：在该项目目录里对 Claude 说"记住 X"，Claude 会写进该项目的 memory。

---

> **💡 Insight**
>
> 记忆体系的设计哲学是"分层 + 按需"：稳定的、每次都要知道的（CLAUDE.md）每次全量加载；易变的、工作中发现的（Auto Memory）只加载索引，需要时再读主题文件。理解了这个分层，你就知道为什么 MEMORY.md 要保持简洁（否则超过 200 行后面的不被加载），也知道为什么 Claude 很少主动记忆——它只在"将来有用"时才记，避免索引膨胀。