# Skills 与 MCP 生态：选装评换全流程

这一章解决"不懂代码 → 不会选 Skills/MCP → 笨上加笨"的死循环。要同时讲清"装太多变笨"和"裸奔也笨"两边的平衡。

## Skill 是什么

Skill 是一个文件夹，里面有一个 `SKILL.md` 作为入口，外加可选的脚本、模板、参考文档。一句话：**skill 是给 Claude 看的"说明书"，告诉它在某类任务上该怎么做**。

和 CLAUDE.md 的区别：CLAUDE.md 是常驻上下文（每轮都在），skill 的正文**只在被调用时才加载**，平时只占一个名字+描述的极小开销。所以长篇参考资料写成 skill 几乎零成本，直到真正用到才付 token。

## SKILL.md 的结构

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

## 自动触发 vs 手动调用

默认情况下，**你和 Claude 都能调用任何 skill**。两种触发路径：

| 路径 | 机制 | 例子 |
|---|---|---|
| **Claude 自动用** | 启动时只加载 name+description。你说的话匹配上 description，Claude 就把整个 SKILL.md 正文读进上下文，然后照着做 | 你说"帮我看看改了啥"，Claude 自动触发 `summarize-changes` skill |
| **你手动调** | 你输入 `/skill-name`，直接强制加载 | 你输入 `/deploy`，无论对话在说什么都执行部署流程 |

两个 frontmatter 字段可以锁死方向：

- `disable-model-invocation: true` → **只有你能 `/名字` 调，Claude 不会自己触发**。用于有副作用、你不想让 AI 自己决定的流程（部署、commit、发消息、删数据）
- `user-invocable: false` → **对你隐藏，只有 Claude 能自动触发**。用于"背景知识"型 skill

**实操建议**：有副作用的 skill（部署、commit、发通知）一律加 `disable-model-invocation: true`；纯知识/规范类 skill 保持默认让 Claude 自己判断；你觉得 Claude 该用却没用，就直接 `/名字` 手动触发。

## 怎么装一个 skill

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

文件夹名 = 你 `/` 后面要敲的名字。所以 `pr-summary` 文件夹 → 你输入 `/pr-summary` 触发。

**装完怎么验证**：
- 输入 `/` 看自动补全菜单
- 输入 `What skills are available?` 让 Claude 列出
- **Live change detection**：你在 `~/.claude/skills/` 下增删改 `SKILL.md`，当前会话内就生效，不用重启

## 怎么知道一个 skill 好不好、适不适合自己

这是一套可执行的评估清单。

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

## "坏 skill 指导出来的代码会不会变屎山"——会，机制和避免方法

**会。** 这是真实风险，不是吓唬。机制有三层：

**第一层：description 写歪 → Claude 在不该用的时候用它**
比如 skill 的 description 是"用于优化代码"，Claude 可能在你只是想加个注释时也触发它，然后用一套不相关的"优化"流程把简单改动搞复杂。症状：简单任务被过度设计。

**第二层：正文指令本身是错的或过时的 → Claude 照着错的做**
比如 skill 里写"用某 API 的 v2 接口"，但该 API 已经升到 v4 且 v2 已删除。Claude 会忠实按 skill 写 v2 调用，产出编译不过或运行即崩的代码。

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

## 装多少合适？怎么判断临界点

**官方硬指标**：
- Skill 列表预算 = 上下文窗口的 **1%**（可调）
- Auto-compaction 后所有 skill 共享 **25,000 token** 预算，每个保留前 5,000 token
- MCP 工具默认开启 tool search（deferred loading），只有真正用到的工具才进上下文，所以 MCP 装多一些对上下文压力比 skill 小

**用 `/context` 看实际占用**：`/context` 命令显示当前上下文各部分占用，其中 **Skills 行** = skill 列表总大小。

- Skills 行 < 上下文窗口的 2% → 健康，可以再装
- Skills 行接近 1% 预算上限 → 已经在砍描述了，别再加
- `/context` 整体占用 > 70% → 接近 compaction，该 `/clear` 或开新会话

**具体数字建议**：
- **起步**：personal skills 2-3 个 + bundled skills 用自带的（`/code-review`、`/verify`、`/run`）
- **成长期**：用两周后发现某个重复操作想固化成 skill 再加，**总个人 skill 数控制在 8 个以内**
- **红线**：`/doctor` 报告 skill 列表超预算，或 `/context` 的 Skills 行明显偏大 → 精简
- **MCP 不受此限那么严**：tool search 默认开启，装 5-10 个 MCP 对上下文影响很小

## 推荐 Starter Pack

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

**不建议一上来就碰的**：各种 LSP plugin（clangd/gopls）、数据库类 MCP（需要真实凭证）、`mcp-server-dev`（自己开发 MCP 用的）。

## 大型方法论 skill 集合怎么评估

评估任何大型方法论 skill 集适合不适合自己的判断框架：

1. **它假设的工作流和你实际场景匹配吗？** 如果你的项目是"改两行配置看看效果"的探索性 vibe coding，整套流程是过度约束，会让简单任务变重
2. **它的 skill 数量会不会撑爆你的上下文预算？** 大型集合一次注入十几个 skill 的 description，小项目可能直接占满 1% 预算。装之前先看 `/doctor`
3. **你能不能读懂它的 SKILL.md？** 如果你打开它的 SKILL.md 看不懂它在要求 Claude 做什么，那你也无法判断 Claude 是不是在正确执行——这等于把方向盘完全交出去。**底线：至少能读懂 skill 在说什么**
4. **有没有退路？** 装 plugin 后能不能干净卸载（`/plugin uninstall`）？会不会在项目里留下 `.claude/` 配置？先在一个 throwaway 测试项目里试
5. **它要不要额外依赖？** 有些 skill 要 Python/Node 特定版本
6. **小步试**：先只启用其中 1-2 个 skill，用一周，再决定要不要全开

**直接建议**：这类大型方法论 skill 集合起步时太重。等写过 2-3 个小项目、能看懂 SKILL.md 之后，再考虑试它单个 skill。

## MCP 是什么、怎么装、从哪找

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

起步用 **local 或 user**。`claude mcp add --scope user ...` 装一次所有项目都能用。

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

## Skill 更新：怎么更新？中途换 skill 会不会让旧代码变屎山？

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

## 自己写一个 skill 难不难？初学者能不能写？

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

**关键概念：``!` ```` 动态注入**——`` !`git diff HEAD` `` 这一行在 skill 发给 Claude 之前，Claude Code 会先执行命令、把输出替换进来。Claude 看到的是真实 diff 内容，不是命令本身。这是写 skill 最有用的特性之一。

**初学者写 skill 的路线图**：
1. 抄官方 summarize-changes 示例，改命令，跑通
2. 把你发现自己重复粘贴进对话的指令固化成 skill
3. 加 frontmatter 控制行为——有副作用的加 `disable-model-invocation: true`
4. 用 `/skill-creator` 的 evaluate 功能跑 A/B 测试
5. 把常用参考文档放成单独文件，SKILL.md 只写导航

**你不需要会写代码就能写 skill**：SKILL.md 本质是 markdown + 几行 YAML。你完全可以让 Claude 帮你写——直接对 Claude 说"帮我写一个 skill，它的作用是 X，放在 ~/.claude/skills/ 下"，Claude 会用 Write/Edit 工具直接给你创建好。

---

`★ Insight ─────────────────────────────────────`
陷入的死循环——"不懂代码 → 不会选 Skills/MCP → Claude 更傻"——的破解点**不是"学更多 Skills"，而是"先做对基础，再装少量精选 Skills"**。裸奔的 Claude Code + 好的 CLAUDE.md + git + 切片，比装满 Skills 的 Claude Code 强得多。Skills 是乘数，但基础是 0 时，乘数再大也是 0。先把基础做对（前 7 章），再加 Skills（这章）。每个 Skill/MCP 都有三重成本：上下文 token、认知负担、误触发风险。最稀缺的是上下文窗口和注意力，不是工具数量。
`─────────────────────────────────────────────────`