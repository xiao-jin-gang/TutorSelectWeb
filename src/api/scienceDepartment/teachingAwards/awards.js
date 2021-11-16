/*
 * @Description: your project
 * @version: 1.0
 * @Author: Anna
 * @Date: 2021-08-27 10:03:22
 * @LastEditors: Anna
 * @LastEditTime: 2021-09-08 10:07:23
 */

import request from '@/utils/request'
import { baseUrl } from '@/api/url'

 // 查询科研奖励
export function searchAwards(tutorId,applyId) {
  return request({
    url: baseUrl + `/admin/teaching_awards/get/${tutorId}/${applyId}`,
    method: 'get',
  })
}

//更新审核状态和备注
export function updateAwards(data) {
  return request({
    url: baseUrl + '/admin/teaching_awards/update',
    method: 'post',
    data: data
  })
}