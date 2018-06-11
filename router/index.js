let routes = [
  	{
      path: '/Login',
      name: 'Login',
      component: () => import('@/components/Login'),
      leaf:true,
    },
    {
      path: '/404',
      name: 'NotFound',
      component: () => import('@/components/NotFound'),
      leaf:true,
    },
]

export default routes

