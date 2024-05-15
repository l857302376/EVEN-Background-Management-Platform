<template>
    <div class="box1">
        <div class="title">
            <p>男女比例</p>
            <img src="../../images/dataScreen-title.png">
        </div>
        <div class="sex">
            <div class="man">
                <img src="../../images/man.png">
            </div>
            <div class="woman">
                <img src="../../images/woman.png">
            </div>
        </div>
        <div class="rate">
            <p>男士58%</p>
            <p>女士42%</p>
        </div>
        <div class="charts" ref="charts">

        </div>
    </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts';
import { onMounted, ref } from 'vue';

let charts = ref()

onMounted(() => {
    //获取echarts类的实例
    let mycharts = echarts.init(charts.value)
    //设置实例配置项
    mycharts.setOption({
        title: {
            text: '男女比例',
            textStyle: {
                //主标题颜色
                color: 'skyblue',
            },
            left: '40%',
        },
        xAxis: {
            show: false,
            min: 0,
            max: 100,
        },
        yAxis: {
            type: 'category',
            show: false,
        },
        series: [
            {
                type: 'bar',
                data: [49],
                barWidth: 20,
                z: 100,
                itemStyle: {
                    color: 'skyblue',
                    borderRadius: 20,
                },
            },
            {
                type: 'bar',
                data: [77],
                barWidth: 20,
                //调整柱的垂直位置
                barGap: '-100%',
                itemStyle: {
                    color: 'pink',
                    borderRadius: 20,
                },
            }
        ],
        grid: {
            left: 100,
            right: 0,
            top: 0,
            bottom: 0,
        }
    })
})
</script>

<style scoped lang="scss">
.box1 {
    height: 100%;
    width: 100%;
    background: url(../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 10px;

    .title {
        margin-left: 20px;
        color: white;
        font-size: 20px;
    }

    .sex {
        display: flex;
        justify-content: center;

        .man {
            margin: 40px;
            background: url(../../images/man-bg.png) no-repeat;
            width: 111px;
            height: 115px;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .woman {
            margin: 40px;
            background: url(../../images/woman-bg.png) no-repeat;
            width: 111px;
            height: 115px;
            display: flex;
            justify-content: center;
            align-items: center;
        }
    }

    .rate {
        display: flex;
        justify-content: space-between;
        color: white;

        p {
            margin: 0 80px;
            margin-top: 10px;
            margin-bottom: -10px;
        }
    }

    .charts {
        height: 100px;
    }
}
</style>