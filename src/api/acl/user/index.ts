//用户管理模块接口
import request from '@/utils/requests'
import {
  UserResponseData,
  User,
  AllRoleResponseData,
  SetRoleData,
} from './type'

enum API {
  //1.获取用户账号信息
  ALLUSER_URL = '/admin/acl/user/',
  // //2.添加用户
  ADDUSER_URL = '/admin/acl/user/save',
  // //3.更新用户信息
  UPDATEUSER_URL = '/admin/acl/user/update',
  //4.获取所有职位，以及当前用户所拥有的职位
  ALLROLE_URL = '/admin/acl/user/toAssign/',
  //5.修改职位
  SETROLE_URL = '/admin/acl/user/doAssignRole',
  //6.单个删除
  DELETEUSER_URL = '/admin/acl/user/remove/',
  //7.批量删除
  DELETEALLUSER_URL = '/admin/acl/user/batchRemove',
}

//1.
export const reqUserInfo = (page: number, limit: number, username: string) =>
  request.get<any, UserResponseData>(
    API.ALLUSER_URL + `${page}/${limit}/?username=${username}`,
  )
//2,3
export const reqAddOrUpdateUser = (data: User) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEUSER_URL, data)
  } else {
    return request.post<any, any>(API.ADDUSER_URL, data)
  }
}
//4.
export const reqAllRole = (userId: number) =>
  request.get<any, AllRoleResponseData>(API.ALLROLE_URL + userId)
//5.
export const reqSetUserRole = (data: SetRoleData) =>
  request.post<any, any>(API.SETROLE_URL, data)
//6.
export const reqRemoveUser = (userId: number) =>
  request.delete<any, any>(API.DELETEUSER_URL + userId)
//7.
export const reqSelectUser = (idList: number[]) =>
  request.delete<any, any>(API.DELETEALLUSER_URL, { data: idList })
