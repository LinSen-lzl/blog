import path from 'path'
import { searchPlugin } from '@vuepress/plugin-search'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { registerComponentsPlugin } from '@vuepress/plugin-register-components'

export default [
    searchPlugin({
        // 多语言搜索提示
        locales: {
          '/': { placeholder: '输入关键词...' },
        //   '/en/': { placeholder: 'Type to search' },
        },
  
        // 快捷键配置（支持组合键）
        hotKeys: [
          { key: 'k', ctrl: true },  // Ctrl+K
          { key: '/', meta: true },  // Cmd+/ (Mac)
        ],
  
        // 搜索增强配置
        maxSuggestions: 10, // 最多显示10条结果
        searchMaxSuggestions: 50, // 最多扫描50个文件
  
        // 排除关于页面和隐藏目录
        isSearchable: (page) => 
          !page.path.startsWith('/about/') && 
          !page.path.includes('/hidden/'),
  
        // 扩展搜索字段：标题 + 标签 + 自定义字段
        getExtraFields: (page) => [
          page.frontmatter.title,
          ...(page.frontmatter.tags || []),
          page.frontmatter.customField || '',
        ]
    }),
    googleAnalyticsPlugin({
        id: process.env.GOOGLE_GA || '', // 优先读取环境变量
    }),
    registerComponentsPlugin({
        componentsDir: path.resolve(__dirname, '../components'),
    })
]