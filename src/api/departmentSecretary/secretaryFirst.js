/*
 * @Description: your project
 * @version: 1.0
 * @Author: Anna
 * @Date: 2021-09-21 15:04:25
 * @LastEditors: Anna
 * @LastEditTime: 2021-10-20 17:47:24
 */
import request from '@/utils/request'
import { baseUrl } from '@/api/url'

// 获取所有初始信息
export function getInit(organizationId, applyStatuss, pageNumber) {
  const params = new URLSearchParams()
  params.append('organizationId', organizationId)
  params.append('applyStatuss', applyStatuss)
  params.append('pageNumber', pageNumber)
  return request({
    // url: `${baseUrl}/admin/tutor-inspect/getInit/${organizationId}/${applyStatuss}/${pageNumber}`,
    url: `${baseUrl}/admin/tutor-inspect/getInit`,
    method: 'post',
    data: params
  })
}
// 获取所有初始信息
export function search(queryParams, pageNumber) {
  return request({
    // url: `${baseUrl}/admin/tutor-inspect/getInit/${organizationId}/${applyStatuss}/${pageNumber}`,
    url: `${baseUrl}/admin/tutor-inspect/search/${pageNumber}`,
    method: 'post',
    data: queryParams
  })
}
// 初始化申请的所有类别（下拉框）
export function getApplyType() {
  return request({
    url: '/admin/apply-type/getApplyType',
    method: 'get'
  })
}
// 查询数据
export function checkDate(data) {
  return request({
    url: '/admin/tutor-inspect/admin/getAll',
    method: 'get',
    params: data,
    contentType: 'application/json;charset=UTF-8'
  })
}
// 更新操作
export function updateStatus(data) {  
  return request({
    url: '/admin/update-status/update',
    method: 'post',
    data: data
  })
}

// 更新操作（提交分会页面）
export function updateStatusSfh(data) {
  return request({
    url: '/admin/update-status/updateSfh',
    method: 'post',
    data: data,
  })
}

// 更新操作（录入分会意见页面）
export function updateStatusXy(data) {
  return request({
    url: '/admin/update-status/updateXy',
    method: 'post',
    data: data,
  })
}

//社科处更新操作
export function updateSocial(data) {  
  return request({
    url: '/admin/update-status/updateSocial',
    method: 'post',
    data: data
  })
}

