import { CodeTabs } from "D:/编程学习/个人博客/LinSenBlog-ui/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/CodeTabs.js";
import { Tabs } from "D:/编程学习/个人博客/LinSenBlog-ui/node_modules/@vuepress/plugin-markdown-tab/lib/client/components/Tabs.js";
import "D:/编程学习/个人博客/LinSenBlog-ui/node_modules/@vuepress/plugin-markdown-tab/lib/client/styles/vars.css";

export default {
  enhance: ({ app }) => {
    app.component("CodeTabs", CodeTabs);
    app.component("Tabs", Tabs);
  },
};
