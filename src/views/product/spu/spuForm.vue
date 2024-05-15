<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称:">
      <el-input
        v-model="SpuParams.spuName"
        placeholder="请输入SPU名称"
        style="width: 220px"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU品牌:">
      <el-select style="width: 220px" v-model="SpuParams.tmId">
        <el-option
          v-for="item in AllTradeMark"
          :key="item.id"
          :label="item.tmName"
          :value="item.id"
        ></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="SPU描述:">
      <el-input
        v-model="SpuParams.description"
        type="textarea"
        placeholder="请输入SPU描述"
      ></el-input>
    </el-form-item>
    <el-form-item label="SPU图标:">
      <el-upload
        v-model:file-list="imgList"
        action="/api/admin/product/fileUpload"
        list-type="picture-card"
        :on-preview="handlePictureCardPreview"
        :before-upload="handlerUpload"
      >
        <el-icon>
          <Plus />
        </el-icon>
      </el-upload>
      <el-dialog v-model="dialogVisible">
        <img
          w-full
          :src="dialogImageUrl"
          alt="Preview Image"
          style="width: 100%; height: 100%"
        />
      </el-dialog>
    </el-form-item>
    <el-form-item label="SPU销售属性:">
      <el-select
        style="width: 220px"
        v-model="saleAttrIdAndValueName"
        :placeholder="
          unSelectSaleAttr.length
            ? `还需选择${unSelectSaleAttr.length}个销售属性`
            : '无可选择的销售属性'
        "
      >
        <el-option
          v-for="item in unSelectSaleAttr"
          :key="item.id"
          :label="item.name"
          :value="`${item.id}:${item.name}`"
        ></el-option>
      </el-select>
      <el-button
        type="primary"
        icon="Plus"
        style="margin: 0px 20px"
        @click="addSaleAttr"
        :disabled="saleAttrIdAndValueName ? false : true"
      >
        添加销售属性
      </el-button>
    </el-form-item>
    <el-form-item>
      <el-table border :data="saleAttr">
        <el-table-column
          label="序号"
          type="index"
          align="center"
          width="80px"
        ></el-table-column>
        <el-table-column
          label="属性名"
          align="center"
          width="120px"
          prop="saleAttrName"
        ></el-table-column>
        <el-table-column label="销售属性值" align="center">
          <template #="{ row }">
            <el-tag
              v-for="(item, index) in row.spuSaleAttrValueList"
              :key="row.id"
              closable
              style="margin: 0px 10px"
              @close="row.spuSaleAttrValueList.splice(index, 1)"
            >
              {{ item.saleAttrValueName }}
            </el-tag>
            <el-input
              @change="toLook(row)"
              v-model="row.saleAttrValue"
              v-if="row.flag == true"
              placeholder="请输入属性值"
              size="small"
              style="width: 100px"
            ></el-input>
            <el-button
              @click="toEdit(row)"
              v-else
              type="primary"
              size="small"
              icon="Plus"
              style="margin: 0px 10px"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="120px">
          <template #="{ $index }">
            <el-button
              @click="saleAttr.splice($index, 1)"
              type="danger"
              size="small"
              icon="Delete"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
    <div style="display: flex; justify-content: flex-end">
      <el-button @click="cancel" type="danger">取消</el-button>
      <el-button
        :disabled="saleAttr.length > 0 ? false : true"
        @click="save"
        type="primary"
      >
        保存
      </el-button>
    </div>
  </el-form>
</template>

<script setup lang="ts">
import type {
  SaleAttrValue,
  SpuData,
  AllTrademark,
  SpuHasImg,
  SaleAttrResponseData,
  HasSaleAttrResponseData,
  Trademark,
  SpuImg,
  SaleAttr,
  HasSaleAttr,
} from '@/api/product/spu/type'
import {
  reqAddOrUpdateSpu,
  reqAllTrademark,
  reqSpuIamgeList,
  reqSpuHasSaleAttr,
  reqAllSaleAttr,
} from '@/api/product/spu'
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

let $emit = defineEmits(['changeScene'])

//储存spu数据
let AllTradeMark = ref<Trademark[]>([])
let imgList = ref<SpuImg[]>([])
let saleAttr = ref<SaleAttr[]>([])
let allSaleAttr = ref<HasSaleAttr[]>([])
let SpuParams = ref<any>({
  category3Id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuSaleAttrList: [],
  spuImageList: [],
})
//控制显示图片对话框显示与隐藏
let dialogVisible = ref<boolean>(false)
//存储展示图片的url
let dialogImageUrl = ref('')
//收集还未选择的销售属性id与属性名
let saleAttrIdAndValueName = ref<string>('')

//取消按钮，通知父组件切换场景
const cancel = () => {
  $emit('changeScene', { flag: 0, params: 'update' })
}

const initHasSpuData = async (spu: SpuData) => {
  //父组件传过来的spu对象
  SpuParams.value = spu
  //获取全部品牌的数据
  let result: AllTrademark = await reqAllTrademark()
  //获取某一个spu下所有图片的数据
  let result1: SpuHasImg = await reqSpuIamgeList(spu.id as number)
  //获取销售属性值的数据
  let result2: SaleAttrResponseData = await reqSpuHasSaleAttr(spu.id as number)
  //获取所有销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  //储存数据
  AllTradeMark.value = result.data
  //file-list中的文件只能读取指定类型的数据，所以改变数据命名
  imgList.value = result1.data.map((item) => {
    return {
      name: item.imgName,
      url: item.imgUrl,
    }
  })
  saleAttr.value = result2.data
  allSaleAttr.value = result3.data
}

//展示图片中点击图片展示的钩子
const handlePictureCardPreview = (file: any) => {
  dialogImageUrl = file.url
  dialogVisible.value = true
}

//上传成功之前的钩子，约束文件类型和大小
const handlerUpload = (file: any) => {
  if (file.size / 1024 / 1024 > 3) {
    ElMessage({
      type: 'error',
      message: '上传图片需小于3M',
    })
    return false
  } else {
    ElMessage({
      type: 'success',
      message: '上传成功',
    })
    return true
  }
}

//计算spu目前还未拥有的销售属性
let unSelectSaleAttr = computed(() => {
  //全部销售属性：颜色，版本，尺码
  let unSelectArr = allSaleAttr.value.filter((item) => {
    return saleAttr.value.every((item1) => {
      return item.name != item1.saleAttrName
    })
  })
  return unSelectArr
})

//添加销售属性
const addSaleAttr = () => {
  const [baseSaleAttrId, saleAttrName] = saleAttrIdAndValueName.value.split(':')
  let newSaleAttr: SaleAttr = {
    baseSaleAttrId,
    saleAttrName,
    spuSaleAttrValueList: [],
  }
  saleAttr.value.push(newSaleAttr)
  //添加完后清空
  saleAttrIdAndValueName.value = ''
}

//属性值添加按钮的点击事件
const toEdit = (row: SaleAttr) => {
  row.flag = true
  row.saleAttrValue = ''
}
//属性值表单输入框，失去焦点时切换成查看模式
const toLook = (row: SaleAttr) => {
  //收集属性值的id和名字
  const { baseSaleAttrId, saleAttrValue } = row
  let newSaleAttrValue: SaleAttrValue = {
    baseSaleAttrId,
    saleAttrValueName: saleAttrValue as string,
  }
  //判断属性值是否为空
  if (saleAttrValue?.trim() == '') {
    ElMessage({
      type: 'error',
      message: '属性值不能为空',
    })
    return
  }
  //判断属性值是否重复
  let repeat = row.spuSaleAttrValueList.find((item) => {
    return item.saleAttrValueName == saleAttrValue
  })
  if (repeat) {
    ElMessage({
      type: 'error',
      message: '属性值不能重复',
    })
    return
  }
  row.spuSaleAttrValueList.push(newSaleAttrValue)
  row.flag = false
}

//保存属性值方法
const save = async () => {
  //整理参数，变成上传要求的格式
  //1.照片墙数据
  SpuParams.value.spuImageList = imgList.value.map((item: any) => {
    return {
      imgName: item.name,
      imgUrl: (item.response && item.response.data) || item.url,
    }
  })
  //2.销售属性的数据
  SpuParams.value.spuSaleAttrList = saleAttr.value
  let result = await reqAddOrUpdateSpu(SpuParams.value)
  if (result.code == 200) {
    ElMessage({
      type: 'success',
      message: SpuParams.value.id ? '修改成功' : '添加成功',
    })
    //切换场景
    $emit('changeScene', {
      flag: 0,
      params: SpuParams.value.id ? 'update' : 'add',
    })
  } else {
    ElMessage({
      type: 'error',
      message: SpuParams.value.id ? '修改失败' : '添加失败',
    })
  }
}

const initAddSpu = async (c3Id: number | string) => {
  //清空之前数据
  Object.assign(SpuParams.value, {
    category3Id: '',
    spuName: '',
    description: '',
    tmId: '',
    spuSaleAttrList: [],
    spuImageList: [],
  })
  imgList.value = []
  saleAttr.value = []
  saleAttrIdAndValueName.value = ''
  //存储c3ID
  SpuParams.value.category3Id = c3Id
  //获取全部品牌的数据
  let result: AllTrademark = await reqAllTrademark()
  //获取所有销售属性
  let result3: HasSaleAttrResponseData = await reqAllSaleAttr()
  //存储数据
  AllTradeMark.value = result.data
  allSaleAttr.value = result3.data
}
//对外暴露
defineExpose({
  initHasSpuData,
  initAddSpu,
})
</script>

<style scoped lang="scss"></style>
