<template>
    <el-card style="height: 80px;">
        <el-form inline class="form-justify">
            <el-form-item label="用户名">
                <el-input placeholder="请输入搜索用户名" v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="search" type="primary" :disabled="keyword ? false : true">搜索</el-button>
                <el-button @click="reset" type="primary">重置</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card style="margin: 10px 0px;">
        <el-button type="primary" @click="addUser">添加用户</el-button>
        <el-button type="danger" :disabled="selectIdArr.length ? false : true"
            @click="deleteSelectUser">批量删除</el-button>
        <el-table style="margin: 10px 0px;" border :data="userArr" @selection-change="selectChange">
            <el-table-column type="selection" align="center"></el-table-column>
            <el-table-column label="#" align="center" type="index"></el-table-column>
            <el-table-column label="ID" align="center" prop="id" width="80px"></el-table-column>
            <el-table-column label="账号" align="center" prop="username"></el-table-column>
            <el-table-column label="用户名称" align="center" prop="name"></el-table-column>
            <el-table-column label="用户角色" align="center" prop="roleName"></el-table-column>
            <el-table-column label="创建时间" align="center" prop="createTime"></el-table-column>
            <el-table-column label="更新时间" align="center" prop="updateTime"></el-table-column>
            <el-table-column label="操作" align="center" width="160px">
                <template #="{ row }">
                    <el-tooltip effect="light" content="角色分配" placement="bottom" :enterable="false" :hide-after="0" 
                        :show-arrow="false" :offset="5" >
                        <el-button @click="setRole(row)" type="success" icon="User" size="small"></el-button>
                    </el-tooltip>
                    <!-- <el-button @click="setRole(row)" type="success" icon="User" size="small" title="角色分配"></el-button> -->
                    <el-button @click="updateUser(row)" type="primary" icon="Edit" size="small" title="编辑"></el-button>
                    <el-popconfirm :title="`您确定要删除${row.username}吗?`" width="230px" icon="Delete"
                        @confirm="deleteUser(row.id)">
                        <template #reference>
                            <el-button icon="Delete" title="删除用户" type="danger" size="small"></el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination v-model:current-page="pageNum" v-model:page-size="pageSize" :page-sizes="[5, 7, 9]" background
            layout=" prev, pager, next, jumper,->,sizes,total" :total="total" @current-change="getHasUser"
            @size-change="sizeChange" style="margin:20px" />
    </el-card>
    <!-- 添加|修改账号信息 -->
    <el-drawer v-model="drawer">
        <template #header>
            <h4>{{ userParams.id ? '编辑用户' : '添加用户' }}</h4>
        </template>
        <el-form :model="userParams" :rules="rules" ref="formRef">
            <el-form-item label="用户账号" prop="username">
                <el-input placeholder="请输入用户账号" v-model="userParams.username"></el-input>
            </el-form-item>
            <el-form-item label="用户名称" prop="name">
                <el-input placeholder="请输入用户名称" v-model="userParams.name"></el-input>
            </el-form-item>
            <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
                <el-input placeholder="请输入用户密码" v-model="userParams.password"></el-input>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="save" type="primary" title="确认">确认</el-button>
            <el-button @click="cancel" type="danger" title="取消">取消</el-button>
        </template>
    </el-drawer>
    <!-- 角色分配 -->
    <el-drawer v-model="drawer1">
        <template #header>
            <h4>角色分配</h4>
        </template>
        <el-form>
            <el-form-item label="用户账号">
                <el-input v-model="userParams.username" disabled></el-input>
            </el-form-item>
            <el-form-item label="职位列表">
                <el-checkbox v-model="checkAll" :indeterminate="isIndeterminate"
                    @change="handleCheckAllChange">全选</el-checkbox>
                <el-checkbox-group v-model="userRole" :indeterminate="isIndeterminate"
                    @change="handleCheckedCitiesChange">
                    <el-checkbox v-for="(role, index) in allRole" :key="index" :label="role">
                        {{ role.roleName }}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <el-button @click="confirmClick" type="primary" title="确认">确认</el-button>
            <el-button @click="cancel" type="danger" title="取消">取消</el-button>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import { nextTick, onMounted, reactive, ref } from 'vue';
import { reqUserInfo, reqAddOrUpdateUser, reqAllRole, reqSetUserRole, reqRemoveUser, reqSelectUser } from '@/api/acl/user';
import { UserResponseData, Records, User, AllRoleResponseData, AllRole, SetRoleData } from '@/api/acl/user/type';
import { ElMessage } from 'element-plus';
import useLayoutSettingStore from '@/store/modules/setting';

//仓库对象
let settingstore = useLayoutSettingStore();
//分页器数据
let pageNum = ref<number>(1);
let pageSize = ref<number>(5);
let total = ref<number>(0);
//存储用户信息
let userArr = ref<Records>([])
//抽屉的显示与隐藏
let drawer = ref<boolean>(false)
let drawer1 = ref<boolean>(false)
//储存用户所有信息响应数据
let userParams = reactive<User>({
    username: '',
    name: '',
    password: '',
})
//获取添加|修改抽屉表单ref
let formRef = ref();
//存储所有职位信息
let allRole = ref<AllRole>([])
let userRole = ref<AllRole>([])
//收集搜索框内容
let keyword = ref<string>('')

//获取所有用户信息
const getHasUser = async (pager = 1) => {
    pageNum.value = pager;
    let result: UserResponseData = await reqUserInfo(pageNum.value, pageSize.value, keyword.value);
    if (result.code == 200) {
        total.value = result.data.total;
        userArr.value = result.data.records;
    }
}


//组件挂载后获取用户数据
onMounted(() => {
    getHasUser();
})


//分页器下拉菜单变化时触发函数
const sizeChange = () => {
    getHasUser();
}


//添加用户
const addUser = () => {
    drawer.value = true
    Object.assign(userParams, {
        id: 0,
        username: '',
        name: '',
        password: '',
    });
    nextTick(() => {
        formRef.value.clearValidate('username');
        formRef.value.clearValidate('name');
        formRef.value.clearValidate('password');
    });

}
//修改用户
const updateUser = (row: User) => {
    drawer.value = true
    Object.assign(userParams, row);
    nextTick(() => {
        formRef.value.clearValidate('username');
        formRef.value.clearValidate('name');
    });
}


//添加|修改用户信息抽屉栏保存按钮
const save = async () => {
    //进行校验
    await formRef.value.validate();
    //保存按钮:添加新的用户|更新已有的用户账号信息
    let result: any = await reqAddOrUpdateUser(userParams)
    //添加或者更新成功
    if (result.code == 200) {
        //关闭抽屉
        drawer.value = false
        //提示消息
        ElMessage({
            type: 'success',
            message: userParams.id ? '更新成功' : '添加成功',
        })
        //浏览器刷新一次
        // window.location.reload();
        settingstore.refsh = !settingstore.refsh
    } else {
        //关闭抽屉
        drawer.value = false
        //提示消息
        ElMessage({
            type: 'error',
            message: userParams.id ? '更新失败' : '添加失败',
        })
    }
}
//抽屉蓝取消按钮
const cancel = () => {
    drawer.value = false;
    drawer1.value = false;
}


//账号校验规则
const validatorUsername = (_: any, value: any, callBack: any) => {
    if (value.trim().length < 5) {
        callBack(new Error('账号长度至少五位'));
    } else {
        callBack()
    }
}
//用户名字校验规则
const validatorName = (_: any, value: any, callBack: any) => {
    if (value.trim().length < 5) {
        callBack(new Error('用户名称至少五位'));
    } else {
        callBack()
    }
}
//用户密码
const validatorPassword = (_: any, value: any, callBack: any) => {
    if (value.trim().length < 6) {
        callBack(new Error('用户密码至少六位'));
    } else {
        callBack()
    }
}
//表单校验规则
const rules = {
    username: [{ required: true, trigger: 'blur', validator: validatorUsername }],
    name: [{ required: true, trigger: 'blur', validator: validatorName }],
    password: [{ required: true, trigger: 'blur', validator: validatorPassword }]
}

//分配角色抽屉
//定义全选，非全选按钮
const checkAll = ref(false)
const isIndeterminate = ref(true)
//全选框变化时调用函数
const handleCheckAllChange = (val: boolean) => {
    //val表示的是checkAll的状态
    userRole.value = val ? allRole.value : [];
    isIndeterminate.value = false;
}
//多选框变化时调用的函数
const handleCheckedCitiesChange = (value: string[]) => {
    //控制全选框样式
    checkAll.value = value.length === allRole.value.length
    //控制不确定选框样式
    isIndeterminate.value = value.length > 0 && value.length < allRole.value.length
}
//点击分配角色按钮时触发的函数
const setRole = async (row: User) => {
    drawer1.value = true
    Object.assign(userParams, row);
    let result: AllRoleResponseData = await reqAllRole((userParams.id as number))
    if (result.code == 200) {
        allRole.value = result.data.allRolesList;
        userRole.value = result.data.assignRoles;
    }
}
//分类职位抽屉确定按钮
const confirmClick = async () => {
    let data: SetRoleData = {
        userId: userParams.id,
        roleIdList: userRole.value.map(item => { return (item.id as number) })
    }
    let result: any = await reqSetUserRole(data);
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '职位分配成功' })
    }
    drawer1.value = false;
    getHasUser(pageNum.value);
}

//删除一个用户
const deleteUser = async (userId: number) => {
    let result: any = await reqRemoveUser(userId)
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '删除成功' })
    }
    getHasUser(userArr.value.length > 1 ? pageNum.value : pageNum.value - 1);
}

//批量删除
//定义一个储存批量删除的数组ID
let selectIdArr = ref<User[]>([])
//table多选框勾选时变化所触发的事件
const selectChange = (value: any) => {
    //value的值是所选行的值
    selectIdArr.value = value
}
//批量删除按钮的回调
const deleteSelectUser = async () => {
    let idsList: any = selectIdArr.value.map(item => {
        return item.id
    })
    let result: any = await reqSelectUser(idsList)
    if (result.code == 200) {
        ElMessage({ type: 'success', message: '批量删除成功' })
    }
    getHasUser(userArr.value.length > 1 ? pageNum.value : pageNum.value - 1);
}

//搜索用户
const search = () => {
    getHasUser()
}
//重置
const reset = () => {
    settingstore.refsh = !settingstore.refsh
}
</script>

<style scoped lang="scss">
.form-justify {
    display: flex;
    justify-content: space-between;
}
</style>