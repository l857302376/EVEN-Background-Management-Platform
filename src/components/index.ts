import SvgIcon from './SvgIcon/index.vue';
import Category from './Category/index.vue'
import Pagination from './Pagination/index.vue'

//所有图标并进行全局注册
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const allGlobalComponents: any = { SvgIcon, Category, Pagination }
//对外暴露插件对象
export default {
    install(app: any) {
        Object.keys(allGlobalComponents).forEach(key => {
            app.component(key, allGlobalComponents[key]);
        });
        for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
            app.component(key, component)
        }
    }
}