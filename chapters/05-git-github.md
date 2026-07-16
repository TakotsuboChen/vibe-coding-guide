# Git + GitHub 从零

如果你是初学者，不懂 git 也不懂 github。这一章从零讲。参考 Pro Git 中文版、GitHub Docs。

## 先回答三个核心问题

### Q1: git 命令是在 Claude Code 对话框里输入，还是另开一个终端手动敲？

两种都行，Claude Code 本身就跑在终端里，背后能调用 Bash 执行系统命令（包括 git）：

- **方式 A（推荐新手学阶段）**：在 Claude Code 对话框用自然语言下指令，比如"帮我 commit 一下当前改动"。Claude 替你跑 `git add` + `git commit`，并把提交信息写进去。
- **方式 B（敏感操作 / 学习阶段）**：另开一个终端标签页，自己手敲 `git status`、`git log`。这样你能看清每一步发生了什么，且不会被 AI 误操作。

**实战建议**：第一次学某个命令时用方式 B 手敲一遍看输出，熟练后用方式 A 让 Claude 跑。`push`、`reset --hard`、`push -f` 这类不可逆操作，永远自己敲。

### Q2: Claude Code 会不会自动帮我跑 git？

**默认不会自动 commit/push**。Claude Code 只会在你明确要求时执行 git 命令。它会改你的代码文件，但不会替你"存档"。这是优点——避免 AI 误把半成品推上 GitHub。

### Q3: git init 到底干嘛的？

把一个普通文件夹变成"Git 仓库"，让 Git 开始追踪里面文件的变化历史。没 init 的文件夹 Git 当它不存在；init 之后 Git 在里面建一个隐藏目录 `.git/`，存所有版本快照。Vibe coding 时 Claude 改坏代码，你能 `git restore` 一秒回滚——这就是为什么要 init。

## Git 是什么、为什么 vibe coding 需要它

**What**：分布式版本控制系统——在本地硬盘上给项目拍"快照"，每次提交存一个时间点，可以随时回到任意历史状态、对比差异、开分支并行实验。

**Why（不用 git 会怎样）**：
- Claude 改坏代码 → 没法回滚，只能靠记忆或备份
- 想同步到 GitHub → 没 git 就没 push
- 想借鉴开源项目 → GitHub 上几乎所有项目都是 git 仓库，不会 git 就没法 clone/读历史
- 多设备协作 → 没法同步

Vibe coding 的核心风险是"AI 一把梭改飞了"，git 是你的安全网。

## 安装与一次性配置

**安装 Git（Linux/WSL）**：
```bash
sudo apt update && sudo apt install -y git
git --version   # 应输出 git version 2.x
```

**一次性身份配置（每台电脑只需一次）**：
```bash
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱@example.com"
```

`user.name` 用你的 GitHub 用户名即可。`user.email` 要和 GitHub 账号同一个邮箱，便于关联贡献图。

可选顺手配：
```bash
git config --global init.defaultBranch main      # 新仓库默认分支叫 main
git config --global pull.rebase false           # pull 时用 merge，新手友好
git config --global core.editor "code --wait"  # 提交信息用 VSCode 编辑
git config --global credential.helper store    # 记住 GitHub 凭据，不用每次输
```

**注册 GitHub 账号**：去 https://github.com/signup 注册。建议用户名用你的常用 handle。开两步验证（2FA）：Settings → Password and authentication → Two-factor authentication，强烈建议。

## GitHub 认证：PAT vs SSH，新手用哪个

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
把输出的整行粘到 GitHub: Settings → SSH and GPG keys → New SSH key。测试：`ssh -T git@github.com`，应输出 "Hi 用户名! ..."。

**WSL2 特坑**：`~/.ssh` 和里面文件权限必须正确，否则 SSH 拒用：`chmod 700 ~/.ssh && chmod 600 ~/.ssh/id_* && chmod 644 ~/.ssh/*.pub`。

## 本地工作流：8 个命令

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

## GitHub 远程：建仓库、push、clone

**在 GitHub 上建仓库**：浏览器开 https://github.com/new：
- Repository name：小写连字符，如 `power-board-utils`
- Public/Private：新手建议 Private 起步，成熟了再切 Public
- **Initialize with README：如果本地已有内容，不要勾**，否则远程会有初始 commit，push 时要处理冲突
- License：开源仓库才需要选（MIT/Apache 最宽松）

**关联本地与远程**：
```bash
git remote add origin https://github.com/你的用户名/项目名.git
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
git clone https://github.com/用户名/项目名.git
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
git remote add origin https://github.com/用户名/my-app.git
git push -u origin main
```

**Claude Code 一气呵成版**（你直接说）：
> "这是个新项目，帮我完成初始化：git init、add 所有文件、用 Conventional Commits 写 initial commit、关联远程 https://github.com/用户名/my-app.git 并 push 到 main"

## 让 Claude 跑 git 的最佳实践

**原则：自然语言 + 明确动作**。模糊指令有风险。对比：

| 模糊（不推荐） | 明确（推荐） |
|---|---|
| "保存一下" | "commit 当前改动，信息写 'fix: 修复计算错误'" |
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

## 借鉴开源项目：clone 全库 vs 只读部分

**三种姿势对比**：

| 姿势 | 何时用 | 优点 | 缺点 |
|---|---|---|---|
| **A. git clone 全库** | 要长期跟踪/魔改/贡献 PR / 项目不大 | 完整历史、能离线、能切 tag/分支、Claude 全文搜 | 占空间、大仓慢 |
| **B. 浅克隆 `git clone --depth 1`** | 只想要最新代码、不要历史 | 快 10 倍以上、省空间 | 拿不到历史/旧 tag |
| **C. 只读部分文件**（WebFetch raw 文件） | 只想看一两个文件学写法 / 只读不魔改 | 极快、不污染本地 | 没法跑项目、Claude 看不到全局 |

**推荐决策树**：
1. **只想抄一个文件/函数的写法** → 让 Claude 用 WebFetch 抓 GitHub raw 链接（`https://raw.githubusercontent.com/用户/仓库/分支/路径/文件`）。看完用完即弃。
2. **想整体学一遍、要跑起来** → `git clone --depth 1` 浅克隆到 `~/projects/`，省时省地
3. **要长期魔改、可能贡献回去** → 完整 `git clone` + fork 流程

**Fork + clone（长期魔改或贡献开源标准流程）**：
1. GitHub 上打开目标仓库，点右上 **Fork** → 复制到你账号下
2. 本地：
   ```bash
   git clone git@github.com:你的用户名/原仓库名.git
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

## .gitignore 基础

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

## 常见错误与恢复

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

## 速查表

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

---

`★ Insight ─────────────────────────────────────`
Git 的本质不是"版本控制"，是**给你的开发过程装上存档键**。对业余开发者，它的价值不在协作，而在"敢于放手让 Claude 试"——任何改动都可以 restore 回来。没有 Git 的 vibe coding 等于没有 undo 键的编辑器，一次搞砸就劝退。结合第 1 章的"你是 DRI"心智模型，git 还给了你"对每行代码负责"的物质基础——你能追到任何一行是谁、什么时候、为什么改的。
`─────────────────────────────────────────────────`