---
title: CLAUDE.md 正确用法与交接文档实践
nav_order: 6
---

# CLAUDE.md 正确用法与交接文档实践

这一章解决两个核心痛点：(1) CLAUDE.md 怎么写、怎么更新、和 `/init` 什么关系；(2) HANDOFF.md 到底是不是自动的、第一次第二次交接怎么办。

## CLAUDE.md 的真相

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

## /init 和更新 CLAUDE.md 的关系

**`/init` 是什么**：一个一次性命令，让 Claude 分析代码库（检测构建系统、测试框架、代码模式），生成一份初始 CLAUDE.md。如果已存在 CLAUDE.md，`/init` 会建议改进而不是覆盖。

**两者的关系**：
- **项目刚开始（空文件夹或刚有少量代码）**：不要 `/init`，直接对 Claude 说"帮我写 CLAUDE.md"——它会根据你的想法生成
- **项目跑起来、有结构了**：跑一次 `/init`，让它分析代码库补全你没想到的约定（构建命令、测试命令、目录结构）
- **开发到中途想更新**：**不要**再跑 `/init`（它会以为是新项目要重新生成）。直接对 Claude 说"更新 CLAUDE.md 的当前进度一节"或"把这条约定加到 CLAUDE.md"

**中途更新的时机**：
- 完成一个切片 → 更新"当前进度"一节
- 做了一个重要的技术决策（比如换了某个库）→ 加到"技术栈"或"决策记录"一节
- 发现 Claude 反复犯同一个错 → 把"不要这样做"的规则加进去
- `/clear` 之前 → 一定更新一次，保证下次会话能续上

**具体更新措辞**：
> "更新 CLAUDE.md：把当前切片标记为完成，写下一切片目标。另外把'使用 pnpm 而不是 npm'加到编码约定里。"

## CLAUDE.md 应该写什么

如果你说"技术细节一条都写不出来"——**所以让 Claude 写**。你的职责是给模糊信息，Claude 负责结构化。

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

## HANDOFF.md 的真相

**HANDOFF.md 不是 Claude Code 的官方功能**。官方推荐的跨会话连续性机制是三件套：CLAUDE.md + Auto Memory + `/resume`/`/compact`。HANDOFF.md 是**民间社区约定**（主要来自 Cursor 等其他 AI 工具），Claude Code 官方文档里查无此词。

这意味着：
- Claude **不会自动写** HANDOFF.md，必须你触发
- Claude **不会自动读** HANDOFF.md——但有一个技巧：在 CLAUDE.md 里写 `[HANDOFF.md](HANDOFF.md)` 链接，Claude 看到这个链接就会识别并加载它。本指南就是这么做的，参见 CLAUDE.md 的"交接文档"一节。
- 如果 CLAUDE.md 里没有这个链接，你需要说"读 HANDOFF.md"，Claude 就会读

**你需要 HANDOFF.md 吗？** 官方路线（CLAUDE.md + Auto Memory + `/resume`）对 90% 场景够用。**只有项目长到单会话 context 装不下、且需要跨多天跨切片硬核防失忆时，才上 HANDOFF.md**。如果上了，别忘了在 CLAUDE.md 里加一行 `[HANDOFF.md](HANDOFF.md)` 链接让它自动加载。

## 三件套分工：CLAUDE.md vs HANDOFF.md vs TODO.md

| 文件 | 时间属性 | 内容 | 谁写 | 改动频率 |
|---|---|---|---|---|
| **CLAUDE.md** | 稳定（长期规则） | 构建命令、代码规范、项目架构、决策记录 | 你写（或让 Claude 写） | 周/月级 |
| **HANDOFF.md** | 易变（当前状态快照） | 当前目标、已验证状态、死路、下一步、开放问题 | Claude 在交接时写（你触发） | 每次会话末 |
| **TODO.md** | 未来（待办清单） | 待做任务、已知 bug、未来计划 | 你 + Claude 协作 | 天级 |

**口诀**：
- **CLAUDE.md 是"宪法"**——稳定、规则性、写一次用很久、每会话自动加载
- **HANDOFF.md 是"白板"**——易变、当前状态、每次擦了重写、不会自动加载（除非在 CLAUDE.md 里加 `[HANDOFF.md](HANDOFF.md)` 链接）
- **TODO.md 是"购物清单"**——未来、待办、做完划掉、不会自动加载

**关键边界**：
- 不要把 TODO 塞进 CLAUDE.md（TODO 易变，会污染稳定的宪法）
- 不要把"构建命令"塞进 HANDOFF.md（构建命令是长期规则，进 CLAUDE.md）
- 不要把"决策理由"塞进 TODO.md（TODO 只记"做什么"，"为什么"进 CLAUDE.md 的决策记录段）

## 社区 skill：让 HANDOFF.md 半自动化

本指南附赠了一个 handoff skill，位于项目 `.claude/skills/handoff/`。装到全局即可在所有项目使用：

```bash
cp -r .claude/skills/handoff ~/.claude/skills/handoff
```

装完进任意 git 项目起 claude 会话，在会话末尾输入 `/handoff`，Claude 会：
1. 跑 `git status` / `git log` / `git diff` 确认真实状态
2. 读旧 HANDOFF.md（如有），搬运"失败的尝试"和"已知坑"
3. 写新 `HANDOFF.md` 到项目根
4. 旧文件归档到 `.handoffs/时间戳-handoff.md`（进 git）
5. **检查 CLAUDE.md 是否需要更新**——`[HANDOFF.md](HANDOFF.md)` 链接是否存在、当前进度是否过时、HEAD SHA 引用是否匹配
6. commit + push 所有变更（包括 HANDOFF.md、CLAUDE.md、代码变更）

> 别忘了在 CLAUDE.md 里加一行 `[HANDOFF.md](HANDOFF.md)`，这样新会话不用手动说"读 HANDOFF.md"，Claude 会自动加载它。handoff skill 会自动检查这一条是否存在，如果缺失会自动追加。

## 第一次交接写了 HANDOFF.md，第二次怎么办

社区实际做法是"替换 + 归档 + 死路搬运"，不是增量累积也不是直接覆盖：

- 新 `HANDOFF.md` 写到项目根，旧文件移到 `.handoffs/时间戳-handoff.md`（进 git，可追溯）
- **唯一例外**：旧文件里的"Failed approaches / 死路"和"Known traps / 坑"段落，如果仍未解决，会**前向搬运**到新文件并降级标 `[?]`（待复核）
- 所以本质是"每次写一份全新的，但死路历史被保留"

**不要建 LOG.md/DEVLOG.md**：git 本身就是天然的 chronological log（commit message + `git log --oneline` + `git reflog`），手写日志是重复劳动。`.handoffs/` 归档目录本身就是"关键节点快照序列"（进 git，可追溯），比逐 turn 日志精炼。

## HANDOFF.md 模板（≤250 行，400 硬上限）

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

---

> **💡 Insight**
>
> CLAUDE.md、HANDOFF.md、TODO.md 三件套的分工，本质是软件工程里"策略与机制分离"的应用：机制（技术栈、命令）很少变，进 CLAUDE.md；策略（当前做哪块）天天变，进 HANDOFF.md；未来计划进 TODO.md。HANDOFF.md 虽然不是官方功能，但通过在 CLAUDE.md 里加 `[HANDOFF.md](HANDOFF.md)` 链接可以自动加载，加上"替换+归档+死路搬运"模式，解决了官方 `/compact` 解决不好的"死路遗忘"问题——`/compact` 会把死路也压缩掉，导致下次重试。这是它有价值的根本原因。