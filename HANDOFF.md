# HANDOFF — 读全文再开始干活

生成时间: 2026-07-16 · Git HEAD: adb2440
恢复方式: 对 Claude 说"读一下 HANDOFF.md，按头部 Git HEAD 复核本文件"。
信任规则: [V] = 交接时已用命令验证；[?] = 仅记忆未复核，当线索对待。

## 1. 当前目标

写一份给"硬件工程师业余学编程、用 Claude Code 做项目"的完全指南，并通过真实跑通流程让用户建立"我能让项目活着"的信心。

**完成定义**：指南 v2 写完、push 到公开仓库、README 上线。已达成 [V]。

## 2. 已验证状态 — 工作实际停在哪

- `vibe-coding-guide-v2.md` 重构版完成，1981 行，11 章 [V] git log adb2440
- `vibe-coding-guide.md` 第一版已过时，保留作历史参考 [V]
- `CLAUDE.md` 已写，描述仓库性质为纯文档仓库 [V]
- `README.md` 已写并 push [V] git log adb2440
- `.gitignore` 已建（含 .handoffs/ 忽略）[V]
- 仓库已公开在 https://github.com/TakotsuboChen/vibe-coding-guide [V]
- `main` 分支跟踪 `origin/main` [V] git branch -vv 确认

## 3. 决策与理由

- **指南放在 `~/projects/vibe-coding-guide/` 而不是 `~`**：避免污染 home 全局记忆空间。理由见指南第 2.3 节 [V]
- **用 `gh` CLI 建仓库而不是手动 GitHub 网页**：你已认证过，token 有 repo scope，一条龙完成。比 PAT 路径省事 [V]
- **指南内容区分"官方功能 vs 社区约定"**：纠正 v1 把 HANDOFF.md/TODO.md 当官方功能讲的错误。研究 Agent 查证官方文档查无 HANDOFF.md [V]
- **HANDOFF.md 本身是社区约定不是官方功能**：不会自动加载，必须在 CLAUDE.md 里链接或在会话开头让 Claude 读。这步正在做 [V]

## 4. 失败的尝试 — 不要再试

- **在 `~` 根目录跑 `git init`**：会把整个 home（含 `.ssh` 私钥、`.config/gh` token、各种敏感配置）变成 git 仓库并加进暂存区 [V]——差点 push 出去泄露密钥。**不要再在不 `cd` 到项目目录的情况下跑 git init**。已经在指南第 5 章和 README 里都记了这个教训
- **单次 Write 吐 800+ 行**：触发 `API Error: Connection closed mid-response` 三次 [V]——改用 Edit 工具分段追加才写完。**不要再试图一次写完大文档**，按章节分切片
- **多次 /compact 续命**：v1 阶段研究时试过，头部信息越来越稀释 [?]——改用 Agent 并行研究 + 主会话只回收摘要。详见指南第 7 章

## 5. 已知坑

- Bash 工具的工作目录持续到下一次调用，但不显式 `cd` 就用相对路径会出事 [V]——误 init home 就是这个原因。**所有 git 操作前先显式 `cd` + `pwd` 确认**
- `gh` CLI 已认证为 `TakotsuboChen`，用户名和 git config 的 `Takotsubo` 不同 [V]——这是正常的（GitHub 账号名 vs handle），不影响 push
- WSL2 环境下 CRLF/LF 警告无害 [V]——git 会自动处理，不用管

## 6. 下一步（有序）

1. **（可选）装 ostikwhy-blip handoff skill**：`git clone https://github.com/ostikwhy-blip/claude-code-handoff-skill.git` 然后 `cp -r` 到 `~/.claude/skills/handoff/`。之后 `/handoff` 半自动化这步。详见指南第 6.6 节
2. **（可选）把这次会话成果写进 Auto Memory**：对 Claude 说"记住：用户已完成第一个公开项目 vibe-coding-guide，掌握 git 基础流程，下一个里程碑是 CSAPP 实验室"
3. **真正的下一步：按指南第 10.5 节开始第 1 个月里程碑**——选一个硬件相关的小 Python 项目（如串口日志解析工具），按第 4 章 30 分钟例行启动
4. **开始 CSAPP + Nand2Tetris**（硬件背景优势区，按第 10.2 节）
5. **装三个 MCP**：context7 + sequential-thinking + fetch（第 8.8 节）

## 7. 留给用户的开放问题

- 要不要现在就装 ostikwhy-blip skill 让 HANDOFF.md 半自动化？还是先用自然语言版手跑几次熟悉流程？
- 第一个真实代码项目选什么？硬件相关的 Python 小工具最合适（串口日志解析、CSV 转 JSON、固件版本 bump 脚本），你倾向哪个方向？
- 要不要把这次会话的关键结论（HANDOFF.md 的"替换+归档+死路搬运"模式、Bug 螺旋逃生清单）也写成一份个人 skill，以后项目复用？
