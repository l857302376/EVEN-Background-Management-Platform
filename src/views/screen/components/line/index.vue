<template>
  <div class="box5">
    <div class="title">
      <p>游客趋势图</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="charts" ref="line"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

onMounted(() => {
  let mycharts = echarts.init(line.value)
  mycharts.setOption({
    xAxis: {
      type: 'category',
      boundaryGap: false,
      name: '天',
      nameTextStyle: {
        color: 'white',
        fontSize: 15,
      },
      splitLine: {
        show: false,
      },
      axisTick: {
        inside: true,
      },
    },
    yAxis: {
      name: '游客访问量',
      nameTextStyle: {
        color: 'white',
        fontSize: 15,
      },
      splitLine: {
        show: false,
      },
    },
    grid: {
      left: 40,
      top: 50,
      right: 30,
      bottom: 20,
    },
    series: [
      {
        type: 'line',
        data: [100, 260, 150, 220, 300, 160],
        smooth: true,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'yellow', // 0% 处的颜色
              },
              {
                offset: 1,
                color: 'orange', // 100% 处的颜色
              },
            ],
            global: false, // 缺省为 false
          },
        },
      },
    ],
  })
})

let line = ref()
</script>

<style scoped lang="scss">
.box5 {
  width: 100%;
  height: 100%;
  background: url(../../images/dataScreen-main-lb.png) no-repeat;
  background-size: 100% 100%;
  margin: 10px 10px;

  .title {
    margin-left: 20px;
    color: white;
    font-size: 20px;
  }

  .charts {
    height: 200px;
  }
}
</style>
