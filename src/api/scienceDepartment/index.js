/*
 * @Description: your project
 * @version: 1.0
 * @Author: Anna
 * @Date: 2021-10-29 16:03:10
 * @LastEditors: Anna
 * @LastEditTime: 2021-10-29 20:36:59
 */
import request from '@/utils/request'
import { baseUrl } from '@/api/url'

// 获取所有数据
export function init(tutorId, applyId) {
  return request({
    url: baseUrl + `/admin/science/init/${tutorId}/${applyId}`,
    method: 'get',
  })
}

// 审批通过数据
export function check(id, type, passOrReject, data) {
  return request({
    url: baseUrl + `/admin/science/check/${id}/${type}/${passOrReject}`,
    method: 'post',
    data
  })
}

// 提交材料审核
export function commitMaterial(applyId, data, type, science) {
  return request({
    url: baseUrl + `/admin/science/commitMaterial/${applyId}/${type}/${science}`,
    method: 'post',
    data
  })
}