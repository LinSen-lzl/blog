import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme, defineUserConfig } from 'vuepress'
import navConfig from './navConfig'
import sidebarConfig from './sidebarConfig'
import pluginConfig from './pluginConfig'
import path from 'path'

export default defineUserConfig({
  // 基础路径必须设置（核心修复点）
  base: '/',
  
  lang: 'zh-CN',
  title: '深海怪鱼的博客',
  
  // 修复资源加载路径的关键配置
  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['meta', { name: 'referrer', content: 'no-referrer' }] // 解决某些情况下的资源拦截
  ],

  bundler: viteBundler({
    viteOptions: {
      css: {
        preprocessorOptions: {
          scss: {
            quietDeps: true
          }
        }
      },
      // 添加资源路径别名
      resolve: {
        alias: {
          '@assets': path.resolve(__dirname, './public')
        }
      }
    }
  }),

  theme: defaultTheme({
    // 修正 logo 路径（必须使用相对路径）
    logo: './main.jpg',
    
    lastUpdatedText: '更新时间',
    docsRepo: 'LinSen-lzl/blog',
    docsDir: 'docs',
    docsBranch: 'master',
    
    // 修复导航栏图标加载
    navbar: navConfig.map(item => {
      if(item.icon) {
        item.icon = `./${item.icon}` // 确保图标路径为相对路径
      }
      return item
    }),
    
    sidebar: sidebarConfig
  }),

  plugins: pluginConfig,
  
  markdown: {
    importCode: { 
      handleImportPath: str => str.replace(
        /^@components/,
        path.normalize('./components') // 修正组件路径为相对路径
      )
    }
  },
  
  // 添加构建输出目录配置
  dest: 'docs/.vuepress/dist',
  
  // 增强路径兼容性处理
  onPrepared: async (app) => {
    app.pages.forEach(page => {
      page.path = page.path.replace(/\/$/, '') // 统一路径格式
    })
  }
})