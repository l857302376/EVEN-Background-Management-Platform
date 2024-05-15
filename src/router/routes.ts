//常量路由
export const constantRoute = [
    //登录login
    {
        path: '/login',
        component: () => import('@/views/login/index.vue'),
        name: 'login',
        meta: {
            title: '登录',
            hidden: true, //在侧栏菜单中隐藏
        }
    },
    //首页home
    {
        path: '/',
        component: () => import('@/layout/index.vue'),
        name: 'layout',
        redirect: '/home',
        meta: {
            title: '',
            hidden: false, //在侧栏菜单中不隐藏
            icon: '',
        },
        children: [
            {
                path: '/home',
                component: () => import('@/views/home/index.vue'),
                meta: {
                    title: '首页',
                    hidden: false, //在侧栏菜单中不隐藏
                    icon: 'HomeFilled',
                },
            },
        ]
    },
    //404
    {
        //找不到地址
        path: '/404',
        component: () => import('@/views/404/index.vue'),
        name: '404',
        meta: {
            title: '404',
            hidden: true, //在侧栏菜单中隐藏
        }
    },

    //数据大屏screen
    {
        path: '/screen',
        component: () => import('@/views/screen/index.vue'),
        name: 'Screen',
        meta: {
            title: '数据大屏',
            hidden: false, //在侧栏菜单中隐藏
            icon: 'Platform',
        }
    },

]

export const asnycRoute = [
    //权限管理acl
    {
        path: '/acl',
        component: () => import('@/layout/index.vue'),
        name: 'Acl',
        redirect: '/acl/user',
        meta: {
            title: '权限管理',
            hidden: false, //在侧栏菜单中不隐藏
            icon: 'Lock',
        },
        children: [
            {
                path: '/acl/user',
                component: () => import('@/views/acl/user/index.vue'),
                name: 'User',
                meta: {
                    title: '用户管理',
                    hidden: false, //在侧栏菜单中不隐藏
                    icon: 'User',
                },
            },
            {
                path: '/acl/role',
                component: () => import('@/views/acl/role/index.vue'),
                name: 'Role',
                meta: {
                    title: '角色管理',
                    hidden: false, //在侧栏菜单中不隐藏
                    icon: 'UserFilled',
                },
            },
            {
                path: '/acl/permission',
                component: () => import('@/views/acl/permission/index.vue'),
                name: 'Permission',
                meta: {
                    title: '菜单管理',
                    hidden: false, //在侧栏菜单中不隐藏
                    icon: 'Monitor',
                },
            },
        ]
    },
    //商品管理product
    {
        path: '/product',
        component: () => import('@/layout/index.vue'),
        name: 'Product',
        redirect: '/product/trademark',
        meta: {
            title: '商品管理',
            hidden: false, //在侧栏菜单中不隐藏
            icon: 'Goods',
        },
        children: [
            {
                path: '/product/trademark',
                component: () => import('@/views/product/trademark/index.vue'),
                name: 'Trademark',
                meta: {
                    title: '品牌管理',
                    hidden: false, //在侧栏菜单中不隐藏
                    icon: 'ShoppingCartFull',
                },
            },
            {
                path: '/product/attr',
                component: () => import('@/views/product/attr/index.vue'),
                name: 'Attr',
                meta: {
                    title: '属性管理',
                    hidden: false, //在侧栏菜单中不隐藏
                    icon: 'ChromeFilled',
                },
            },
            {
                path: '/product/spu',
                component: () => import('@/views/product/spu/index.vue'),
                name: 'Spu',
                meta: {
                    title: 'SPU管理',
                    hidden: false, //在侧栏菜单中不隐藏
                    icon: 'Calendar',
                },
            },
            {
                path: '/product/sku',
                component: () => import('@/views/product/sku/index.vue'),
                name: 'Sku',
                meta: {
                    title: 'SKU管理',
                    hidden: false, //在侧栏菜单中不隐藏
                    icon: 'Orange',
                },
            },
        ]
    },
]

export const anyRoute = [
    //任意路由
    {
        //任意路由，若其他地址无效，则返回此地址
        path: '/:pathMatch(.*)*',
        redirect: '/404',
        name: 'Any',
        meta: {
            title: '任意路由',
            hidden: true, //在侧栏菜单中隐藏
        }
    },


]