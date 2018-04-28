import Login from '@/components/Login'
import Aside from '@/components/Aside'

let routes = [
  	{
      path: '/',
      name: 'Login',
      component: Login

    },
    {
    	path: '/aside',
    	name: 'Aside',
    	component: Aside
    },
]

export default routes

