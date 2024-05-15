<template>
    <router-view v-slot="{ Component }">
        <transition name="fade">
            <!-- 渲染layout一级路由的子路由 -->
            <component :is="Component" v-if="flag" />
        </transition>
    </router-view>
</template>

<script setup lang="ts">
import useLayoutSettingStore from '@/store/modules/setting';
import { nextTick, ref, watch } from 'vue';

let layoutSettingStore = useLayoutSettingStore()

let flag = ref(true)

watch(() => layoutSettingStore.refsh, () => {
    flag.value = false;
    nextTick(() => {
        flag.value = true;
    })
})
</script>

<script lang="ts">
export default {
    name: "Main"
};
</script>

<style scoped lang="scss">
.fade-enter-from {
    opacity: 0;
}

.fade-enter-active {
    transition: all 0.3s;
}

.fade-enter-to {
    opacity: 1;
}
</style>