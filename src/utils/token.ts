//封装本地存储数据的方法
export const SET_TOKEN = (token: string) => {
  localStorage.setItem('TOKEN', token)
}
//本地获取数据
export const GET_TOKEN = () => {
  return localStorage.getItem('TOKEN')
}

//本地存储删除数据
export const REMOVE_TOKEN = () => {
  localStorage.removeItem('TOKEN')
}
