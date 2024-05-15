<template>
    <svg :style="{ width, height }">
        <use :xlink:href="prefix + name" :fill="color" ></use>
    </svg>
</template>

<script setup lang="ts">
defineProps({
    prefix: {
        type: String,
        default: '#icon-'
    },
    name: String,
    color: {
        type: String,
        default: ''
    },
    //svg宽度
    width: {
        type: String,
        default: '16px'
    },
    //svg高度
    height: {
        type: String,
        default: '16px'
    }
})
</script>

<style scoped></style>