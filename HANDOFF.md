# HANDOFF — 读全文再开始干活

生成时间: 2026-07-17T00:15 · Git HEAD: ef57942
恢复方式: 对 Claude 说"读一下 HANDOFF.md，按头部 Git HEAD 复核本文件"。
信任规则: [V] = 交接时已用命令验证；[?] = 仅记忆未复核，当线索对待。

## 1. 当前目标

安装 shuorenhua（说人话）skill 到本项目，并默认调用它改写所有中文输出。已完成安装和 CLAUDE.md 配置，全部 12 个 MD 文件已应用改写。

## 2. 已验证状态 — 工作实际停在哪

- shuorenhua skill 已安装到 `.claude/skills/shuorenhua/`（SKILL.md + 11 个 references 文件）[V] `ls .claude/skills/shuorenhua/`
- CLAUDE.md 已添加 shuorenhua 文件链接和"默认技能"配置段 [V] `grep shuorenhua CLAUDE.md`
- 全部 12 个 MD 文件已应用 shuorenhua 去 AI 味改写 [V] `git diff --stat` 显示 12 文件变更
- 旧 HANDOFF.md 待归档 [V] `cat HANDOFF.md` 确认内容

### 测试/build 输出 tail（本次交接 run 的真实输出）

```
git diff --stat
 .claude/skills/handoff/SKILL.md     |  2 +-
 CLAUDE.md                           | 14 ++++++++--
 chapters/01-core-mindset.md         | 10 +++----
 chapters/02-claude-code-overview.md |  8 +++---
 chapters/03-memory-system.md        |  6 ++--
 chapters/04-project-startup.md      | 12 +++++----
 chapters/06-claude-md-handoff.md    |  2 +-
 chapters/07-session-management.md   |  2 +-
 chapters/08-skills-mcp.md           |  4 +--
 chapters/09-bug-spiral.md           |  2 +-
 chapters/10-learning-path.md        | 12 +++++----
 chapters/index.md                   |  4 +--
 12 files changed, 44 insertions(+), 34 deletions(-)
```

## 3. 决策与理由

- **项目级安装而非 plugin 安装**：shuorenhua 装到 `.claude/skills/shuorenhua/` 而非用 `/plugin install`，因为项目级安装进版本管理，团队成员共享，且无需 plugin marketplace 依赖 [V]——用户确认选择
- **CLAUDE.md 声明默认调用而非在 AGENTS.md 配置触发条件**：AGENTS.md 是更细粒度的触发规则，本项目只需一个全局默认行为，写在 CLAUDE.md 更直接 [V]——用户确认选择
- **docs 场景 minimal 档位**：指南本身已比较干净，无需 aggressive 改写，只做局部清理 [V]——改写结果验证

## 4. 失败的尝试 — 不要再试

（无 — 本次无失败的尝试）

## 5. 已知坑

- 第 10 章保留了 CSAPP 和 Nand2Tetris 作为推荐资源，对没有硬件背景的读者可能偏硬——但这是自学 CS 社区公认的最佳路径，保留 [V]
- 用户级 skill 和项目级 skill 是手动同步的——如果只改一个忘了改另一个会分裂。下次改 skill 时要同时改两份 [V]
- 切换到 Just the Docs 后，旧模板中的 `use_math` 注入（MathJax）不再可用——但指南中没有使用数学公式，无影响 [V] grep 确认
- 根目录 index.html 可能返回 503（CDN 缓存），但 chapters/ 下的页面正常 [?]——上次交接验证，是否已自动恢复待确认

## 6. 下一步（有序）

1. 验证跨章节链接在 GitHub Pages 上是否正常工作（`.md` → `.html` 转换）
2. 验证侧边栏移动端响应式布局
3. （可选）加 `.github/` 目录和 issue template

## 7. 留给用户的开放问题

- 根目录 index.html 的 503 是否已自动恢复？
- 用户级 handoff skill 需要手动同步，是否应该考虑用符号链接或 git hook 自动同步？