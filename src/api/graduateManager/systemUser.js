import request from '@/utils/request'

// 获取所有系统用户
export function getSystemUsers(queryParams) {
  return request({
    url: '/admin/system-user/getAll',
    method: 'post',
    data: queryParams
  })
}

// 根据工号模糊查询工号
export function getQueryTutorId(tutorId) {
  return request({
    url: `/admin/system-user/getQueryTutorId/${tutorId}`,
    method: 'get'
  })
}

// 根据工号查询当前用户的信息
export function getSystemUserByTutorId(tutorId) {
  return request({
    url: `/admin/system-user/getSystemUserByTutorId/${tutorId}`,
    method: 'get'
  })
}

// 添加用户
export function addSystemUser(user, roleId) {
  return request({
    url: `/admin/system-user/addSystemUser/${roleId}`,
    method: 'post',
    data: user
  })
}

// 编辑用户
export function editSystemUser(tutorId, roleId) {
  return request({
    url: `/admin/system-user/editSystemUser/${tutorId}/${roleId}`,
    method: 'get'
  })
}

// 删除用户
export function deleteSystemUser(tutorId) {
  return request({
    url: `/admin/system-user/deleteSystemUser/${tutorId}`,
    method: 'get'
  })
}

