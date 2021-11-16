/*
 * @Author: Rex Joush
 * @Date: 2021-09-03 15:12:31
 * @LastEditors: Rex Joush
 * @LastEditTime: 2021-09-03 15:14:13
 */
import { baseUrl } from '@/api/url'
import request from '@/utils/request'

/* 获取所有当前教师的所有申请 */
export function getApplyList() {
  return request({
    url: `${baseUrl}/tutor/getApplyList`,
    method: 'get'
  })
}

/**
 * @param applyId 申请 id
 * @param status 1, 将驳回的申请状态改为 0
 *               2, 将填写完成的申请状态改为 10
*/
export function changeStatus(applyId, status) {
  return request({
    url: `${baseUrl}/tutor/changeStatus/${applyId}/${status}`,
    method: 'get'
  })
}

/* 获取当前申请的详细信息 */
export function getApplyDetails(applyId, isInspect, tutorId) {
  return request({
    url: `${baseUrl}/common/tutor/getApplyDetails/${applyId}/${isInspect}/${tutorId}`,
    method: 'get'
  })
}

/* 导出pdf */
export function exportPdf(applyId, applyTypeId) {
  return request({
    url: `${baseUrl}/tutor/getPdf/${applyId}/${applyTypeId}`,
    method: 'get'
  })
}
