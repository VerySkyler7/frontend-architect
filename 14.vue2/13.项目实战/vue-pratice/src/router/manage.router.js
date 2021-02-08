export default [
    {
        path: '/manage',
        component: () => import(/*WebpackChunkName:'manage'*/'@/views/manage/Manage.vue')
    }
]