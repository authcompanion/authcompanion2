
// https://vitepress.dev/reference/site-config
export default {
  title: "AuthCompanion2",
  description:
    "Documentation site for AuthcCompanion2 - an effortless user management server for modern apps",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      {
        text: "Guide",
        link: "/guide/gettingstarted",
      },
      {
        text: "Demo",
        link: "https://demo.authcompanion.com/v1/web/register",
      },
      {
        text: "Contributing",
        link: "/contributing/readme",
      },
      {
        text: "License",
        link: "/guide/licenseoverview",
      },
    ],

    sidebar: {
      "/": [
        {
          text: "📚 The Guide",
          items: [
            { text: "Getting Started", link: "/guide/gettingstarted" },
            { text: "Explore", link: "/guide/explore" },
            { text: "Web Forms", link: "/guide/webforms" },
            { text: "Configure", link: "/guide/configuration" },
            { text: "Integrate", link: "/guide/integrate" },
            { text: "Launch", link: "/guide/launch" },
            { text: "Administer", link: "/guide/administer" },
          ],
        },
        {
          text: "Developer Reference",
          items: [
            { text: "Authentication API", link: "/reference/authapi" },
            { text: "Admin API", link: "/reference/adminapi" },
            { text: "Tokens & Claims", link: "/reference/tokens" },

          ],
        },
      ],
      "/contributing/": [
        {
          text: "Contributing",
          items: [
            { text: "How to Contribute", link: "/contributing/readme" },
            { text: "Getting Help", link: "/contributing/gettinghelp" },
            { text: "Code of Conduct", link: "/contributing/codeofconduct" },
          ],
        },
      ],
      socialLinks: [
        {
          icon: "github",
          link: "https://github.com/authcompanion/authcompanion2",
        },
      ],
    },
  },
};
