
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
            { text: "Getting Help", link: "/guide/gettinghelp" },
          ],
        },
        {
          text: "Developer Reference",
          items: [
            { text: "API Summery", link: "/reference/apisummary" },
            { text: "Tokens & Claims", link: "/reference/tokens" },

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
