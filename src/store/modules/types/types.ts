import type { RouteRecordRaw } from 'vue-router'
import type { CategoryObj } from '@/api/product/attr/type'

//定义小仓库数据state类型
export interface UserState {
  token: string | null
  memuRoutes: RouteRecordRaw[]
  username: string
  avata: string
  buttons: string[]
}

//定义商品分类仓库的数据类型
export interface CategoryState {
  c1Id: string | null
  c1Arr: CategoryObj[]
  c2Id: string | null
  c2Arr: CategoryObj[]
}
