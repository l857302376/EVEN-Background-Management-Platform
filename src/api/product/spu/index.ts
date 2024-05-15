//SPU管理模块接口
import request from '@/utils/requests'
import type {
  HasSpuResponseData,
  AllTrademark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  SpuData,
  SkuInfoData,
} from './type'

enum API {
  //1.获取已有SPU数据
  HASSPU_URL = '/admin/product/',
  //2.获取全部品牌的名称
  ALLTRADEMARK_URL = '/admin/product/baseTrademark/getTrademarkList',
  //3.获取某一个spu下全部图片
  IMAGE_URL = '/admin/product/spuImageList/',
  //4.获取某一个spu下所有销售属性
  SPUHASALEATTR_URL = '/admin/product/spuSaleAttrList/',
  //5.获取所有的销售属性【颜色，版本，尺码】
  ALLSALEATTR_URL = '/admin/product/baseSaleAttrList',
  //6.添加SPU
  ADDSPU_URL = '/admin/product/saveSpuInfo',
  //7.修改并更新SPU
  UPDATESPU_URL = '/admin/product/updateSpuInfo',
  //8.新增sku
  ADDSKU_URL = '/admin/product/saveSkuInfo',
  //9.查看某一个SPU下全部售卖的sku
  SKUINFO_URL = '/admin/product/findBySpuId/',
  //10.删除SPU
  REMOVESPU_URL = '/admin/product/deleteSpu/',
}
//1.
export const reqHasSpu = (
  page: number,
  limit: number,
  category3Id: number | string,
) =>
  request.get<any, HasSpuResponseData>(
    API.HASSPU_URL + `${page}/${limit}?category3Id=${category3Id}`,
  )
//2.
export const reqAllTrademark = () =>
  request.get<any, AllTrademark>(API.ALLTRADEMARK_URL)
//3.
export const reqSpuIamgeList = (spuId: number) =>
  request.get<any, SpuHasImg>(API.IMAGE_URL + spuId)
//4.
export const reqSpuHasSaleAttr = (spuId: number) =>
  request.get<any, SaleAttrResponseData>(API.SPUHASALEATTR_URL + spuId)
//5.
export const reqAllSaleAttr = () =>
  request.get<any, HasSaleAttrResponseData>(API.ALLSALEATTR_URL)
//6.& 7.添加和更新取决于是否有ID
export const reqAddOrUpdateSpu = (data: SpuData) => {
  if (data.id) {
    return request.post<any, any>(API.UPDATESPU_URL, data)
  } else {
    return request.post<any, any>(API.ADDSPU_URL, data)
  }
}
//8.
export const reqAddSku = (data: any) =>
  request.post<any, any>(API.ADDSKU_URL, data)
//9.
export const reqSkuList = (spuId: number | string) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + spuId)
//10.
export const reqRemoveSpu = (spuId: number | string) =>
  request.delete<any, any>(API.REMOVESPU_URL + spuId)
