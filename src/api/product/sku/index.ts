import request from '@/utils/requests'
import { SkuResponseData, SkuInfoData } from './type'

enum API {
  //1.获取SKU
  SKU_URL = '/admin/product/list/',
  //2.商品上架
  SALE_URL = '/admin/product/onSale/',
  //3，商品下架
  CANCELSALE_URL = '/admin/product/cancelSale/',
  //4.获取某一SKU的详细
  SKUINFO_URL = '/admin/product/getSkuInfo/',
  //删除
  DELETESKU_URL = '/admin/product/deleteSku/',
}

//1.
export const reqSkuList = (page: number, limit: number) =>
  request.get<any, SkuResponseData>(API.SKU_URL + `${page}/${limit}`)
//2.
export const reqSaleSku = (skuId: number) =>
  request.get<any, any>(API.SALE_URL + skuId)
//3.
export const reqCancelSale = (skuId: number) =>
  request.get<any, any>(API.CANCELSALE_URL + skuId)
// 4.
export const reqSkuInfo = (skuId: number) =>
  request.get<any, SkuInfoData>(API.SKUINFO_URL + skuId)
//5.
export const reqRemoveSku = (skuId: number) =>
  request.delete<any, any>(API.DELETESKU_URL + skuId)
