---
title: 会话管理
sidebar_position: 7
---

# 会话管理：/clear /compact /resume 与收工开工措辞

正确的会话循环是项目长期延续的关键。

## /compact 到底做了什么

`/compact` 把当前对话历史**替换成一段结构化摘要**。它不是"压缩无损保存"，而是**有损摘要**——信息会丢失。

## 为什么多次 /compact 会"慢性失忆"

每次 /compact 都会丢失信息，机制上有三层损失：

1. **摘要的摘要的摘要**：多次 /compact 时，第二次摘要的是"第一次摘要后的内容"，信息层层稀释
2. **skill 描述不会重新注入**：只有你实际调用过的 skill 被保留，其他 skill 的描述在 compact 后丢失
3. **嵌套目录的 CLAUDE.md 不自动重新注入**：项目根的 CLAUDE.md 会重新读，但子目录的不会

官方原文逐字说：一个干净的会话 + 更好的初始提示，几乎总是胜过一个堆满纠正的长会话。

## 命令对比

| 命令 | 干什么 | 区别 |
|---|---|---|
| `/clear` | 清空对话开始新会话，旧会话保存可恢复 | 旧会话**完整保留**在本地，可 `/resume` 找回 |
| `/compact` | 压缩当前对话为摘要，**不建新会话** | 释放上下文空间，但保持同一个会话（最多用一次） |
| `/context` | 显示上下文使用情况 | 只查看，不改变状态 |
| `/rewind` | 打开回退菜单，可回退代码和/或对话 | 回到**同一个会话**的历史点 |
| `/branch` | 从当前对话创建**新分支**（拷贝历史到新 ID） | 保持原会话不变，在新分叉试不同方向 |
| `/fork` | 生成一个后台子代理，继承完整对话 | 让副手去干活，不阻塞主会话 |
| `/resume` | 切换到另一个已保存的会话 | 完全切换到不同对话 |

## 正确的会话循环

```
┌─ 新会话开始 → Claude 自动读 CLAUDE.md + Auto Memory
│  （如有 HANDOFF.md，且 CLAUDE.md 里有 `[HANDOFF.md](HANDOFF.md)` 链接，Claude 会自动加载它）
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

## 什么时候 /clear

用 `/context` 看上下文占用（彩色网格）。在这些时机 /clear：

- **一个切片完成并 commit 后**（最推荐）：干净开始下一切片
- **上下文到 200-300K 的甜点区之前**：不要等爆了再清
- **Claude 开始忘事、变慢**：立即清
- **想换方向**（从功能 A 转去功能 B）：先 commit + 更新 CLAUDE.md/HANDOFF.md，再清

## 单次会话内 /compact 的合法用法

如果你必须在一个会话内继续，且上下文快满了：

- **最多 /compact 一次**
- 用带说明的 compact：`/compact 保留修改过的文件清单和测试命令`
- compact 完立刻去更新 CLAUDE.md/HANDOFF.md，为下次 /clear 做准备

**绝对不要**多次 /compact 续命——这是被反复验证的失败路径。

## 完整收工会话末尾流程

### 步骤 1：跑测试确认切片真的完成
> 你说：先把当前切片的测试跑一遍，把输出 tail 给我看。

### 步骤 2：触发交接（二选一）

A. 装了 handoff skill（本指南附赠）：
> 你说：/handoff

handoff skill 会自动完成：跑命令验证状态 → 读旧 HANDOFF.md → 写新文件 → 归档 → **检查 CLAUDE.md 是否需要更新** → commit + push。

B. 没装 skill，用自然语言：
> 你说：我这次会话快结束了，请帮我写一份 HANDOFF.md 到项目根目录。要求：1. 先跑 git status / git log -5 / git diff 确认当前仓库实际状态，不要凭记忆写。2. 每条陈述标 [V]（本次刚验证）或 [?]（仅记忆，需复核）。3. 段落：当前目标 / 已验证状态 / 决策与理由 / 失败的尝试（标不要再试）/ 已知坑 / 下一步 / 留给我的开放问题。4. 如果已存在 HANDOFF.md，先读它的"失败尝试"和"已知坑"段，仍未解决的条目搬到新文件并标 [?]，旧文件移到 .handoffs/时间戳-handoff.md。5. 目标 ≤250 行，400 硬上限。先删叙事，绝不删"失败尝试 / 已知坑 / 下一步"。6. 检查 CLAUDE.md 是否需要更新——`[HANDOFF.md](HANDOFF.md)` 链接是否存在、当前进度是否过时、HEAD SHA 引用是否匹配。

### 步骤 3：审核 HANDOFF.md
> 你说：把生成的 HANDOFF.md 完整读给我，我标出哪些 [V] 我要复核。

重点看"Failed approaches"和"Open questions"两段——这两段是下次会话最值钱的。

### 步骤 4：commit
> 你说：把 HANDOFF.md、CLAUDE.md（如有改动）和这次切片的代码一起 commit，message 用 "feat: `切片名`"。

注意：装了 handoff skill 的话，步骤 2 的 `/handoff` 已经自动完成了步骤 3-4（包括 CLAUDE.md 检查和 commit），你可以直接跳到步骤 5。

### 步骤 5：清上下文
- 同一任务还要继续且 context 还行 → 不清，继续干
- 切换到不相关任务 → `/clear`（旧会话仍可 `/resume`）
- 收工睡觉 → 直接退出，下次 `claude --continue` 或 `/resume`

## 完整开工会话开头流程

### 步骤 1：启动 Claude Code
```bash
cd ~/your-project
claude
# 或恢复上次会话：
claude --continue
# 或选历史会话：
claude --resume
```

### 步骤 2：让 Claude 读交接文档（如有 HANDOFF.md）
> 你说：读一下 HANDOFF.md，然后按头部 Git HEAD SHA 复核每条 [V] 项是否还成立，报告所有漂移，把开放问题抛给我，确认计划后我们继续。

### 步骤 3：没有 HANDOFF.md 时（纯官方路线）
> 你说：先读 CLAUDE.md 和 README，然后跑 git log --oneline -10 和 git status，告诉我上次停在哪、接下来该做什么。

### 步骤 4：回答开放问题
> 你说：（针对 HANDOFF.md 第 7 段的问题逐条回答）

### 步骤 5：确认下一步后开始
> 你说：按 Next steps 第 1 条开始，先告诉我你打算改哪个文件、怎么改，我确认后再动手。

**关键点**：开工第一件事不是写代码，是让 Claude **验证 HANDOFF.md 的 [V] 项是否还成立**。如果停了一周，仓库状态可能已变，`[V]` 可能已失效。验证后才能信任。

---

> **💡 Insight**
>
> /compact 和 /clear 的取舍，本质是"谁来做摘要"的问题。/compact 让 Claude 自动摘要，省事但失控；/clear + HANDOFF.md 让你手动摘要，费力但可控。把摘要权拿回自己手里，是长期项目能延续的根本。收工/开工的两套措辞看起来啰嗦，但它们把"会话边界"从模糊的"我觉得该清了"变成了机械可执行的步骤——这是从"凭感觉"到"靠流程"的关键升级。