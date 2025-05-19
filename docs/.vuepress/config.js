import { defaultTheme } from '@vuepress/theme-default'
import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import navConfig from './config/navConfig'
import sidebarConfig from './config/sidebarConfig'
import pluginConfg from './config/pluginConfig'

export default defineUserConfig({
  lang: 'zh-CN',
  title: '深海怪鱼的博客',
  bundler: viteBundler({
    viteOptions: {
      css: {
        preprocessorOptions: {
          scss: {
            quietDeps: true
          }
        }
      }
    }
  }),
  theme: defaultTheme({
    logo: '/main.jpg',
    lastUpdated: true,
    lastUpdatedText: '更新时间',
    contributorsText: '贡献者',
    editLinkText: '编辑此文档',
    docsRepo: 'LinSen-lzl/blog',
    docsDir: 'docs',
    docsBranch: 'master',
    navbar: navConfig,
    sidebar: sidebarConfig
  }),
  plugins: pluginConfg,
  markdown: {
    importCode: { 
      handleImportPath: str => str.replace(
        /^@components/, 
        // 使用规范化路径处理
        path.normalize(path.resolve(__dirname, './components'))
      )
    },
  }
})
