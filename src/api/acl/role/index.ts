import request from '@/utils/requests'
import { RoleResponseData, RoleData, MenuResponseData } from './type'

enum API {
  //1.获取全部职位角色
  ALLROLE_URL = '/admin/acl/role/',
  //2.新增
  ADDROLE_URL = '/admin/acl/role/save',
  //3.修改
  UPDATEROLE_URL = '/admin/acl/role/update',
  //4.获取权限菜单与按钮的数据
  ALLPERMISSION_URL = '/admin/acl/permission/toAssign/',
  //5.分配权限
  SETPERMISSION_URL = '/admin/acl/permission/doAssign/?',
  //6.删除职位
  REMOVEROLE_URL = '/admin/acl/role/remove/',
}

//1.
export const reqAllRoleList = (page: number, limit: number, roleName: string) =>
  request.get<any, RoleResponseData>(
    API.ALLROLE_URL + `${page}/${limit}/?roleName=${roleName}`,
  )
//2.3.
export const reqAddOrUpdateRole = (data: RoleData) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATEROLE_URL, data)
  } else {
    return request.post<any, any>(API.ADDROLE_URL, data)
  }
}
//4.
export const reqAllMenuList = (roleId: number) =>
  request.get<any, MenuResponseData>(API.ALLPERMISSION_URL + roleId)
//5.
export const reqSetPermission = (roleId: number, permissionId: number[]) =>
  request.post<any, MenuResponseData>(
    API.SETPERMISSION_URL + `roleId=${roleId}&permissionId=${permissionId}`,
  )
//6.
export const reqRemoveRole = (roleId: number) =>
  request.delete<any, any>(API.REMOVEROLE_URL + roleId)
