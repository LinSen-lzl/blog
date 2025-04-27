export default [
    {
      text: '主页',
      link: '/'
    },
    // {
    //   text: '前端',
    //   children: [
    //     { text: 'Html', link: '/frontend/html/' },
    //     { text: 'CSS', link: '/frontend/css/' },
    //     { text: 'JavaScript', link: '/frontend/javascript/' },
    //     { text: 'Vue', link: '/frontend/vue/' }
    //   ]
    // },
    {
      text: '后端',
      children: [
        { text: 'WebSocket', link: '/backend/websocket/' },
        { text: 'Java多线程与线程池', link: '/backend/javathread/' },
        { text: 'Java线程同步', link: '/backend/threadsync/' },
        { text: 'Java锁', link: '/backend/javalock/' },
        { text: 'MySQL', link: '/backend/mysql/' },
        { text: 'Flowable工作流', link: '/backend/flowable/' },
        { text: 'SpringSecurity', link: '/backend/springsecurity/' },
        { text: 'SpringCloud', link: '/backend/springcloud/' },
        { text: 'JDK新特性', link: '/backend/jdknewfeatures' }
      ]
    },
    { 
      text: '算法', 
      children: [
        { text: '算法思想', link: '/algorithm/thinking/' },
        { text: '算法题:动态规划', link: '/algorithm/dp/' },
        { text: '算法题:滑动窗口', link: '/algorithm/sw/' },
        { text: '算法题:分治', link: '/algorithm/dac/' },
      ]
    },
    { 
      text: '部署', 
      children: [
        { text: 'Docker', link: '/deployment/docker/' },
        { text: 'Nginx', link: '/deployment/nginx/' }
      ]
    },
    { 
      text: 'AI',
      children: [
        { text: 'mcp协议', link: '/ai/mcp/' }
      ]
    }
]