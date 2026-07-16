import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import clsx from 'clsx';
import styles from './index.module.css';

const chapters = [
  {
    title: '五个底层认知',
    desc: '上下文窗口、切片、主动维护、agent 边界、DRI——五个贯穿全文的基本认知',
    to: '/docs/core-mindset',
  },
  {
    title: 'Claude Code 全景',
    desc: '文件目录结构、权限模式、斜杠命令清单、配置文件体系',
    to: '/docs/claude-code-overview',
  },
  {
    title: '记忆体系深潜',
    desc: 'Auto Memory、CLAUDE.md、Skills 如何协作工作',
    to: '/docs/memory-system',
  },
  {
    title: '项目启动：第一个 30 分钟',
    desc: '从空文件夹到能跑的东西——建立节奏、避免信息过载',
    to: '/docs/project-startup',
  },
  {
    title: 'Git + GitHub 从零',
    desc: 'PAT 认证、push 流程、clone vs 只读、License 合规',
    to: '/docs/git-github',
  },
  {
    title: 'CLAUDE.md 与交接文档',
    desc: '官方功能 vs 社区约定，正确使用交接文档',
    to: '/docs/claude-md-handoff',
  },
  {
    title: '会话管理',
    desc: '/clear /compact /resume 与收工开工措辞',
    to: '/docs/session-management',
  },
  {
    title: 'Skills 与 MCP 生态',
    desc: '评估、安装、风险控制——选装评换全流程',
    to: '/docs/skills-mcp',
  },
  {
    title: 'Bug 螺旋逃生',
    desc: '防反复纠正、Rebuild vs Patch 决策框架',
    to: '/docs/bug-spiral',
  },
  {
    title: '学习路径',
    desc: '6 个月可量化里程碑、学习方法、资源推荐',
    to: '/docs/learning-path',
  },
  {
    title: '防流产清单',
    desc: '可勾选的检查清单与行动起步',
    to: '/docs/checklist',
  },
  {
    title: '参考来源',
    desc: '所有主张的官方文档 URL 来源',
    to: '/docs/references',
  },
];

export default function Home(): JSX.Element {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title="主页"
      description={siteConfig.tagline}>
      <main>
        <section className={styles.hero}>
          <h1 className={styles.heroTitle}>{siteConfig.title}</h1>
          <p className={styles.heroSubtitle}>{siteConfig.tagline}</p>
          <div className={styles.heroActions}>
            <Link
              className="button button--primary button--lg"
              to="/docs">
              开始阅读 →
            </Link>
            <Link
              className="button button--secondary button--lg"
              to="https://github.com/TakotsuboChen/vibe-coding-guide">
              GitHub
            </Link>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>这份指南解决什么</h2>
          <div className={styles.problemBox}>
            <p className={styles.problemText}>
              很多业余开发者用 Claude Code 的真实循环是：
            </p>
            <blockquote className={styles.problemQuote}>
              不懂代码 → 不会选 Skills/MCP → Claude 没好 skill 指导 → 笨上加笨 → 项目报废 → 依然不懂代码 → 0 产出
            </blockquote>
            <p className={styles.problemText}>
              本指南针对这个死循环的每一环给出可执行的破解方法。
            </p>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>章节目录</h2>
          <div className={styles.grid}>
            {chapters.map((ch) => (
              <Link key={ch.to} to={ch.to} className={styles.card}>
                <h3 className={styles.cardTitle}>{ch.title}</h3>
                <p className={styles.cardDesc}>{ch.desc}</p>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>它和网上其他教程的区别</h2>
          <ul className={styles.diffList}>
            <li><strong>不假设你会写代码</strong>——每一步都带"你该对 Claude 说什么"的具体对话措辞，可复制粘贴</li>
            <li><strong>区分官方功能 vs 社区约定</strong>——清楚标注哪些是 Claude Code 官方支持、哪些是社区实践</li>
            <li><strong>纠正常见误区</strong>——例如装太多 Skills 会变笨有官方硬指标（skill 列表 = 上下文 1%）</li>
            <li><strong>给出学习路径</strong>——不只是"怎么用工具"，还有"怎么真的学到东西"——6 个月可量化里程碑</li>
          </ul>
        </section>
      </main>
    </Layout>
  );
}