import Login from '@/components/Login'
import Aside from '@/components/Aside'
import Home from '@/components/Home'
import Main from '@/components/Main'
import Maina from '@/components/Maina'

let routes = [
  	{
      path: '/Login',
      name: 'Login',
      component: Login

    },
    {
      path: '/',
      name: 'Home',
      component: Home,
      children: [{
        path: '/aside',
        name: 'Aside',
        component: Aside
      },
      {
        path: '/maina',
        name: 'Maina',
        component: Maina
      },
      {
        path: '/main',
        name: 'Main',
        component: Main
      }]
    }
]

export default routes

