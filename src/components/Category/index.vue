<template>
    <el-card>
        <el-form inline class="category">
            <el-form-item label="一级分类">
                <el-select v-model="categoryStore.c1Id" @change="c1Change" :disabled="scene==1">
                    <!-- el-option中，label为显示的标签，value为同一标签下收集的数据，并且传递给v-model -->
                    <el-option v-for="(c1) in categoryStore.c1Arr" :key="c1.id" :label="c1.name"
                        :value="c1.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类">
                <el-select v-model="categoryStore.c2Id" @change="c2Change" :disabled="scene==1">
                    <!-- el-option中，label为显示的标签，value为同一标签下收集的数据，并且传递给v-model -->
                    <el-option v-for="(c2) in categoryStore.c2Arr" :key="c2.id" :label="c2.name"
                        :value="c2.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="三级分类">
                <el-select v-model="categoryStore.c3Id" :disabled="scene==1">
                    <!-- el-option中，label为显示的标签，value为同一标签下收集的数据，并且传递给v-model -->
                    <el-option v-for="(c3) in categoryStore.c3Arr" :key="c3.id" :label="c3.name"
                        :value="c3.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useCategoryStore from '@/store/modules/category';

let categoryStore = useCategoryStore()

//引入钩子
onMounted(() => {
    categoryStore.getC1();
});

//当一级菜单选中值时触发,清空其他分类的数据
const c1Change = () => {
    categoryStore.getC2();
    categoryStore.c2Id='';
    categoryStore.c3Id='';
    categoryStore.c3Arr=[];
}

const c2Change = () => {
    categoryStore.getC3();
    categoryStore.c3Id='';
}

defineProps(['scene']);
</script>

<style scoped lang="scss">
.category {
    display: flex;
    justify-content: space-between;
}

.el-select {
    --el-select-width: 220px;
}
</style>