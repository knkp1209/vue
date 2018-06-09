const Login = () => import('@/components/Login')
const Aside = () => import('@/components/Aside')
const Home = () => import('@/components/Home')
const Main = () => import('@/components/Main')
const Maina = () => import('@/components/Maina')


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

