<template>
    <el-button type="primary" size="small" icon="Refresh" circle @click="updataRefsh"></el-button>
    <el-button type="primary" size="small" icon="FullScreen" circle @click="fullScreen"></el-button>
    <el-popover title="主题设置" :hide-after="0">
        <el-form>
            <el-form-item label="主题颜色">
                <el-color-picker @change="setColor" v-model="color" show-alpha :predefine="predefineColors"
                    :teleported="false" />
            </el-form-item>
            <el-form-item label="暗黑模式">
                <el-switch @change="changeDark" v-model="dark" />
            </el-form-item>
        </el-form>
        <template #reference>
            <el-button type="primary" size="small" icon="Setting" circle></el-button>
        </template>
    </el-popover>
    <img :src="userStore.avatar" style="width:24px; height:24px; margin:0px 10px; border-radius: 50%;">
    <el-dropdown>
        <span class="el-dropdown-link">
            {{ userStore.username }}
            <el-icon class="el-icon--right">
                <arrow-down />
            </el-icon>
        </span>
        <template #dropdown>
            <el-dropdown-menu>
                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
        </template>
    </el-dropdown>
    <el-drawer v-model="drawer" :append-to-body="true">
        <template #header>
            <h4>测试</h4>
        </template>
    </el-drawer>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting';
import useUserStore from '@/store/modules/user';
import { ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

let userStore = useUserStore()
let layoutSettingStore = useLayoutSettingStore()

let $router = useRouter();
let $route = useRoute();
//暗黑模式
let dark = ref(false)
//控制抽屉开关
let drawer = ref(false)

//刷新函数
const updataRefsh = () => {
    layoutSettingStore.refsh = !layoutSettingStore.refsh
}

const fullScreen = () => {
    //是全屏模式返回true, 否则返回null
    let full = document.fullscreenElement;

    if (!full) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}
//退出登录
const logout = async () => {
    //1.**需要向服务器发请求【退出登录接口】，没有设置

    //2.仓库中用户信息清空，username,avatar
    await userStore.userLogout()

    //3.跳转至登录界面
    $router.push({ path: '/login', query: { redirect: $route.path } })
}

//颜色数据
const color = ref('rgba(255, 69, 0, 0.68)')
const predefineColors = ref([
    '#ff4500',
    '#ff8c00',
    '#ffd700',
    '#90ee90',
    '#00ced1',
    '#1e90ff',
    '#c71585',
    'rgba(255, 69, 0, 0.68)',
    'rgb(255, 120, 0)',
    'hsv(51, 100, 98)',
    'hsva(120, 40, 94, 0.5)',
    'hsl(181, 100%, 37%)',
    'hsla(209, 100%, 56%, 0.73)',
    '#c7158577',
])

//切换暗黑模式
const changeDark = () => {
    //获取根节点
    let html = document.documentElement;
    //判断html根节点上类名是否有dark
    dark.value ? html.className = 'dark' : html.className = '';
}

//取色板
const setColor = () => {
    //修改根节点样式
    const html = document.documentElement;
    html.style.setProperty('--el-color-primary', color.value)
}
</script>

<script lang="ts">
export default {
    name: "Setting"
};
</script>

<style scoped lang="scss"></style>