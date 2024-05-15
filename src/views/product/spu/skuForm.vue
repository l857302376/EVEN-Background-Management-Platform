<template>
    <el-form label-width="100px">
        <el-form-item label="SKU名称">
            <el-input placeholder="请输入SKU名称" v-model="skuParams.skuName"></el-input>
        </el-form-item>
        <el-form-item label="价格(元)">
            <el-input placeholder="请输入价格(元)" type="number" v-model="skuParams.price"></el-input>
        </el-form-item>
        <el-form-item label="重量(g)">
            <el-input placeholder="请输入重量(g)" v-model="skuParams.weight"></el-input>
        </el-form-item>
        <el-form-item label="SKU描述">
            <el-input placeholder="请输入SKU描述" type="textarea" v-model="skuParams.skuDesc"></el-input>
        </el-form-item>
        <el-form-item label="平台属性">
            <el-form inline label-width="80px">
                <el-form-item v-for="(item) in attrArr" :key="item.id" :label="item.attrName">
                    <el-select v-model="item.attrIdAndValueId">
                        <el-option v-for="(attrValue) in item.attrValueList" :key="attrValue.id"
                            :label="attrValue.valueName" :value="`${item.id}:${attrValue.id}`"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="销售属性">
            <el-form inline label-width="80px">
                <el-form-item v-for="(item) in saleArr" :key="item.id" :label="item.saleAttrName">
                    <el-select v-model="item.saleIdAndValueId">
                        <el-option v-for="(saleAttrValue) in item.spuSaleAttrValueList" :key="saleAttrValue.id"
                            :label="saleAttrValue.saleAttrValueName"
                            :value="`${item.id}:${saleAttrValue.id}`"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-form-item>
        <el-form-item label="图片名称">
            <el-table border :data="imgArr" ref="table">
                <el-table-column type="selection" width="80px" align="center"></el-table-column>
                <el-table-column label="图片" align="center">
                    <template #="{ row }">
                        <el-image :src="row.imgUrl" style="width:100px; height:100px"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="名称" align="center" prop="imgName"></el-table-column>
                <el-table-column label="操作" align="center">
                    <template #="{ row }">
                        <el-button @click="handler(row)" type="primary" size="small">设置默认</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <div style="display: flex; justify-content: flex-end;">
            <el-button @click="cancel" type="danger">取消</el-button>
            <el-button @click="save" type="primary">保存</el-button>
        </div>
    </el-form>
</template>

<script setup lang="ts">
import { reqAttr } from '@/api/product/attr';
import { reqSpuIamgeList, reqSpuHasSaleAttr, reqAddSku } from '@/api/product/spu';
import { AttrResponseData } from '@/api/product/attr/type';
import { reactive, ref } from 'vue';
import { SkuData } from '@/api/product/spu/type';
import { ElMessage } from 'element-plus';

let $emit = defineEmits(['changeScene'])
//存储从c3ID中获取的数据
let attrArr = ref<any>([]);
let saleArr = ref<any>([]);
let imgArr = ref<any>([]);
//收集SKU参数
let skuParams = reactive<SkuData>({
    //父组件传递过来的
    category3Id: '', //三级分类的ID
    spuId: '', //已有的SPU的ID
    tmId: '',//SPU品牌的ID
    //通过v-model收集
    skuName: '', //sku名字
    price: '', //sku价格
    weight: '', //sku重量
    skuDesc: '', //sku的描述
    skuAttrValueList: [
        {
            attrId: '', //平台属性的ID
            valueId: '',//属性值的ID
        }
    ],
    skuSaleAttrValueList: [
        {
            saleAttrId: '', //属性ID
            saleAttrValueId: '', //属性值的ID
        }
    ],
    skuDefaultImg: '', //sku图片地址
})
//获取图片表格的ref
let table = ref()

// 取消按钮
const cancel = () => {
    $emit('changeScene', { flag: 0, params: '' })
}

//父组件ref实例调用的方法
const initSkuData = async (c1Id: number | string, c2Id: number | string, spu: any) => {
    skuParams.category3Id = spu.category3Id;
    skuParams.spuId = spu.id;
    skuParams.tmId = spu.tmId;
    //获取attr
    let result: AttrResponseData = await reqAttr(c1Id, c2Id, spu.category3Id);
    //获取销售属性
    let result1: any = await reqSpuHasSaleAttr(spu.id)
    //获取照片墙数据
    let result2: any = await reqSpuIamgeList(spu.id)
    //平台属性
    attrArr.value = result.data
    //销售属性
    saleArr.value = result1.data
    //图片
    imgArr.value = result2.data
}

//图片中的设置默认按钮
const handler = (row: any) => {
    //只能勾选其中的一个
    //先全部取消勾选
    imgArr.value.forEach((item: any) => {
        table.value.toggleRowSelection(item, false)
    });
    //再勾选所选的一个
    table.value.toggleRowSelection(row, true)
    skuParams.skuDefaultImg = row.imgUrl;
}

//保存按钮
const save = async () => {
    //整理参数
    //平台属性
    skuParams.skuAttrValueList = attrArr.value.reduce((prev: any, next: any) => {
        if (next.attrIdAndValueId) {
            let [attrId, valueId] = next.attrIdAndValueId.split(':')
            prev.push({
                attrId,
                valueId
            })
        }
        return prev;
    }, []);
    //销售属性
    skuParams.skuSaleAttrValueList = saleArr.value.reduce((prev: any, next: any) => {
        if (next.saleIdAndValueId) {
            let [saleAttrId, saleAttrValueId] = next.saleIdAndValueId.split(':')
            prev.push({
                saleAttrId,
                saleAttrValueId
            })
        }
        return prev;
    }, []);
    //发送添加请求
    let result: any = await reqAddSku(skuParams);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '添加成功'
        })
        //切换场景
        $emit('changeScene', { flag: 0, params: '' });
    } else {
        ElMessage({
            type: 'error',
            message: '添加失败'
        })
    }
}

defineExpose({
    initSkuData,
})

</script>

<style scoped lang="scss">
.el-select {
    --el-select-width: 190px;
}
</style>