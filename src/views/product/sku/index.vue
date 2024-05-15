<template class="sku">
    <el-card>
        <el-table border :data="skuArr">
            <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
            <el-table-column label="名称" align="center" width="150px" prop="skuName"></el-table-column>
            <el-table-column label="描述" align="center" width="500px" prop="skuDesc"></el-table-column>
            <el-table-column label="图片" align="center" width="250px">
                <template #="{ row }">
                    <img :src="row.skuDefaultImg" style="width:100px;height:100px;">
                </template>
            </el-table-column>
            <el-table-column label="重量" align="center" width="150px" prop="weight"></el-table-column>
            <el-table-column label="价格" align="center" width="150px" prop="price"></el-table-column>
            <el-table-column label="操作" align="center" width="230px" fixed="right">
                <template #="{ row }">
                    <el-button @click="updateSale(row)" :type="row.isSale == 1 ? 'primary' : 'info'"
                        :icon="row.isSale == 1 ? 'Bottom' : 'Top'" size="small" :title="row.isSale == 1 ? '下架' : '上架'">
                    </el-button>
                    <el-button type="primary" icon="Edit" size="small" title="编辑"></el-button>
                    <el-button @click="findSku(row)" type="success" icon="InfoFilled" size="small"
                        title="详情"></el-button>
                    <el-popconfirm :title="`您确定要删除${row.skuName}吗?`" width="230px" icon="Delete"
                        @confirm="removeSku(row.id)">
                        <template #reference>
                            <el-button icon="Delete" title="删除SPU" type="danger" size="small"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[5, 10, 20]"
            :background="true" layout=" prev, pager, next, jumper,->,sizes,total" :total="total"
            @current-change="getHasSku" @size-change="sizeChange" style="margin:20px" />
        <el-drawer v-model="drawer">
            <template #header>
                <h3>商品详情</h3>
            </template>
            <template #default>
                <el-row style="margin:10px 0px">
                    <el-col :span="6">名称</el-col>
                    <el-col :span="18">{{ skuInfo.skuName }}</el-col>
                </el-row>
                <el-row style="margin:10px 0px">
                    <el-col :span="6">描述</el-col>
                    <el-col :span="18">{{ skuInfo.skuDesc }}</el-col>
                </el-row>
                <el-row style="margin:10px 0px">
                    <el-col :span="6">价格</el-col>
                    <el-col :span="18">{{ skuInfo.price }}</el-col>
                </el-row>
                <el-row style="margin:10px 0px">
                    <el-col :span="6">平台属性</el-col>
                    <el-col :span="18" style="margin:-5px ">
                        <el-tag v-for="item in skuInfo.skuAttrValueList" :key="item.Id" style="margin:5px 5px">{{
                            item.valueName }}</el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin:10px 0px">
                    <el-col :span="6">销售属性</el-col>
                    <el-col :span="18" style="margin:-5px ">
                        <el-tag v-for="item in skuInfo.skuSaleAttrValueList" :key="item.Id" style="margin:5px 5px">{{
                            item.
                                saleAttrValueName }}</el-tag>
                    </el-col>
                </el-row>
                <el-row style="margin:10px 0px">
                    <el-col :span="6">商品图片</el-col>
                    <el-col :span="18">
                        <el-carousel :interval="4000" type="card" height="200px">
                            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                                <img :src="item.imgUrl" style="width:100%;height:100%;">
                            </el-carousel-item>
                        </el-carousel>
                    </el-col>
                </el-row>
            </template>
        </el-drawer>
    </el-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { reqSkuList, reqSaleSku, reqCancelSale, reqSkuInfo, reqRemoveSku } from '@/api/product/sku/index';
import { SkuResponseData, SkuData } from '@/api/product/sku/type';
import { ElMessage } from 'element-plus';

//分页器数据
let pageNum = ref<number>(1);
let pageSize = ref<number>(10);
let total = ref<number>(0);
//表格数据
let skuArr = ref<SkuData[]>([]);
//控制抽屉显示与隐藏
let drawer = ref<boolean>(false);
//抽屉中的SKU某一详情数据
let skuInfo = ref<any>({});

//组件挂载完毕
onMounted(() => {
    getHasSku();
})

//获取SKU数据
const getHasSku = async (pager = 1) => {
    pageNum.value = pager
    let result: SkuResponseData = await reqSkuList(pageNum.value, pageSize.value);
    if (result.code == 200) {
        total.value = result.data.total
        skuArr.value = result.data.records
    }
}
//当前分页器的页码显示数目发生变化的时候触发
const sizeChange = () => {
    getHasSku()
}

//商品的上架与下架
const updateSale = async (row: SkuData) => {
    //isSale--1（上架）,isSale--0（下架）
    if (row.isSale == 1) {
        await reqCancelSale((row.id as number))
        ElMessage({
            type: 'success',
            message: '下架成功',
        })
        getHasSku(pageNum.value)
    } else {
        await reqSaleSku((row.id as number))
        ElMessage({
            type: 'success',
            message: '上架成功',
        })
        getHasSku(pageNum.value)
    }
}

//打开抽屉，查看SKU详情
const findSku = async (row: SkuData) => {
    drawer.value = true
    let result: any = await reqSkuInfo((row.id as number))
    skuInfo.value = result.data
}

//删除SKU
const removeSku = async (id: number) => {
    let result: any = await reqRemoveSku(id)
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '删除成功',
        })
        getHasSku()
    } else {
        ElMessage({
            type: 'error',
            message: `${result.data}`,
        })
    }
}
</script>

<style scoped lang="scss">

</style>