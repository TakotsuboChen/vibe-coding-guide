import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  guideSidebar: [
    {
      type: 'doc',
      id: 'index',
      label: '目录',
    },
    {
      type: 'category',
      label: '底层认知',
      collapsible: true,
      collapsed: false,
      items: ['core-mindset'],
    },
    {
      type: 'category',
      label: '操作层',
      collapsible: true,
      collapsed: false,
      items: [
        'claude-code-overview',
        'memory-system',
        'project-startup',
        'git-github',
        'claude-md-handoff',
        'session-management',
      ],
    },
    {
      type: 'category',
      label: '风险层',
      collapsible: true,
      collapsed: false,
      items: ['skills-mcp', 'bug-spiral'],
    },
    {
      type: 'category',
      label: '学习与行动',
      collapsible: true,
      collapsed: false,
      items: ['learning-path', 'checklist'],
    },
    {
      type: 'doc',
      id: 'references',
      label: '参考来源',
    },
  ],
};

export default sidebars;