export interface ResponseData {
  code: number
  message: string
  ok: boolean
}

//添加sku数据类型
export interface Attr {
  attrId: number | string //平台属性的ID
  valueId: number | string //属性值的ID
}
export interface saleArr {
  saleAttrId: number | string //属性ID
  saleAttrValueId: number | string //属性值的ID
}
export interface SkuData {
  category3Id?: string | number //三级分类的ID
  spuId?: string | number //已有的SPU的ID
  tmId?: string | number //SPU品牌的ID
  skuName?: string //sku名字
  price?: string | number //sku价格
  weight?: string | number //sku重量
  skuDesc?: string //sku的描述
  skuAttrValueList?: Attr[]
  skuSaleAttrValueList?: saleArr[]
  skuDefaultImg?: string //sku图片地址
  isSale?: number
  id?: number
}
//获取SKU接口返回的数据类型
export interface SkuResponseData extends ResponseData {
  data: {
    records: SkuData[]
    total: number
    size: number
    current: number
    order: []
    optimizeCountSql: boolean
    hitCount: boolean
    countId: null
    maxLimit: null
    searchCount: boolean
    pages: number
  }
}

//获取SKU某一商品详情
export interface SkuInfoData extends ResponseData {
  data: SkuData[]
}
