export interface ResponseData {
    code: number,
    message: string,
    ok: boolean,
};
//获取一条账号信息的数据类型
export interface User {
    id?: number
    createTime?: string
    updateTime?: string
    username?: string
    password?: string
    name?: string
    phone?: null
    roleName?: string
}
//包含所有用户信息的数组
export type Records = User[];
//接口返回的所有用户信息的数据类型
export interface UserResponseData extends ResponseData {
    data: {
        records: Records,
        total: number,
        size: number,
        current: number,
        pages: number,
    }
}

//获取一个用户所拥有职位的数据
export interface RoleData {
    id?: number,
    createTime?: string,
    updateTime?: string,
    roleName: string,
    remark: null,
}
//获取全部职位的信息
export type AllRole = RoleData[]
//获取职位接口返回的数据类型
export interface AllRoleResponseData extends ResponseData{
    data:{
        assignRoles:AllRole,
        allRolesList:AllRole,
    }
}

//分配用户职位
export interface SetRoleData{
    roleIdList:number[],
    userId?:number,
}