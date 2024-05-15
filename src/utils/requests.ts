//对axios二次封装：使用请求，与响应拦截器
import axios from 'axios'
import { ElMessage } from 'element-plus'
import useUserStore from '@/store/modules/user'

//1.创建axios实例对象
let request = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API, //基础路径会携带/api
  timeout: 5000, //请求必须在5s之内实现，否则失败
})
//2.request实例添加请求
request.interceptors.request.use((config) => {
  //访问用户相关小仓库，获取用户token，登录成功后携带给服务器
  let userStore = useUserStore()
  if (userStore.token) {
    config.headers.token = userStore.token
  }
  //config配置对象，hearders，经常给服务器端携带公共参数
  return config
})
//3.添加响应拦截器
request.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    //处理网络错误
    let msg = ''
    let status = error.response.status
    switch (status) {
      case 401:
        msg = 'token过期'
        break
      case 403:
        msg = '无权访问'
        break
      case 404:
        msg = '请求地址错误'
        break
      case 500:
        msg = '服务器出现问题'
        break
      default:
        msg = '无网络'
    }
    ElMessage({
      type: 'error',
      message: msg,
    })
    return Promise.reject(error)
  },
)
export default request
