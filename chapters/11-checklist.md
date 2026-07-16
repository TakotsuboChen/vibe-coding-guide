---
title: 防流产清单与行动起步
nav_order: 11
---

# 防流产清单与行动起步

## 提交节奏

- [ ] 每个 working slice 完成 → commit
- [ ] 每次让 Claude 做危险动作前 → commit
- [ ] `/clear` 前 → commit
- [ ] 每 30-60 分钟至少一次 commit，哪怕是 WIP
- [ ] commit message 写人话，别写 "fix" / "update"，写"加登录页，还没接后端"

## 切片纪律

- [ ] 项目里**永远有一个能跑的版本**，哪怕只能跑一个最蠢的功能
- [ ] 下一个 slice 只加**一条**新功能，不一次加五条
- [ ] 一个 slice 没跑通之前，不开始下一个
- [ ] 第一个 slice 要小到让你觉得"这太简单了吧"

## 交接文档

- [ ] 项目根目录放 `CLAUDE.md`（稳定约定，每会话自动加载，进 git）
- [ ] 可选：`HANDOFF.md`（当前状态，需你让 Claude 读，进 git）
- [ ] 可选：`TODO.md`（未来待办，需你让 Claude 读，进 git）
- [ ] 每次收工时花 2 分钟说："更新 CLAUDE.md 的当前进度 + 写 HANDOFF.md"
- [ ] HANDOFF.md 必写"下次会话第一件事"和"放弃的方案"
- [ ] commit message 写人话

## /clear 时机

- [ ] 一个 slice 完成并 commit 后 → /clear
- [ ] 对话明显变慢、Claude 开始忘事 → /clear
- [ ] 想换方向 → 先 commit + 更新 CLAUDE.md/HANDOFF.md，再 /clear
- [ ] 用 `/context` 看占用，到 200-300K 甜点区前主动 /clear

## 范围纪律（防 scope creep）

- [ ] 把"以后想做但不属于当前 slice 的想法"写进 `TODO.md`，**不立刻做**。这一条是防流产最有效的
- [ ] 一个 slice 的定义写在一句话里，超出这句话的"顺便改一下"全部进 TODO
- [ ] 每次开新会话先问自己：今天要做的那一条 slice 是什么？只做它

## Bug 审查纪律

- [ ] 审查最多两轮，第二轮的问题进 TODO
- [ ] 只修影响当前切片的 bug，其他进 TODO
- [ ] 用 `/code-review` 而不是自然语言审查
- [ ] 新 bug 比上轮多 → 立即停
- [ ] 把"找 bug"换成"跑检查"（测试/build/`/verify`），检查通过即停

## Skills/MCP 纪律

- [ ] 起步：context7 + sequential-thinking + fetch 三个 MCP，summarize-changes + commit 两个自己写的 skill
- [ ] 个人 skill 总数控制在 8 个以内
- [ ] 有副作用的 skill 加 `disable-model-invocation: true`
- [ ] 用 `/context` 看 Skills 行占用，超 2% 就精简
- [ ] 不懂一个 skill 在干嘛就别装——至少能读懂 SKILL.md

## 学习纪律

- [ ] 每段 AI 代码，关掉 AI 从空白重写一遍
- [ ] 抄 `💡 Insight` 进 `insights.md`，每周回看
- [ ] learning mode 留的 TODO 空位必须自己填
- [ ] 负信号出现（忘了文件位置、无法解释上周代码、3 周没手动改）→ 立即停
- [ ] 每月对照里程碑信号检查进度

## 为什么这套能防流产

流产的本质是"做了一半没有能用的东西，下次打开已经忘了在干嘛，不想碰了"。

切片 + commit + 交接文档 + 范围纪律 + bug 审查纪律 + 学习纪律六件套直接打这三点：
- 任何时候都有能用的东西（切片 + commit）
- 任何时候停下来都能续上（交接文档）
- 回来时不用回忆（TODO + HANDOFF + CLAUDE.md）
- 不会越做越乱（范围纪律 + bug 审查纪律）
- 不会失血（学习纪律，确保你看得懂自己"写"的代码）

## 下一步行动

**立刻做（今天）**：
1. 读两遍这份指南，特别是第 9 章 Bug 螺旋和第 10 章学习路径
2. 跑 `/powerup` 学 Claude Code 本身
3. 把身份写进 `~/.claude/CLAUDE.md`：对 Claude 说"把以下内容加到 ~/.claude/CLAUDE.md：我是初学者，业余开发，想边写边学。偏好 Python。全程用简体中文。"

**本周做**：
1. 装好 Git（`sudo apt install -y git`）+ 配置身份 + 注册 GitHub + 生成 PAT（见第 5 章）
2. 装三个 MCP：context7 + sequential-thinking + fetch（见第 8 章）
3. 选一个你真的想做的小项目（命令行小工具，不要选大的）

**两周内做**：
1. 严格按第 4 章的 30 分钟例行启动它
2. 每个切片完成后，严格按本章清单过一遍
3. 跑完 3-5 个切片，你会建立"我能让一个项目活着"的信心

**一个月内做**：
1. 对照第 10 章的第 1 个月里程碑检查
2. 开始 CSAPP + Nand2Tetris

## 一句话总纲

**CLAUDE.md 记录项目状态 + Git 做安全网 + HANDOFF.md + /clear 控制上下文 + 切片式推进 + 主动学习防失血 = 项目可以长期延续，且你在进步。**

---

> **💡 Insight**
>
> 防流产的核心不是意志力，是**流程**。这整份清单其实就一句话：任何时候停下来，项目都是一个能跑的状态 + 你知道下一步做什么。做到了这两点，项目就不会流产。清单的每个条目都在服务于这个目标。