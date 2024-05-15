//路由鉴权，某个路由哪些条件是否可以访问
import router from '@/router';

//引入进度条插件，样式
import nprogress from 'nprogress';
import "nprogress/nprogress.css"
nprogress.configure({ showSpinner: false })
//引入用户仓库的token，判断是否登录
import pinia from './store';
import useUserStore from './store/modules/user';

//引入setting，配置页面title
import setting from './setting';

let userStore = useUserStore(pinia)

//全局守卫：项目任意路由切换都会触发的钩子
//全局前置守卫
router.beforeEach(async (to: any, _: any, next: any) => {
    //to--将要访问的路由对象
    //from--从那个路由而来
    //next--路由的放行函数

    //1.使用nprogress插件加载进度条
    nprogress.start()

    //2.路由访问权限
    //获取token，判断用户是否登录成功
    let token = userStore.token;

    //3.访问除home外其余页面也可以获取用户信息
    let username = userStore.username

    if (token) {
        //2--可以访问除login之外所有页面
        if (to.path == '/login') {
            next({ path: '/' });
        } else {
            //3--如果有用户信息则放行，否则在守卫中获取用户信息
            if (username) {
                next();
            } else {
                //3---获取成功，放行
                try {
                    await userStore.userInfo();
                    //刷新的时候如果是异步路由，会出现加载失败，白屏的现象
                    next({...to});
                } catch (error) {
                    //若toekn过期，或者用户手动修改了本地储存的token
                    await userStore.userLogout();
                    next({ path: '/login', query: { redirect: to.path } });
                }
            }
        }
    } else {
        //2--只能访问login，否则携带redirect: to.path
        if (to.path == '/login') {
            next();
        } else {
            next({ path: '/login', query: { redirect: to.path } });
        }
    }

    //4.添加title
    document.title = setting.title + '-' + to.meta.title;

})


//全局后置守卫
router.afterEach(() => {
    //1.使用nprogress插件加载进度条
    nprogress.done()

})

