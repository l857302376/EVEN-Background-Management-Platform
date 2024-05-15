<template>
    <!-- 顶部左侧的静态 -->
    <el-icon style="margin-right:10px; font-size:20px; cursor:pointer;" @click="changeIcon">
        <component :is="LayoutSettingStore.fold ? 'Fold' : 'Expand'"></component>
    </el-icon>
    <el-breadcrumb separator-icon="ArrowRight">
        <el-breadcrumb-item v-for="(item, index) in $route.matched" :key="index" v-show="item.meta.title"
            :to="item.path">
            <el-icon>
                <component :is="item.meta.icon"></component>
            </el-icon>
            <span style="margin:0px 3px;">{{ item.meta.title }}</span>
        </el-breadcrumb-item>
    </el-breadcrumb>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting';

let LayoutSettingStore = useLayoutSettingStore();

const changeIcon = () => {
    LayoutSettingStore.fold = !LayoutSettingStore.fold;
}
</script>

<script lang="ts">
export default {
    name: "Breadcrumb"
};
</script>

<style scoped lang="scss"></style>