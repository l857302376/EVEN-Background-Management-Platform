<template>
  <Category :scene="scene"></Category>
  <el-card style="margin: 10px 0px">
    <div v-show="scene == 0">
      <el-button
        @click="addAttr"
        type="primary"
        icon="Plus"
        :disabled="categoryStore.c3Id ? false : true"
      >
        添加属性
      </el-button>
      <el-table border style="margin: 10px 0px" :data="attrArr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="属性名称"
          align="center"
          width="100px"
          prop="attrName"
        ></el-table-column>
        <el-table-column label="属性值名称" align="center">
          <template #="{ row }">
            <el-tag
              v-for="item in row.attrValueList"
              :key="item.id"
              style="margin: 20px"
            >
              {{ item.valueName }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230px">
          <template #="{ row }">
            <el-button @click="updateAttr(row)" icon="Edit" type="primary">
              编辑
            </el-button>
            <el-popconfirm
              :title="`您确定要删除${row.attrName}属性吗?`"
              width="230px"
              icon="Delete"
              @confirm="deleteAttr(row.id)"
            >
              <template #reference>
                <el-button icon="Delete" type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div v-show="scene == 1">
      <el-form :inline="true">
        <el-form-item label="添加属性名称：">
          <el-input
            placeholder="请输入属性名称"
            v-model="attrParams.attrName"
          ></el-input>
        </el-form-item>
      </el-form>
      <el-button
        @click="addAttrValue"
        icon="Plus"
        type="primary"
        :disabled="attrParams.attrName ? false : true"
      >
        添加属性值
      </el-button>
      <el-table
        border
        style="margin: 10px -3px"
        :data="attrParams.attrValueList"
      >
        <el-table-column
          label="序号"
          width="80px"
          type="index"
          align="center"
        ></el-table-column>
        <el-table-column label="属性值名称" align="center">
          <template #="{ row, $index }">
            <el-input
              :ref="(vc: any) => (inputArr[$index] = vc)"
              @blur="toLook(row, $index)"
              v-if="row.flag"
              placeholder="请输入属性值"
              v-model="row.valueName"
            ></el-input>
            <div @click="toEdit(row, $index)" v-else>{{ row.valueName }}</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230px" align="center">
          <template #="{ $index }">
            <el-button
              type="danger"
              icon="Delete"
              @click="attrParams.attrValueList.splice($index, 1)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="display: flex; justify-content: flex-end">
        <el-button type="danger" @click="cancel">取消</el-button>
        <el-button
          type="primary"
          @click="save"
          :disabled="attrParams.attrValueList.length > 0 ? false : true"
        >
          保存
        </el-button>
      </div>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import useCategoryStore from '@/store/modules/category'
import { reqAttr, reqAddOrUpdateAttr, reqRemoveAttr } from '@/api/product/attr'
import { ref, watch, reactive, nextTick, onBeforeUnmount } from 'vue'
import { AttrResponseData, Attr, AttrValue } from '@/api/product/attr/type'
import { ElMessage } from 'element-plus'

let categoryStore = useCategoryStore()

let attrArr = ref<Attr[]>([])
//定义卡片内容切换,0--显示tabel，1--显示添加修改界面
let scene = ref<number>(0)
//attr的数组
let attrParams = reactive<Attr>({
  attrName: '', //属性名字
  categoryId: '', //所属三级分类id
  categoryLevel: 3, //分类等级3级
  attrValueList: [], //一行属性中属性值数组
})
//储存输入框实例
let inputArr = ref<any>([])

//监控C3ID的变化从而生成table数据
watch(
  () => categoryStore.c3Id,
  async () => {
    //如果发生变化清空之前的查询结果
    attrArr.value = []
    if (!categoryStore.c3Id) return
    let result: AttrResponseData = await reqAttr(
      categoryStore.c1Id,
      categoryStore.c2Id,
      categoryStore.c3Id,
    )
    if (result.code == 200) {
      attrArr.value = result.data
    }
  },
)

//添加attr的回调
const addAttr = () => {
  //点击此按钮清空原表格内容
  Object.assign(attrParams, {
    attrName: '', //属性名字
    categoryId: '', //所属三级分类id
    categoryLevel: 3, //分类等级3级
    attrValueList: [], //一行属性中属性值数组
  })
  scene.value = 1
  //收集此属性的3级分类id
  attrParams.categoryId = categoryStore.c3Id
}
//修改attr的回调
const updateAttr = (row: Attr) => {
  scene.value = 1
  //将需要编辑的属性对象赋值给attrParams对象
  //assign是浅拷贝，原数据和需要修改的数据会指向同一个对象--此方法是把row对象转化为字符串
  Object.assign(attrParams, JSON.stringify(row))
}

//取消添加编辑界面
const cancel = () => {
  scene.value = 0
}

//添加属性值方法,点击添加则多一个对象
const addAttrValue = () => {
  attrParams.attrValueList.push({
    valueName: '',
    flag: true,
  })
  //点击之后聚焦输入框
  nextTick(() => {
    inputArr.value[attrParams.attrValueList.length - 1].focus()
  })
}

//保存添加修改的表格数据
const save = async () => {
  let result: any = await reqAddOrUpdateAttr(attrParams)
  if ((result.code = 200)) {
    scene.value = 0
    ElMessage({
      type: 'success',
      message: attrParams.id ? '修改成功' : '添加成功',
    })
    let result1 = await reqAttr(
      categoryStore.c1Id,
      categoryStore.c2Id,
      categoryStore.c3Id,
    )
    if (result1.code == 200) {
      attrArr.value = result1.data
    }
  } else {
    ElMessage({
      type: 'error',
      message: attrParams.id ? '修改失败' : '添加失败',
    })
  }
}

//添加属性编辑和查看场景的切换
const toLook = (row: AttrValue, $index: number) => {
  //如果输入值为空，则不会变成查看模式
  if (row.valueName.trim() == '') {
    //删除属性值为空的元素
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  let repeat = attrParams.attrValueList.find((item) => {
    if (item != row) {
      return item.valueName === row.valueName
    }
  })
  //属性值不能重复，否则删除
  if (repeat) {
    attrParams.attrValueList.splice($index, 1)
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  row.flag = false
}
const toEdit = (row: AttrValue, $index: number) => {
  row.flag = true
  //属性值输入框聚焦，:ref函数，当输入框状态发生变化时触发
  nextTick(() => {
    inputArr.value[$index].focus()
  })
}

//删除属性方法
const deleteAttr = async (attrId: number) => {
  let result: any = await reqRemoveAttr(attrId)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: '删除成功',
    })
    //重新获取attr数据
    let result1 = await reqAttr(
      categoryStore.c1Id,
      categoryStore.c2Id,
      categoryStore.c3Id,
    )
    if (result1.code == 200) {
      attrArr.value = result1.data
    }
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
