import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: '业余开发者 Vibe Coding 完全指南',
  tagline: '面向业余编程学习者的 Claude Code 实战指南',
  favicon: 'img/logo.svg',

  url: 'https://takotsubochen.github.io',
  baseUrl: '/vibe-coding-guide/',

  organizationName: 'TakotsuboChen',
  projectName: 'vibe-coding-guide',

  onBrokenLinks: 'throw',

  markdown: {
    hooks: {
      onBrokenMarkdownLinks: 'warn',
    },
  },

  i18n: {
    defaultLocale: 'zh-CN',
    locales: ['zh-CN'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/TakotsuboChen/vibe-coding-guide/edit/main/',
          showLastUpdateTime: true,
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/social-card.jpg',
    navbar: {
      title: 'Vibe Coding 完全指南',
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'guideSidebar',
          position: 'left',
          label: '文档',
        },
        {
          href: 'https://github.com/TakotsuboChen/vibe-coding-guide',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: '指南',
          items: [
            {
              label: '目录',
              to: '/docs',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/TakotsuboChen/vibe-coding-guide',
            },
          ],
        },
        {
          title: '更多',
          items: [
            {
              label: 'Anthropic Claude Code 文档',
              href: 'https://docs.anthropic.com/en/docs/claude-code/overview',
            },
          ],
        },
      ],
      copyright: `CC BY 4.0 · ${new Date().getFullYear()}`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;