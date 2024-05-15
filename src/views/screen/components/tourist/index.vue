<template>
    <div class="box">
        <div class="top">
            <p class="title">实时游客统计</p>
            <p class="bg"></p>
            <p class="right">
                可预约总量
                <span>99999</span>
                人
            </p>
        </div>
        <div class="number">
            <span v-for="(item, index) in people" :key="index">{{ item }}</span>
        </div>
        <!-- e-charts展示的图表 -->
        <div class="charts" ref="charts">123</div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
//引入echarts和水球图
import * as echarts from 'echarts';
import 'echarts-liquidfill';

let people = ref('11111人')
let charts = ref()

onMounted(() => {
    //获取echarts类的实例
    let mycharts = echarts.init(charts.value)
    //设置实例配置项
    mycharts.setOption({
        title: {
            text: '水球图',
            textStyle: {
                color: 'white'  // 设置标题颜色为白色
            }
        },
        series: {
            type: 'liquidFill',
            data: [0.6],
            radius: '95%',
        },
    })
})
</script>

<style scoped lang="scss">
.box {
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 10px;

    .top {
        margin-left: 20px;

        .title {
            color: white;
            font-size: 20px;
        }

        .bg {
            background: url(../../images/dataScreen-title.png) no-repeat;
            width: 68px;
            height: 7px;
            margin-top: 10px;
        }

        .right {
            float: right;
            color: white;
            font-size: 20px;

            span {
                color: burlywood;
            }
        }
    }

    .number {
        margin-top: 40px;
        display: flex;
        padding: 10px 0px;

        span {
            flex: 1;
            height: 77px;
            text-align: center;
            line-height: 77px;
            background: url(../../images/total.png) no-repeat;
            background-size: 100% 100%;
            color: #29fcff;
        }
    }

    .charts {
        width: 100%;
        height: 200px;
        margin-left:40px;
    }
}
</style>