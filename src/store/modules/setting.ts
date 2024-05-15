//关于layout组件配置的仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'

let useLayoutSettingStore = defineStore('settingStore', () => {
  let fold = ref(false) //控制菜单是否折叠
  let refsh = ref(false) //控制界面是否刷新
  return { fold, refsh }
})

export default useLayoutSettingStore
