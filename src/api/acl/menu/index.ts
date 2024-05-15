import request from '@/utils/requests'
import { PermissionResponseData, MunuParams } from './type'

enum API {
  //1.获取菜单和按钮的全部数据
  ALLPERMISSION_URL = '/admin/acl/permission',
  //2.新增菜单
  ADDMENU_URL = '/admin/acl/permission/save',
  //3.编辑菜单
  UPDATAE_URL = '/admin/acl/permission/update',
  //4.删除
  DELETEMENU_URL = '/admin/acl/permission/remove/',
}

//1.
export const reqAllPermission = () =>
  request.get<any, PermissionResponseData>(API.ALLPERMISSION_URL)
//2. 3.
export const reqAddOrUpdateMenu = (data: MunuParams) => {
  if (data.id) {
    return request.put<any, any>(API.UPDATAE_URL, data)
  } else {
    return request.post<any, any>(API.ADDMENU_URL, data)
  }
}
//4.
export const reqRemoveMenu = (id: number) =>
  request.delete<any, any>(API.DELETEMENU_URL + id)
