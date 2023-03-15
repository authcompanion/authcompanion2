import { defineUserConfig } from "vuepress";
import { defaultTheme } from 'vuepress'

export default defineUserConfig({
  lang: "en-US",
  title: "AuthCompanion 2",
  description:
    "Documenation Site for AuthCompanion - An effortless, open source, token-based user management server - well suited for modern web projects.",
  head: [['script', { async: true, defer: true, src: 'https://scripts.withcabin.com/hello.js' }]],
  theme: defaultTheme({
    logo: "",
    darkMode: true,
    repo: "authcompanion/authcompanion2",
    editLink: false,
    lastUpdated: true,
    navbar: [
      {
        text: "Guide",
        link: "/",
      },
      {
        text: "Contributing",
        link: "/contributing/",
      },
      {
        text: "License",
        link: "/guide/licenseoverview.md",
      },
      {
        text: "Demo",
        link: "https://demo.authcompanion.com/v1/web/register",
      },
    ],
    // sidebar object
    // pages under different sub paths will use different sidebar
    sidebar: {
      "/": [
        {
          text: "📚 The Guide",
          children: [
            "/guide/gettingstarted.md",
            "/guide/explore.md",
            "/guide/webforms.md",
            "/guide/configuration.md",
            "/guide/integrate.md",
            "/guide/launch.md",
            "/guide/administer.md",
          ],
        },
        {
          text: "Reference",
          children: [
            "/guide/authapi.md",
            "/guide/adminapi.md",
          ],
        },
      ],
      "/contributing/": [
        {
          text: "How to Contribute",
          children: ["gettinghelp.md", "codeofconduct.md"],
        },
      ],
    },
  }),
});
