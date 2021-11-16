/*
 * @Author: Rex Joush
 * @Date: 2021-09-11 23:59:12
 * @LastEditors: Rex Joush
 * @LastEditTime: 2021-09-11 23:59:27
 */
import { baseUrl } from '@/api/url'
import request from '@/utils/request'

// 获取第一页, 导师基础信息
export function getFirstPage(applyId) {
  return request({
    url: `${baseUrl}/tutor/inspect/getFirstPage/${applyId}`,
    method: 'get'
  })
}

// 提交第一页
export function submitFirstPage(data, applyId, applyTypeId, applyCondition) {
  return request({
    url: `${baseUrl}/tutor/inspect/submitFirstPage/${applyId}/${applyTypeId}/${applyCondition}`,
    method: 'post',
    data: data
  })
}

// 提交第二页
export function submitSecondPage(data, applyTypeId, applyId, applyCondition) {
  return request({
    url: `${baseUrl}/tutor/inspect/submitSecondPage/${applyTypeId}/${applyId}/${applyCondition}`,
    method: 'post',
    data: data
  })
}

//第三页每部分提交
export function saveThirdLearning(data, applyId, applyCondition,learningType) {
  return request({
    url: `${baseUrl}/tutor/inspect/saveLearning/${applyId}/${applyCondition}/${learningType}`,
    method: 'post',
    data :data
  })
}
// 第三页汇总提交
export function submitThirdPage(data, applyId, applyCondition) {
  return request({
    url: `${baseUrl}/tutor/inspect/submitThirdPage/${applyId}/${applyCondition}`,
    method: 'post',
    data: data
  })
}

// 提交第四页
export function submitFourthPage(data, applyId) {
  return request({
    url: `${baseUrl}/tutor/inspect/submitFourthPage/${applyId}`,
    method: 'post',
    data: data
  })
}

// 删除文件 公共方法
export function deleteFile(httpPath) {
  return request({
    url: `${baseUrl}/user/delFile`,
    method: 'post',
    data: httpPath
  })
}
