<template>
    <el-table :data="permissionArr" style="width: 100%; margin-bottom: 20px" row-key="id" border>
        <el-table-column label="名称" prop="name" />
        <el-table-column label="权限值" prop="code" />
        <el-table-column label="修改时间" prop="name" updateTime />
        <el-table-column align="center">
            <template #="{ row }">
                <el-button @click="addPermission(row)" type="success" size="small"
                    v-show="row.level == 4 ? false : true" icon="Plus">
                    {{ row.level == 3 ? '添加按钮' : '添加菜单' }}</el-button>
                <el-button @click="updatePermission(row)" type="primary" size="small"
                    v-show="row.level == 1 ? false : true" icon="Edit">编辑</el-button>
                <el-popconfirm :title="`您确定要删除${row.name}吗?`" width="230px" icon="Delete" @confirm="removeMenu(row.id)">
                    <template #reference>
                        <el-button type="danger" size="small" v-show="row.level == 1 ? false : true"
                            icon="Delete">删除</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>
    </el-table>
    <!-- 添加|修改菜单 -->
    <el-dialog v-model="dialogVisible" :title="menuData.id ? '编辑菜单' : '添加菜单'">
        <el-form>
            <el-form-item label="菜单名称" prop="roleName" label-width="80px">
                <el-input v-model="menuData.name" placeholder="请输入菜单名称"></el-input>
            </el-form-item>
            <el-form-item label="权限值" prop="roleName" label-width="80px">
                <el-input v-model="menuData.code" placeholder="请输入权限值"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="save" type="primary">确定</el-button>
            <el-button @click="dialogVisible = false" type="danger">取消</el-button>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">
import { reqAddOrUpdateMenu, reqAllPermission, reqRemoveMenu } from '@/api/acl/menu';
import type { PermissionResponseData, PermissonList, Permssion, MunuParams } from '@/api/acl/menu/type';
import { ElMessage } from 'element-plus';
import { onMounted, reactive, ref } from 'vue';


//储存菜单数据的数组
let permissionArr = ref<PermissonList>([])
//对话框的显示
let dialogVisible = ref(false)
//添加|修改菜单的数组
let menuData = reactive<MunuParams>({
    code: '',
    level: 0,
    name: '',
    pid: 0,
})

//组件挂载时获取菜单数据
onMounted(() => {
    getHasPermission()
})

//获取菜单数据的函数
const getHasPermission = async () => {
    let result: PermissionResponseData = await reqAllPermission();
    if (result.code == 200) {
        permissionArr.value = result.data;
    }
}

//添加菜单
const addPermission = (row: Permssion) => {
    Object.assign(menuData, {
        id: 0,
        code: '',
        level: 0,
        name: '',
        pid: 0,
    })
    dialogVisible.value = true
    //新增菜单level需要加1
    menuData.level = row.level + 1;
    menuData.pid = (row.id as number);
}
//修改菜单
const updatePermission = (row: Permssion) => {
    dialogVisible.value = true;
    Object.assign(menuData, row)
}

//对话框确认按钮
const save = async () => {
    let result: any = await reqAddOrUpdateMenu(menuData);
    if (result.code == 200) {
        dialogVisible.value = false;
        ElMessage({ type: 'success', message: menuData.id ? '更新成功' : '添加成功' });
        getHasPermission();
    } else {
        ElMessage({ type: 'error', message: result.data });
        dialogVisible.value = false;
    }
}

//删除菜单按钮
const removeMenu = async (id: number) => {
    let result: any = await reqRemoveMenu(id)
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' });
        getHasPermission();
    }
}
</script>

<style scoped lang="scss"></style>