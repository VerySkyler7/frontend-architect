export default [
    {
        path: '/article',
        component: () => import(/*WebpackChunkName:'article'*/'@/views/article/Publish.vue'),
        meta: {
            needLogin: true
        }
    }
]