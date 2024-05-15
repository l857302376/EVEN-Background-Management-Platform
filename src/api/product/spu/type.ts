export interface ResponseData {
    code: number,
    message: string,
    ok: boolean,
}
//SPU数据类型
export interface SpuData {
    category3Id: string | number,
    id?: number,
    spuName: string,
    description: string | number,
    tmId: number | string,
    spuSaleAttrList: null | SpuImg[], //修改
    spuImageList: null | SaleAttr[], //修改
}
//包含spu数据的数组
export type Records = SpuData[];

//返回的整体数据类型
export interface HasSpuResponseData extends ResponseData {
    data: {
        records: Records
        total: number,
        size: number,
        current: number,
        searchCount: boolean,
        pages: number,
    }
}

//品牌名称
export interface Trademark {
    id: number,
    tmName: string,
    logoUrl: string,
}
//品牌接口返回的数据
export interface AllTrademark extends ResponseData {
    data: Trademark[]
}


//商品图片
export interface SpuImg {
    id?: number,
    createTIme?: string,
    updateTime?: string,
    spuId?: number,
    imgName?: string,
    imgUrl?: string,
    name?: string,
    url?: string,
}
//图片接口返回的数据
export interface SpuHasImg extends ResponseData {
    data: SpuImg[],
}


//某个spu对应的属性值
export interface SaleAttrValue {
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrValueName: string,
    saleAttrName?: string,
    isChecked?: null,
}
//spu属性数据类型
export interface SaleAttr {
    id?: number,
    createTime?: null,
    updateTime?: null,
    spuId?: number,
    baseSaleAttrId: number | string,
    saleAttrName: string,
    spuSaleAttrValueList: SaleAttrValue[],
    flag?: boolean,
    saleAttrValue?: string,
}
//spu属性接口返回的数据
export interface SaleAttrResponseData extends ResponseData {
    data: SaleAttr[]
}


//全部spu属性类型
export interface HasSaleAttr {
    id: number,
    name: string,
}
export interface HasSaleAttrResponseData extends ResponseData {
    data: HasSaleAttr[]
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
    category3Id: string | number //三级分类的ID
    spuId: string | number //已有的SPU的ID
    tmId: string | number //SPU品牌的ID
    skuName: string //sku名字
    price: string | number //sku价格
    weight: string | number //sku重量
    skuDesc: string //sku的描述
    skuAttrValueList?: Attr[]
    skuSaleAttrValueList?: saleArr[]
    skuDefaultImg: string //sku图片地址
}

//获取某一SPU下的SKU展示
export interface SkuInfoData extends ResponseData {
    data: SkuData[],
}