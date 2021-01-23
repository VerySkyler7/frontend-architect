export default [
    {
        path: '/',
        component: () => import(/*WebpackChunkName:'home'*/'@/views/Home.vue')
    },
    {
        path: '*',
        component: () => import(/*WebpackChunkName:'404'*/'@/views/404.vue')
    },
]