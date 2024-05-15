<template>
  <div class="box6">
    <div class="title">
      <p>热门景区排行</p>
      <img src="../../images/dataScreen-title.png" />
    </div>
    <div class="charts" ref="charts"></div>
  </div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts'
import { onMounted, ref } from 'vue'

let charts = ref()

onMounted(() => {
  let mychart = echarts.init(charts.value)
  mychart.setOption({
    xAxis: {
      type: 'category',
      // boundaryGap: false,
    },
    yAxis: {
      splitLine: {
        show: false,
      },
    },
    grid: {
      bottom: 20,
      left: 30,
    },
    series: [
      {
        type: 'bar',
        data: [100, 260, 150, 220, 300, 160],
        smooth: true,
        label: {
          show: true,
          position: 'top',
          color: 'white',
        },
      },
      {
        type: 'line',
        data: [100, 260, 150, 220, 300, 160],
        smooth: true,
      },
    ],
  })
})
</script>

<style scoped lang="scss">
.box6 {
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
    height: 330px;
  }
}
</style>
