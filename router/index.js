let routes = [
  	{
      path: '/Login',
      name: 'Login',
      component: () => import('@/components/Login')

    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/components/Home'),
      children: [{
        path: '/aside',
        name: 'Aside',
        component: () => import('@/components/Aside')
      },
      {
        path: '/maina',
        name: 'Maina',
        component: () => import('@/components/Maina')
      },
      {
        path: '/main',
        name: 'Main',
        component: () => import('@/components/Main')
      }]
    }
]

export default routes

