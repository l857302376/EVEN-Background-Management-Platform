//属性管理模块接口
import request from '@/utils/requests'
import type { CategoryResponseData, AttrResponseData, Attr } from './type.ts'

enum API {
  //获取一级分类接口
  C1_URL = '/admin/product/getCategory1',
  //获取二级分类接口
  C2_URL = '/admin/product/getCategory2/',
  //获取三级分类接口
  C3_URL = '/admin/product/getCategory3/',
  //获取分类下的属性接口
  ATTR_URL = '/admin/product/attrInfoList/',
  //添加或修改属性接口
  ADDORUPDATEATTR = '/admin/product/saveAttrInfo',
  //删除属性的接口
  DELETEATTR_URL = '/admin/product/deleteAttr/',
}

//获取一级分类的接口方法
export const reqC1 = () => request.get<any, CategoryResponseData>(API.C1_URL)

//获取二级分类的接口方法
export const reqC2 = (category1Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C2_URL + category1Id)

//获取三级分类的接口方法
export const reqC3 = (category2Id: number | string) =>
  request.get<any, CategoryResponseData>(API.C3_URL + category2Id)

//获取属性的方法
export const reqAttr = (
  category1Id: number | string,
  category2Id: number | string,
  category3Id: number | string,
) =>
  request.get<any, AttrResponseData>(
    API.ATTR_URL + `${category1Id}/${category2Id}/${category3Id}`,
  )

//新增，修改属性方法
export const reqAddOrUpdateAttr = (data: Attr) =>
  request.post<any, any>(API.ADDORUPDATEATTR, data)

//删除属性方法
export const reqRemoveAttr = (attrId: number) =>
  request.delete<any, any>(API.DELETEATTR_URL + attrId)
