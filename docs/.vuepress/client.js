import { defineClientConfig } from '@vuepress/client'
import { provide } from 'vue'
import { usePageData } from '@vuepress/client'

export default defineClientConfig({
  setup() {
    // 关键：在根层级提供 pageData 上下文
    const pageData = usePageData()
    provide('pageData', pageData)
  },
  // 可选：添加其他全局配置（如路由守卫）
  async enhance({ app, router }) {
    router.beforeEach((to, from, next) => {
      console.log('路由跳转:', to.path)
      next()
    })
  }
})