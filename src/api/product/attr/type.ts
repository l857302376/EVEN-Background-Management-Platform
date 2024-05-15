//商品分类相关数据类型
export interface ResponseData {
  code: number
  message: string
  ok: boolean
}
//响应分类接口返回的数据类型
export interface CategoryResponseData extends ResponseData {
  data: {
    data: CategoryObj[]
  }
}
//响应数据的ts数据类型
export interface CategoryObj {
  id: number | string
  name: string
  category1Id?: number
  category2Id?: number
}

//商品属性值的ts类型
export interface AttrValue {
  id?: number
  valueName: string
  attrId?: number
  flag?: boolean
}
//存储所有属性值的ts类型
export type AttrValueList = AttrValue[]

//属性对象
export interface Attr {
  id?: number
  attrName: string
  categoryId: number | string
  categoryLevel: number
  attrValueList: AttrValue[]
}

//存储每一个属性的对象的数组ts类型
export type AttrList = Attr[]

//属性接口返回的数据类型
export interface AttrResponseData extends ResponseData {
  data: Attr[]
}
