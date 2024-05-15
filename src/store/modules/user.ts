//创建用户相关的小仓库
import { defineStore } from 'pinia';
//引入登录接口,以及其数据类型
import { reqLogin, reqUserInfo, reqLogout } from '@/api/user';
import type { loginFormData, loginResponseData, userInfoResponseData } from '@/api/user/type'

// import type { UserState } from './types/types';
import { ref } from 'vue';
import { SET_TOKEN, GET_TOKEN, REMOVE_TOKEN } from '@/utils/token'
//引入常量路由
import { constantRoute, asnycRoute, anyRoute } from '@/router/routes';
import router from '@/router'
//引入深拷贝
//@ts-ignore
import cloneDeep from 'lodash/cloneDeep'

let useUserStore = defineStore('User', () => {
    //本地化存储token
    let token = ref(GET_TOKEN())
    let memuRoutes = ref<any>([])
    let username = ref('')
    let avatar = ref('')
    let buttons= ref<string[]>([])

    //筛选用户所拥有的路由权限和异步路由
    const filterAsyncRoute = (asnycRoute: any, routes: any) => {
        return asnycRoute.filter((item: any) => {
            if (routes.includes(item.name)) {
                if (item.children && item.children.length > 0) {
                    item.children = filterAsyncRoute(item.children, routes)
                }
                return true
            }
        })
    }

    //用户登录的方法
    async function userLogin(data: loginFormData) {
        let result: loginResponseData = await reqLogin(data);
        //登录成功,token返回200，失败返回201
        if (result.code == 200) {
            token.value = (result.data as string)
            SET_TOKEN((result.data as string));  //本地化存储token
            return 'ok';
        } else {
            return Promise.reject(new Error(result.data));
        }
    }

    //获取用户信息，存如pinia(名字，头像)
    async function userInfo() {
        let result: userInfoResponseData = await reqUserInfo();
        //如果获取用户信息成功，则存储
        if (result.code == 200) {
            username.value = result.data.name;
            avatar.value = result.data.avatar;
            buttons.value=result.data.buttons;
            //筛选用户所需要的异步路由
            let userAsyncRoute = filterAsyncRoute(cloneDeep(asnycRoute), result.data.routes);
            memuRoutes.value = [...constantRoute, ...anyRoute, ...userAsyncRoute];
            [...userAsyncRoute, ...anyRoute].forEach((route: any) => {
                router.addRoute(route)
            });
            console.log(userAsyncRoute);
            return 'ok'
        } else {
            return Promise.reject(new Error(result.message));
        }
    }

    //退出登录，清空用户信息
    async function userLogout() {
        let result: any = await reqLogout();
        if (result.code == 200) {
            token.value = '';
            username.value = '';
            avatar.value = '';
            REMOVE_TOKEN();
        } else {
            return Promise.reject(new Error(result.message));
        }
    }
    return { userLogin, token, memuRoutes, userInfo, username, avatar, userLogout,buttons }
}
)

export default useUserStore