import { createApp } from 'vue'
import App from '@/App.vue'
//引入element-plus插件与央样式
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//svg插件需要配置的代码
import 'virtual:svg-icons-register'
//配置element-plus国际化
//@ts-ignore
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
//引入自定义插件对象，注册整个项目的全局组件
import globalComponent from '@/components/index'
//引入模板的全局样式
import '@/styles/index.scss'
//引入路由
import router from './router/index'
//引入仓库
import pinia from './store'
//引入守卫
import './permission'
//暗黑模式需要的样式
import 'element-plus/theme-chalk/dark/css-vars.css'

//获取应用的实例对象
const app = createApp(App)
app
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(router)
  .use(pinia)
  .use(globalComponent)
  .mount('#app')
