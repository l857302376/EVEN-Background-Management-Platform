<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="login_From"
          :rules="rules"
          ref="loginForms"
        >
          <h1>Hello</h1>
          <h2>欢迎来到梁轶文后台管理平台</h2>
          <el-form-item prop="username">
            <el-input
              :prefix-icon="User"
              v-model="login_From.username"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :prefix-icon="Lock"
              v-model="login_From.password"
              show-password
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              :loading="loading"
              class="login_btn"
              type="primary"
              size="default"
              @click="login"
            >
              登录
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { User, Lock } from '@element-plus/icons-vue'
import { reactive, ref } from 'vue'
import useUserStore from '@/store/modules/user'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification } from 'element-plus'
import { getTime } from '@/utils/time'

//收集账号密码的数据
let login_From = reactive({
  username: 'admin',
  password: '111111',
})
let userStore = useUserStore()

let $router = useRouter()
let $route = useRoute()

let loading = ref(false)
let loginForms = ref()

//点击的登录后的步骤
//1 通知仓库发登录请求，成功则返回home，失败则返回失败信息
const login = async () => {
  await loginForms.value.validate()
  loading.value = true
  try {
    await userStore.userLogin(login_From)
    //登录时判断路由路劲是否有query参数，有则跳转至query携带的路径，否则返回首页
    let redirect: any = $route.query.redirect
    $router.push({ path: redirect || '/' })

    ElNotification({
      type: 'success',
      title: `HI,${getTime()}好`,
      message: '登录成功',
    })
    loading.value = false
  } catch (error) {
    ElNotification({
      type: 'error',
      message: (error as Error).message,
    })
    loading.value = false
  }
}

//rules是规则对象; value是文本的值; calback如果符合则放行，不符合则注入错误提示信息
const validatorUserName = (_: any, value: any, callback: any) => {
  if (value.length >= 5) {
    callback()
  } else {
    callback(new Error('账号长度至少为五位'))
  }
}

const validatorPassword = (_: any, value: any, callback: any) => {
  if (value.length >= 6) {
    callback()
  } else {
    callback(new Error('密码长度至少为六位'))
  }
}

const rules = {
  username: [{ trigger: 'blur', validator: validatorUserName }],
  password: [{ trigger: 'change', validator: validatorPassword }],
}
</script>

<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url('@/assets/images/background.jpg') no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url('@/assets/images/login_form.png') no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      color: white;
      font-size: 20px;
      margin: 20px 0px;
    }

    .login_btn {
      width: 100%;
    }
  }
}
</style>
