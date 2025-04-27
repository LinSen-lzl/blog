export const redirects = JSON.parse("{}")

export const routes = Object.fromEntries([
  ["/", { loader: () => import(/* webpackChunkName: "index.html" */"D:/编程学习/个人博客/LinSenBlog-ui/docs/.vuepress/.temp/pages/index.html.js"), meta: {"title":""} }],
  ["/about/", { loader: () => import(/* webpackChunkName: "about_index.html" */"D:/编程学习/个人博客/LinSenBlog-ui/docs/.vuepress/.temp/pages/about/index.html.js"), meta: {"title":""} }],
  ["/backend/", { loader: () => import(/* webpackChunkName: "backend_index.html" */"D:/编程学习/个人博客/LinSenBlog-ui/docs/.vuepress/.temp/pages/backend/index.html.js"), meta: {"title":""} }],
  ["/deployment/", { loader: () => import(/* webpackChunkName: "deployment_index.html" */"D:/编程学习/个人博客/LinSenBlog-ui/docs/.vuepress/.temp/pages/deployment/index.html.js"), meta: {"title":""} }],
  ["/guide/", { loader: () => import(/* webpackChunkName: "guide_index.html" */"D:/编程学习/个人博客/LinSenBlog-ui/docs/.vuepress/.temp/pages/guide/index.html.js"), meta: {"title":""} }],
  ["/frontend/", { loader: () => import(/* webpackChunkName: "frontend_index.html" */"D:/编程学习/个人博客/LinSenBlog-ui/docs/.vuepress/.temp/pages/frontend/index.html.js"), meta: {"title":""} }],
  ["/404.html", { loader: () => import(/* webpackChunkName: "404.html" */"D:/编程学习/个人博客/LinSenBlog-ui/docs/.vuepress/.temp/pages/404.html.js"), meta: {"title":""} }],
]);

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateRoutes) {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
  }
  if (__VUE_HMR_RUNTIME__.updateRedirects) {
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ routes, redirects }) => {
    __VUE_HMR_RUNTIME__.updateRoutes(routes)
    __VUE_HMR_RUNTIME__.updateRedirects(redirects)
  })
}
