# HANDOFF — 读全文再开始干活

生成时间: 2026-07-17T00:36 · Git HEAD: 958f0d3c
恢复方式: 对 Claude 说"读一下 HANDOFF.md，按头部 Git HEAD 复核本文件"。
信任规则: [V] = 交接时已用命令验证；[?] = 仅记忆未复核，当线索对待。

## 1. 当前目标

从 Just the Docs（Jekyll）迁移到 Docusaurus 3.x（React）已完成。站点构建通过，导航栏"文档"链接可用，Landing Page 正常。

## 2. 已验证状态 — 工作实际停在哪

- 旧 Jekyll 文件已删除（`_config.yml`、`Gemfile`、`chapters/`）[V] `git status` 确认删除
- Docusaurus 项目骨架已建立：`package.json`、`docusaurus.config.ts`、`sidebars.ts`、`tsconfig.json` [V] 文件存在
- 文档内容迁移到 `docs/`，文件名去掉数字前缀 [V] `ls docs/`
- Landing Page 在 `src/pages/index.tsx`，带章节卡片网格[V] 文件存在
- 导航栏左上角图标已移除，"指南"改名为"文档" [V] `git diff` 确认
- GitHub Actions 部署工作流已创建 [V] `.github/workflows/deploy.yml` 存在
- `npm run build` 通过，构建输出到 `build/` [V] 构建成功输出

### 测试/build 输出 tail（本次交接 run 的真实输出）
```
> npm run build
[SUCCESS] Generated static files in "build".
```

## 3. 决策与理由

- **Docusaurus 而非 VitePress/MkDocs**：用户选择 Docusaurus，因为 React 生态、内置搜索、暗色模式、中文 i18n 支持好 [V]——用户确认
- **去掉数字前缀文件名**：Docusaurus 自动截取文档 ID 时去掉数字前缀，`01-core-mindset.md` → `core-mindset`，所以统一用无前缀名 [V]——构建报错验证
- **`format: 'md'` 不可用**：Docusaurus 3.10 不支持该选项，改用默认 MDX 但不写 JSX，所有代码块外的 `<...>` 已用反引号保护 [V]——构建报错验证
- **favicon 用 SVG 而非 ICO**：`favicon.ico` 必须是二进制格式，直接用 `img/logo.svg` 做 favicon [V]——构建报错验证
- **`onBrokenMarkdownLinks` 迁移到 `markdown.hooks`**：3.10 废弃了旧配置项 [V]——构建警告验证

## 4. 失败的尝试 — 不要再试

（无 — 本次迁移无不可逆的失败尝试）

## 5. 已知坑

- 旧 HANDOFF.md 中的"根目录 index.html 可能返回 503"已无关——现在用 Docusaurus 构建，不再依赖 Jekyll 的 CDN 缓存 [V]——架构变更
- 旧 HANDOFF.md 中的"用户级 skill 和项目级 skill 同步"问题仍存在，但本次未触及 skill 文件，无影响 [?]——未验证
- 章节间的交叉引用（如 HANDOFF.md 的 `[HANDOFF.md](HANDOFF.md)` 示例）在代码块内，Docusaurus 不会解析为链接，不影响构建 [V]——构建通过

## 6. 下一步（有序）

1. 验证 GitHub Pages 部署是否正常（push 后查看 Actions 和 Pages 页面）
2. 确认 Landing Page 和文档页面在移动端响应式布局正常
3. （可选）添加自定义 404 页面、优化 SEO 元信息

## 7. 留给用户的开放问题

- 需要在 GitHub 仓库 Settings > Pages 中确认 Source 设为 "GitHub Actions"（而非 Deploy from a branch）
- 是否需要添加 GA / 站点统计？