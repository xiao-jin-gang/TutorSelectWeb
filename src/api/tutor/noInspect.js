import request from '@/utils/request'
import { baseUrl } from '@/api/url'

// 获取第一页, 导师基础信息
export function getNoFirstPage(applyId) {
  return request({
    url: `${baseUrl}/tutor/noInspect/getFirstPage/${applyId}`,
    method: 'get'
  })
}

// 免审第一页提交
// 提交第一页
export function submitNoFirstPage(data, applyId, applyTypeId, applyCondition) {
  return request({
    url: `${baseUrl}/tutor/noInspect/saveFirstPage/${applyId}/${applyTypeId}/${applyCondition}`,
    method: 'post',
    data: data
  })
}

// 第二页提交
export function submitSecondPage(data, applyId) {
  return request({
    url: `${baseUrl}/tutor/noInspect/saveSecondPage/${applyId}`,
    method: 'post',
    data: data
  })
}

