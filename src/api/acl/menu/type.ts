export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//菜单与按钮数据
export interface Permssion {
  id?: number
  createTime: string
  updateTime: string
  pid: number
  name: string
  code: string
  toCode: string
  type: string
  status: null
  level: number
  children?: PermissonList
  select: boolean
}
export type PermissonList = Permssion[]
//接口返回菜单和按钮的数据
export interface PermissionResponseData extends ResponseData {
  data: PermissonList
}

//添加|修改携带的参数
export interface MunuParams {
  id?: number
  code: string
  level: number
  name: string
  pid: number
}
