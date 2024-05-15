<template>
    <el-card style="height:80px">
        <el-form inline style="display: flex; justify-content: space-between;">
            <el-form-item label="职位搜索">
                <el-input v-model="keyword" placeholder="请输入职位"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="search" type="primary" :disabled="keyword ? false : true">搜索</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin-top:10px">
        <el-button @click="addRole" type="primary" icon="Plus">添加职位</el-button>
        <el-table style="margin-top:10px" border :data="allRole">
            <el-table-column type="index" align="center" label="#"></el-table-column>
            <el-table-column align="center" label="id" width="80px" prop="id"></el-table-column>
            <el-table-column align="center" label="职位名称" prop="roleName"></el-table-column>
            <el-table-column align="center" label="创建时间" prop="createTime"></el-table-column>
            <el-table-column align="center" label="更新时间" prop="updateTime"></el-table-column>
            <el-table-column align="center" label="操作" width="260px">
                <template #="{ row }">
                    <el-tooltip effect="light" content="分配权限" placement="bottom" :enterable="false" :hide-after="0"
                        :show-arrow="false" :offset="5">
                        <el-button @click="setPermission(row)" type="success" icon="User" size="small"></el-button>
                    </el-tooltip>
                    <el-tooltip effect="light" content="编辑职位" placement="bottom" :enterable="false" :hide-after="0"
                        :show-arrow="false" :offset="5">
                        <el-button @click="updateRole(row)" type="primary" icon="Edit" size="small"></el-button>
                    </el-tooltip>
                    <el-popconfirm :title="`您确定要删除${row.roleName}吗?`" width="230px" icon="Delete"
                        @confirm="removeRole(row.id)">
                        <template #reference>
                            <el-button icon="Delete" type="danger" size="small" title="删除"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[5, 7, 10]" background
            layout=" prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasRole"
            @size-change="sizeChange" style="margin:20px" />
    </el-card>
    <!-- 添加|修改职位 -->
    <el-dialog v-model="dialogVisible" :title="roleParams.id ? '修改职位' : '添加职位'">
        <el-form :model="roleParams" :rules="rules" ref="formRef">
            <el-form-item label="职位名称" prop="roleName">
                <el-input v-model="roleParams.roleName" placeholder="请输入职位名称"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="save" type="primary">确定</el-button>
            <el-button @click="dialogVisible = false" type="danger">取消</el-button>
        </template>
    </el-dialog>
    <!-- 分配权限抽屉 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>分配权限</h4>
        </template>
        <el-tree ref="treeRef" :data="menuArr" node-key="id" :props="defaultProps" :default-checked-keys="selectArr"
            show-checkbox />
        <template #footer>
            <el-button @click="saveDrawer" type="primary" title="确认">确认</el-button>
            <el-button @click="drawer = false" type="danger" title="取消">取消</el-button>
        </template>
    </el-drawer>
</template>


<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { reqAllRoleList, reqAddOrUpdateRole, reqAllMenuList, reqSetPermission, reqRemoveRole } from '@/api/acl/role';
import type { RoleResponseData, Records, RoleData, MenuResponseData, MenuList } from '@/api/acl/role/type';
import useLayoutSettingStore from '@/store/modules/setting';
import { ElMessage } from 'element-plus';

//仓库对象
let settingstore = useLayoutSettingStore();
//分页器参数
let pageNum = ref<number>(1)
let pageSize = ref<number>(5)
let total = ref<number>(0)
//搜索框
let keyword = ref<string>('')
//全部职位
let allRole = ref<Records>([])
//对话框显示与隐藏
let dialogVisible = ref<boolean>(false)
//新增职位的数据
let roleParams = reactive<RoleData>({
    roleName: '',
})
//对话框form对象的ref
let formRef = ref()
//控制抽屉的隐藏和显示
let drawer = ref(false)
//存储用户权限数据
let menuArr = ref<MenuList>([])
//储存菜树形框勾选状态bool(4级)
let selectArr = ref<number[]>([])
//树形组件的ref
let treeRef = ref()

//组件挂载时获取数据
onMounted(() => {
    getHasRole();
})

//获取全部职位
const getHasRole = async (pager = 1) => {
    pageNum.value = pager
    let result: RoleResponseData = await reqAllRoleList(pageNum.value, pageSize.value, keyword.value)
    if (result.code == 200) {
        total.value = result.data.total;
        allRole.value = result.data.records;
    }
}

//分页器每页显示变化时触发
const sizeChange = () => {
    getHasRole()
}

//搜索按钮
const search = () => {
    getHasRole();
    keyword.value = '';
}
//重置按钮
const reset = () => {
    settingstore.refsh = !settingstore.refsh
}

//添加职位
const addRole = () => {
    dialogVisible.value = true;
    Object.assign(roleParams, { roleName: '', id: 0 })
    nextTick(() => {
        formRef.value.clearValidate('roleName');
    })
}
//修改职位
const updateRole = async (row: RoleData) => {
    dialogVisible.value = true;
    Object.assign(roleParams, row)
    formRef.value.clearValidate('roleName')
}
//rolename校验规则
const validatorRoleName = (_: any, value: any, callback: any) => {
    if (value.trim().length >= 3) {
        callback()
    } else {
        callback(new Error('职位名称至少两位'))
    }
}
//添加职位表单校验
const rules = {
    roleName: [{ required: true, trigger: 'blur', validator: validatorRoleName }],
}

//保存新增职位
const save = async () => {
    await formRef.value.validate();
    let result: any = await reqAddOrUpdateRole(roleParams)
    if (result.code == 200) {
        ElMessage({ type: 'success', message: roleParams.id ? '更新成功' : '添加成功' });
        getHasRole(roleParams.id ? pageNum.value : 1);
        dialogVisible.value = false;
    }
}

//树形控件展示数据
const defaultProps = {
    children: 'children',
    label: 'name',
}

//分配权限按钮
const setPermission = async (row: RoleData) => {
    drawer.value = true;
    Object.assign(roleParams, row);
    let result: MenuResponseData = await reqAllMenuList((roleParams.id as number));
    if (result.code == 200) {
        menuArr.value = result.data;
        //筛选4级菜单
        selectArr.value = filterSelectArr(menuArr.value, []);
    }
}

//筛选4级菜单
const filterSelectArr = (allData: any, initArr: any) => {
    allData.forEach((item: any) => {
        //item.select代表数据是否被勾选
        if (item.select && item.level == 4) {
            initArr.push(item.id);
        }
        if (item.children && item.children.length > 0) {
            filterSelectArr(item.children, initArr)
        }
    });
    return initArr;
}

//保存分配权限的抽屉
const saveDrawer = async () => {
    //职位ID
    const rollId = (roleParams.id as number)
    //全选中节点的ID
    let arr = treeRef.value.getCheckedKeys();
    //半选ID
    let arr1 = treeRef.value.getHalfCheckedKeys();
    let permissionId = arr.concat(arr1)
    let result: any = await reqSetPermission(rollId, permissionId)
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '分配权限成功' });
        drawer.value = false;
        window.location.reload();
    }
}

//删除职位
const removeRole = async (id: number) => {
    let result: any = await reqRemoveRole(id);
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' });
        getHasRole(allRole.value.length > 1 ? pageNum.value : pageNum.value - 1)
    }
}
</script>

<style scoped lang="scss"></style>