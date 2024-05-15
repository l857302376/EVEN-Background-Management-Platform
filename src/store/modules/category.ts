//商品分类全局组件的小仓库
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reqC1, reqC2, reqC3 } from '@/api/product/attr/index'
import { CategoryResponseData } from '@/api/product/attr/type'

let useCategoryStore = defineStore('Category', () => {
  let c1Arr = ref<any>([])
  let c1Id = ref<number | string>('')
  let c2Arr = ref<any>([])
  let c2Id = ref<number | string>('')
  let c3Arr = ref<any>([])
  let c3Id = ref<number | string>('')

  const getC1 = async () => {
    let result: CategoryResponseData = await reqC1()
    if (result.code == 200) {
      c1Arr.value = result.data
    }
  }

  const getC2 = async () => {
    let result: CategoryResponseData = await reqC2(c1Id.value)
    if (result.code == 200) {
      c2Arr.value = result.data
    }
  }

  const getC3 = async () => {
    let result: CategoryResponseData = await reqC3(c2Id.value)
    if (result.code == 200) {
      c3Arr.value = result.data
    }
  }

  return { getC1, getC2, getC3, c1Arr, c1Id, c2Arr, c2Id, c3Arr, c3Id }
})

export default useCategoryStore
