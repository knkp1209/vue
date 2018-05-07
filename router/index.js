import Login from '@/components/Login'
import Aside from '@/components/Aside'
import Home from '@/components/Home'

let routes = [
  	{
      path: '/Login',
      name: 'Login',
      component: Login

    },
    {
    	path: '/aside',
    	name: 'Aside',
    	component: Aside
    },
    {
      path: '/',
      name: 'Home',
      component: Home
    }
]

export default routes

