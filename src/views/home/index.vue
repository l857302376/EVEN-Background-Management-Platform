<template>
  <el-card>
    <div style="display: flex">
      <img
        :src="userStore.avatar"
        style="width: 120px; height: 120px; border-radius: 50%"
      />
      <div style="margin-left: 20px">
        <h3 style="font-size: 24px; font-weight: 900">
          {{ getTime() }}好{{ userStore.username }}
        </h3>
        <h3 style="margin: 20px 0px">EVEN管理平台</h3>
      </div>
    </div>
  </el-card>
  <div style="display: flex; justify-content: center; margin: -50px 0px">
    <svg-icon name="welcome" style="width: 500px; height: 500px"></svg-icon>
  </div>
  <!-- 测试 -->

  <div>
    <!-- <el-upload class="upload-demo" drag action="/api/admin/product/fileUpload" multiple directory ref="uploadFile">
            <div class="el-upload__text">
                Drop file here or <em>click to upload</em>
            </div>
        </el-upload>
 -->

    <p>上传文件夹</p>
    <input
      ref="planFileRef"
      class="show0"
      type="file"
      webkitdirectory
      @change="selectFile"
    />
  </div>
</template>

<script setup lang="ts">
import useUserStore from '@/store/modules/user'
import { getTime } from '@/utils/time'
import { ref } from 'vue'

let userStore = useUserStore()

//-------测试------

let planFileRef = ref()

// 文件夹导入
const selectFile = () => {
  var files = planFileRef.value.files
  var data = new FormData()
  // 创建一个表单数据
  //文件夹导入按照 特定开头和结尾导入
  let regexArr = [
    /^rascn.*dat$/,
    /^rlight.*dat$/,
    /^rpimp.*xml$/,
    /^rppka.*xml$/,
    /^rpppk.*xml$/,
    /^rptrk.*xml$/,
    /^rsbeo.*dat$/,
    /^rsps.*dat$/,
  ]

  for (let i = 0; i < files.length; i++) {
    regexArr.forEach((item) => {
      if (item.test(files[i].name)) {
        data.append('file', files[i])
      }
    })
  }

  // importApi(data);
}

// const importApi = (formData) => {
//     axios
//         .post("/project/file", formData, {
//             headers: {
//                 "Referrer-Policy": "unsafe-url",
//                 "Content-Type": "multipart/form-data",
//             },
//         })
//         .then((res) => {
//             if (res.code == 1) {

//             }
//         })

// };
</script>

<style scoped lang="scss"></style>
