# HANDOFF — 读全文再开始干活

生成时间: 2026-07-17T09:45 · Git HEAD: 4448fa1
信任规则: [V] = 交接时已用命令验证；[?] = 仅记忆未复核，当线索对待。

## 1. 当前目标

CLAUDE.md 重构完成：精简 HANDOFF.md 相关内容，统一文件结构树，说人话技能移到"开始工作前"。

## 2. 已验证状态 — 工作实际停在哪

- CLAUDE.md 重构完成 [V] `git diff CLAUDE.md` — 新增"开始工作前"（HANDOFF.md + 说人话技能），删除"交接文档"独立章节，删除"默认技能"独立章节，文件结构树统一含 `.claude/skills/` + 根目录文件
- HANDOFF.md 头部的"恢复方式"行已删除 [V] `git diff HANDOFF.md` — CLAUDE.md 已有 `[HANDOFF.md](HANDOFF.md)` 链接，自动加载
- `.claude/skills/handoff/SKILL.md` 模板的"恢复方式"行已删除 [V] `git diff`
- `docs/06-claude-md-handoff.md` 模板中"恢复方式"行删除 + 恢复相关段落删除 [V] `git diff`
- `docs/07-session-management.md` 开工步骤 2 重构：有 HANDOFF.md 时无需操作，无 HANDOFF.md 时走纯官方路线 [V] `git diff`

### 测试/build 输出 tail
```
当前无测试命令可运行（文档仓库）
git status: 6 个文件已修改，未 commit
```

## 3. 决策与理由

- **CLAUDE.md 精简原则**：CLAUDE.md 是每次会话自动加载的入口，应只放最必要的信息。HANDOFF.md 的格式约定（[V] 标记、裁剪顺序等）移到了指南文档中，CLAUDE.md 只保留"先读 HANDOFF.md"这一句指令 [V]——CLAUDE.md 是"宪法"，不是"说明书"
- **说人话技能前置**：从末尾独立章节移到"开始工作前"第 2 条，Claude 一启动就知道输出风格要求 [V]——放在末尾容易被忽略
- **文件结构树统一**：根目录文件和 `.claude/skills/` 统一在树中，不再单独列在树外 [V]——之前树外列表不完整且层级混乱

## 4. 失败的尝试 — 不要再试

（无 — 本次无失败的尝试）

## 5. 已知坑

- `.handoffs/` 已移出 `.gitignore`，后续 handoff 归档会自动进 git 跟踪 [V]——已修复

## 6. 下一步（有序）

1. 验证站点构建是否正常（`npm run build`）
2. 检查 docs/ 中各章节与 CLAUDE.md 的一致性——"开始工作前"新增说人话技能后，docs/06 和 docs/07 的恢复相关段落是否已完全清理
3. 清理 TODO.md 中已不再适用的条目

## 7. 留给用户的开放问题

- CLAUDE.md 重构后，docs/06-claude-md-handoff.md 和 docs/07-session-management.md 中关于"恢复方式"和"开工步骤"的改动是否完整，需要用户确认后再 commit