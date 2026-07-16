---
name: handoff
description: 全自动交接：生成 HANDOFF.md + commit + push，含死路搬运和归档
---

# Handoff 技能

执行会话交接全流程：验证当前状态 → 写 HANDOFF.md → 归档旧文件 → commit + push。

## 触发

在会话末尾输入 `/handoff`。

## 执行步骤

### 步骤 1：验证当前仓库状态

运行以下命令，获取真实状态（不要凭记忆写）：

```bash
git status
git log --oneline -5
git diff
```

如果有测试命令（从 CLAUDE.md 或项目结构推断），跑一遍并把输出 tail 记下来。

### 步骤 2：读取旧 HANDOFF.md（如果存在）

如果项目根存在 `HANDOFF.md`，先完整读取它，重点关注：
- "失败的尝试"段 — 所有条目必须前向搬运到新文件，标 `[?]`
- "已知坑"段 — 仍未解决的条目搬运到新文件，标 `[?]`
- "当前目标"和"已验证状态" — 确认哪些已完成，哪些未完成

### 步骤 3：写新 HANDOFF.md

写到项目根 `HANDOFF.md`，格式如下：

```markdown
# HANDOFF — 读全文再开始干活

生成时间: {当前时间 ISO 8601} · Git HEAD: {当前 HEAD SHA}
恢复方式: 对 Claude 说"读一下 HANDOFF.md，按头部 Git HEAD 复核本文件"。
信任规则: [V] = 交接时已用命令验证；[?] = 仅记忆未复核，当线索对待。

## 1. 当前目标
<!-- ≤5 行。单一目标 + 完成定义 -->

## 2. 已验证状态 — 工作实际停在哪
<!-- 每条 = claim + 证据 + tag -->
- {描述} [V] {证据来源}

### 测试/build 输出 tail（本次交接 run 的真实输出）
```
{粘贴测试输出}
```

## 3. 决策与理由
- {决策} [V]——{理由}。否决方案：{备选方案}，{否决原因}。

## 4. 失败的尝试 — 不要再试
<!-- 最值钱的一段 -->
- {试了什么} → {怎么失败} [V]——{原因}。不要再试。

## 5. 已知坑
- {坑描述} [V]——{原因}。

## 6. 下一步（有序）
1. {第一步}
2. {第二步}

## 7. 留给用户的开放问题
- {问题}
```

### 步骤 4：归档旧文件

如果存在旧 `HANDOFF.md`：
- 创建 `.handoffs/` 目录（如果不存在）
- 旧文件移到 `.handoffs/{时间戳}-handoff.md`（时间戳格式：YYYYMMDDHHmmss）
- 确保 `.handoffs/` 目录不写入 `.gitignore`

### 步骤 5：commit + push

```bash
git add -A
git commit -m "feat: handoff {当前切片名/目标摘要}"
git push
```

如果当前有未完成的变更（非 handoff 相关），commit message 应反映实际内容：
```bash
git commit -m "feat: {切片名} + handoff"
```

## 输出格式

执行完所有步骤后，向用户报告：
1. 当前状态摘要（完成了什么、下一步做什么）
2. 测试结果（如果有）
3. 已 commit 的 SHA
4. 提醒：下次新会话开始，Claude 会自动加载 CLAUDE.md 和 HANDOFF.md（如果 CLAUDE.md 里有 `[HANDOFF.md](HANDOFF.md)` 链接）

## 注意事项

- 每条 `[V]` 陈述必须是**本次刚运行命令验证**的，不是凭记忆
- 旧文件里的"失败的尝试"和"已知坑"**必须搬运**，永不丢弃
- 目标 ≤250 行，400 硬上限。裁剪顺序：先删叙事 → 压缩 Decisions → **永不裁剪** Failed approaches / Known traps / Verified state / Next steps
- commit 前确保 HANDOFF.md 已写入项目根
- 不要修改 HANDOFF.md 之外的文件（除非是未 commit 的代码变更）