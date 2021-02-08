export default [
    {
        path: 'admin',
        component: () => import(/*WebpackChunkName:manage*/'@/views/manage/Admin.vue'),
        name: 'admin',
        meta: {
            auth: 'admin'
        }
    },
    {
        path: 'account',
        component: () => import(/*WebpackChunkName:manage*/'@/views/manage/Account.vue'),
        name: 'account',
        meta: {
            auth: 'account'
        }
    },
    {
        path: 'skin',
        component: () => import(/*WebpackChunkName:manage*/'@/views/manage/Skin.vue'),
        name: 'skin',
        meta: {
            auth: 'skin'
        }
    },
    {
        path: 'article',
        component: () => import(/*WebpackChunkName:manage*/'@/views/manage/Article.vue'),
        name: 'article',
        meta: {
            auth: 'article'
        }
    },
]