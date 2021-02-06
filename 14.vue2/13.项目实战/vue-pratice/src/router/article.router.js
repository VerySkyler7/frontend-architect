export default [
    {
        path: '/article',
        component: () => import(/*WebpackChunkName:'home'*/'@/views/article/Publish.vue'),
        meta: {
            needLogin: true
        }
    }
]