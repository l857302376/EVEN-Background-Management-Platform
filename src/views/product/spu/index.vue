<template>
  <Category></Category>
  <el-card style="margin: 20px 0px">
    <!-- v-show不会销毁组件，但v-if会销毁重建 -->
    <div v-show="scene == 0">
      <el-button @click="addSpu" type="primary" icon="Plus" :disabled="categoryStore.c3Id ? false : true">
        添加SPU
      </el-button>
      <el-table style="margin: 10px 0px" border :data="recordes">
        <el-table-column label="序号" type="index" align="center" width="80px"></el-table-column>
        <el-table-column label="SPU名称" align="center" prop="spuName"></el-table-column>
        <el-table-column label="SPU描述" align="center" prop="description"></el-table-column>
        <el-table-column label="操作" align="center">
          <template #="{ row }">
            <el-button @click="addSku(row)" icon="Plus" title="添加SKU" type="success" size="small"></el-button>
            <el-button @click="updateSpu(row)" icon="Edit" title="修改SPU" type="warning" size="small"></el-button>
            <el-button @click="findSku(row)" icon="View" title="查看SKU列表" type="primary" size="small"></el-button>
            <el-popconfirm :title="`您确定要删除${row.spuName}吗?`" width="230px" icon="Delete" @confirm="deleteSpu(row)">
              <template #reference>
                <el-button icon="Delete" title="删除SPU" type="danger" size="small"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[3, 6, 10]"
        :background="true" layout=" prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getSpu"
        @size-change="sizeChange" />
    </div>
    <SpuForm ref="spuFormRef" v-show="scene == 1" @changeScene="changeScene"></SpuForm>
    <SkuForm ref="skuFormRef" v-show="scene == 2" @changeScene="changeScene"></SkuForm>
    <el-dialog v-model="show" title="SKU列表">
      <el-table border :data="skuArr">
        <el-table-column label="SKU名字" prop="skuName" align="center" width="80px"></el-table-column>
        <el-table-column label="SKU价格" prop="price" align="center" width="80px"></el-table-column>
        <el-table-column label="SKU重量" prop="weight" align="center" width="80px"></el-table-column>
        <el-table-column label="SKU图片" prop="skuName" align="center">
          <template #="{ row }">
            <img :src="row.skuDefaultImg" style="width: 200px; height: 200px" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </el-card>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import useCategoryStore from '@/store/modules/category'
import { reqHasSpu, reqSkuList, reqRemoveSpu } from '@/api/product/spu'
import type {
  HasSpuResponseData,
  Records,
  SkuData,
} from '@/api/product/spu/type'
import SkuForm from './skuForm.vue'
import SpuForm from './spuForm.vue'
import type { SpuData } from '@/api/product/spu/type'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()

let pageNum = ref<number>(1)
let pageSize = ref<number>(3)
let recordes = ref<Records>([])
let total = ref<number>(0)
//场景数据，0--展示spu,1--添加修改spu,2--添加sku
let scene = ref(0)
//获取子组件spuForm实例
let spuFormRef = ref<any>()
let skuFormRef = ref<any>()
//存储SKU数据
let skuArr = ref<SkuData[]>([])
//控制对话框隐藏
let show = ref<boolean>(false)

//监听3级分类id的变化，从而获得数据
watch(
  () => categoryStore.c3Id,
  () => {
    if (!categoryStore.c3Id) return
    getSpu()
  },
)

//获取3级分类id对应的的SPU数据
const getSpu = async (pager = 1) => {
  pageNum.value = pager
  let result: HasSpuResponseData = await reqHasSpu(
    pageNum.value,
    pageSize.value,
    categoryStore.c3Id,
  )
  if (result.code == 200) {
    recordes.value = result.data.records
    total.value = result.data.total
  }
}

//分页器下拉菜单发生变化时的回调函数
const sizeChange = () => {
  getSpu()
}

//添加spu按钮的函数
const addSpu = () => {
  scene.value = 1
  spuFormRef.value.initAddSpu(categoryStore.c3Id)
}
//编辑spu按钮的函数
const updateSpu = (row: SpuData) => {
  scene.value = 1
  //调用子组件spuFrom的方法
  spuFormRef.value.initHasSpuData(row)
}

//子组件SpuForm绑定的自定义事件，用于切换场景
const changeScene = (obj: any) => {
  scene.value = obj.flag
  //再次获得表格数据,修改--留在当前页，添加--留在第一页
  if (obj.params == 'update') {
    getSpu(pageNum.value)
  } else {
    getSpu()
  }
}

//添加sku
const addSku = (row: SpuData) => {
  scene.value = 2
  skuFormRef.value.initSkuData(categoryStore.c1Id, categoryStore.c2Id, row)
}

//查看sku列表数据
const findSku = async (row: SpuData) => {
  let result = await reqSkuList(row.id as number)
  //存储数据
  if (result.code == 200) {
    skuArr.value = result.data
    show.value = true
  }
}

//删除SPU
const deleteSpu = async (row: SpuData) => {
  let result: any = await reqRemoveSpu(row.id as number)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    getSpu()
  } else {
    ElMessage({
      type: 'error',
      message: '删除失败',
    })
  }
}

//当跳转至其他路由时清除store里的数据
onBeforeUnmount(() => {
  //$reset用不了
  // categoryStore.$reset();
  categoryStore.c1Id = ''
  categoryStore.c2Id = ''
  categoryStore.c3Id = ''
  categoryStore.c1Arr = []
  categoryStore.c2Arr = []
  categoryStore.c3Arr = []
})
</script>

<style scoped lang="scss"></style>
