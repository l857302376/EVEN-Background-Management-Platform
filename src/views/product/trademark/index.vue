<template>
    <el-card style="width: 100%;">
        <el-button type="primary" size="default" icon="Plus" @click="addTrademark">添加品牌</el-button>
        <el-table style="width: 100%; margin:20px 0px;" border :data="trademarkArr">
            <el-table-column label="序号" width="80" align="center" type="index" />
            <el-table-column prop="tmName" label="品牌名称" align="center" />
            <el-table-column label="LOGO" align="center">
                <template #="{ row }">
                    <img :src="row.logoUrl" style="width:100px; height:100px;">
                </template>
            </el-table-column>
            <el-table-column label="操作" align="center" width="230">
                <template #="{ row }">
                    <el-button @click=" updateTrademark(row)" icon="Edit" type="primary">编辑</el-button>
                    <el-popconfirm :title="`您确定要删除${row.tmName}品牌吗?`" width="230px" icon="Delete"
                        @confirm="removeTradeMark(row.id)">
                        <template #reference>
                            <el-button icon="Delete" type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <!--  @current-change分页器当前页码发生变化时触发,获取品牌数据 
        组件pagination通过事件@current-change回传了：当前页码  -->
        <el-pagination @size-change="sizeChange" @current-change="getHasTrademark" v-model:current-page="pageNum"
            v-model:page-size="pageSize" :page-sizes="[3, 6, 10]" :background="true"
            layout=" prev, pager, next, jumper,->,sizes,total" :total="total" />
    </el-card>
    <!-- 对话框 -- 用于修改，添加品牌-->
    <el-dialog v-model="dialogFormVisible" :title="trademarkParams.id ? '修改品牌' : '添加品牌'" width="500">
        <el-form style="margin: 20px; width:80%;" label-position="top" :model="trademarkParams" :rules="rules"
            ref="formRef">
            <el-form-item label="品牌名称:" prop="tmName">
                <el-input placeholder="请输入品牌名称" v-model="trademarkParams.tmName"></el-input>
            </el-form-item>
            <!-- action--图片上传的路径，需要携带/api 
                 before-upload--上传图片之前的钩子，用来限制上传的文件类型和大小-->
            <el-form-item label="品牌LOGO:" prop="logoUrl">
                <el-upload class="avatar-uploader" action="/api/admin/product/fileUpload" :show-file-list="false"
                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
                    <img v-if="trademarkParams.logoUrl" :src="trademarkParams.logoUrl" class="avatar" />
                    <el-icon v-else class="avatar-uploader-icon">
                        <Plus />
                    </el-icon>
                </el-upload>
            </el-form-item>

        </el-form>
        <template #footer>
            <el-button @click="cancelDialog">取消</el-button>
            <el-button @click="confirmDialog" type="primary">确认</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { reqHasTrademark, reqAddOrUpdateTrademark, reqDeleteTrademark } from '@/api/product/trademark'
import type { Records, TradeMarkResponseData, TradeMark } from "@/api/product/trademark/type"
import { ElMessage, type UploadProps } from 'element-plus'

//当前页面，默认为1
let pageNum = ref<number>(1)
//每页展示多少条数据
let pageSize = ref<number>(3);
//存储已有品牌数据总数
let total = ref<number>(0);
//存储已有品牌的数据
let trademarkArr = ref<Records>([]);
//控制对话框显示与隐藏
let dialogFormVisible = ref<boolean>(false);
//定义新增品牌的数据
let trademarkParams = ref<TradeMark>({
    id: undefined,
    logoUrl: '',
    tmName: ''
})
//获取el-form组件实例
let formRef = ref();

//获取已有品牌的接口封装为一个函数:在任何情况下向获取数据,调用此函数即可
const getHasTrademark = async () => {
    let result: TradeMarkResponseData = await reqHasTrademark(pageNum.value, pageSize.value)
    if (result.code == 200) {
        //存储已有品牌总个数
        total.value = result.data.total
        trademarkArr.value = result.data.records
    }
}

//组件挂载完毕钩子---发一次请求,获取第一页、一页三个已有品牌数据
onMounted(() => {
    getHasTrademark()
})

//当分页器pageSize下拉菜单发生变化时，触发
const sizeChange = () => {
    //页面归1
    pageNum.value = 1
    getHasTrademark()
}

//添加品牌
const addTrademark = () => {
    dialogFormVisible.value = true;
    //清除对话框中数据
    trademarkParams.value.id = undefined;
    trademarkParams.value.tmName = '';
    trademarkParams.value.logoUrl = '';
    //每次打开对话框清除校验提示信息
    formRef.value?.clearValidate('tmName');
    formRef.value?.clearValidate('logoUrl');
}

//编辑品牌
//row为当前已有的品牌
const updateTrademark = (row: TradeMark) => {
    dialogFormVisible.value = true;
    // Object.assign(trademarkParams,row);
    trademarkParams.value.id = row.id;
    trademarkParams.value.tmName = row.tmName;
    trademarkParams.value.logoUrl = row.logoUrl;
    //每次打开对话框清除校验提示信息
    formRef.value?.clearValidate('tmName');
    formRef.value?.clearValidate('logoUrl');
}

//删除品牌
const removeTradeMark = async (id: number) => {
    let result = await reqDeleteTrademark(id);
    if (result.code == 200) {
        ElMessage({
            type: 'success',
            message: '品牌删除成功'
        });
        getHasTrademark();
    } else {
        ElMessage({
            type: 'error',
            message: '品牌删除失败'
        })
    }
}

//取消对话框
const cancelDialog = () => {
    dialogFormVisible.value = false;
    trademarkParams.value.tmName = '';
    trademarkParams.value.logoUrl = '';
}
//确认对话框
const confirmDialog = async () => {
    //发请求前对整个表单进行校验
    //调用自带的validate()方法，如果全部通过返回true,用await等待成功的结果
    await formRef.value.validate();

    let result: any = await reqAddOrUpdateTrademark(trademarkParams.value);
    if (result.code == 200) {
        dialogFormVisible.value = false;
        ElMessage({
            type: 'success',
            message: trademarkParams.value.id ? '品牌修改成功' : '品牌添加成功'
        })
        //再次发请求获取所有品牌数据，保证下次添加成功
        getHasTrademark();
    } else {
        ElMessage({
            type: 'error',
            message: trademarkParams.value.id ? '品牌修改失败' : '品牌添加失败'
        })
        dialogFormVisible.value = false;
    }
}

//图片上传前的钩子
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
    if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png' && rawFile.type !== 'image/gif') {
        ElMessage({
            type: 'error',
            message: '上传文件须为PNG|JPG|GIF'
        })
        return false
    } else if (rawFile.size / 1024 / 1024 > 1) {
        ElMessage({
            type: 'error',
            message: '上传文件大小需小于1M'
        })
        return false
    }
    return true
}
//图片上传成功后的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = (response) => {
    //收集图片地址
    trademarkParams.value.logoUrl = response.data;
    //清除请求校验提示
    formRef.value.clearValidate('logoUrl');
}

//表单校验方法
const validatorTmName = (_: any, value: any, callback: any) => {
    if (value.trim().length >= 2) {
        callback();
    } else {
        callback(new Error('品牌名称需不少于2位'))
    }
}
const validatorLogoUrl = (_: any, value: any, callback: any) => {
    if (value) {
        callback();
    } else {
        callback(new Error('请上传logo图片'))
    }
}
//表单校验规则
const rules = {
    tmName: [
        { required: true, trigger: 'blur', validator: validatorTmName }
    ],
    logoUrl: [
        { required: true, validator: validatorLogoUrl }
    ]
}

</script>


<style scoped>
.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
    border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>