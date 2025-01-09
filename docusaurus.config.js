// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer').themes.github;
const darkCodeTheme = require('prism-react-renderer').themes.dracula;

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Fireproof',
  tagline: 'Simplify your application state with an embedded live database.',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://use-fireproof.com',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  // organizationName: 'facebook', // Usually your GitHub org/user name.
  // projectName: 'docusaurus', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          // editUrl:
          // 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   // editUrl:
        //     // 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Replace with your project's social card
      image: 'img/card.png',
      navbar: {
        title: 'Fireproof',
        logo: {
          alt: 'Fireproof Flame Logo',
          src: 'img/logo.svg',
          href: 'https://fireproof.storage/',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Documentation',
          },
          { to: '/docs/react-tutorial', label: 'Tutorial', position: 'left' },
          // {to: '/docs/faq', label: 'FAQ', position: 'left'},
          {
            label: 'Blog',
            to: 'https://fireproof.storage/blog/',
            position: 'left',
          },
          {
            label: 'Demo Dashboard',
            to: 'https://fireproof.storage/try-free/',
            position: 'right',
          },
          {
            href: 'https://github.com/fireproof-storage/fireproof',
            label: 'Star me on GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Docs',
            items: [
              {
                label: 'React Hooks',
                to: '/docs/react-tutorial',
              },
              {
                label: 'Database API',
                to: '/docs/category/database-api',
              },
              {
                label: 'Coding with ChatGPT',
                to: '/docs/chatgpt-quick-start',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Forum',
                href: 'https://github.com/fireproof-storage/fireproof/discussions',
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/xC55bhgf6n',
              },
              {
                label: 'Twitter',
                href: 'https://twitter.com/FireproofStorge',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'Fireproof Storage',
                to: 'https://fireproof.storage/',
              },
              {
                label: 'Blog',
                to: 'https://fireproof.storage/blog/',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/fireproof-storage/fireproof/tree/main/packages/react',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Fireproof`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
      algolia: {
        // The application ID provided by Algolia
        appId: 'LPECO32JOJ',

        // Public API key: it is safe to commit it
        apiKey: '0ba664435d303eb4796062a1403e2046',

        indexName: 'use-fireproof',

        // Optional: see doc section below
        contextualSearch: false,
      },
    }),
};

module.exports = config;
