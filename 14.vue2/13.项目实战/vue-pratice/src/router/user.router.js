export default [
    {
        path: '/user/login',
        component: () => import(/*WebpackChunkName:'login'*/'@/views/user/Login.vue')
    },
    {
        path: '/user/registry',
        component: () => import(/*WebpackChunkName:'registry'*/'@/views/user/Registry.vue')
    },
    {
        path: '/user/forget',
        component: () => import(/*WebpackChunkName:'forget'*/'@/views/user/Forget.vue')
    }
]