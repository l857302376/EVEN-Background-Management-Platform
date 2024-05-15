<template>
  <div class="box2">
    <div class="title">
      <p>性别比例</p>
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
  //获取echarts类的实例
  let mycharts = echarts.init(charts.value)
  //设置实例配置项
  mycharts.setOption({
    tooltip: {
      trigger: 'item',
    },
    legend: {
      top: 50,
      right: 80,
      orient: 'vertical',
      textStyle: {
        color: 'white',
        fontSize: 16,
      },
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        right: '10%',
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          position: 'inside',
          color: 'white',
        },
        labelLine: {
          show: false,
        },
        data: [
          { value: 1048, name: '金融' },
          { value: 735, name: '新闻' },
          { value: 580, name: '文化' },
          { value: 484, name: '数字' },
          { value: 300, name: '建筑' },
        ],
      },
    ],
    grid: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  })
})
</script>

<style scoped lang="scss">
.box2 {
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
    height: 230px;
  }
}
</style>
