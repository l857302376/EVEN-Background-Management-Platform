<template>
    <div class="box7">
        <div class="title">
            <p>游客对比</p>
            <img src="../../images/dataScreen-title.png">
        </div>
        <div class="charts" ref="charts">
        </div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

let charts = ref();
onMounted(() => {
    let mychart = echarts.init(charts.value)
    mychart.setOption({
        xAxis: {
            type: 'category',
            boundaryGap: false,

        },
        yAxis: {
            splitLine: {
                show: false,
            }
        },
        grid: {
            bottom: 20,
            left: 30,
        },
        series: [
            {
                type: 'scatter',
                data: [100, 260, 150, 220, 300, 160],
                smooth: true,
                label:{
                    show:true,
                    position:'top',
                    color:'white',
                }
            },
        ]
    })

})

</script>

<style scoped lang="scss">
.box7 {
    width: 100%;
    height: 100%;
    margin: 10px 0px;
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;

    .title {
        margin-left: 20px;
        color: white;
        font-size: 20px;
    }

    .charts {
        height: 210px;

    }
}
</style>