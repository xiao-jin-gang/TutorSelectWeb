/*
 * @Description: your project
 * @version: 1.0
 * @Author: Anna
 * @Date: 2021-09-05 17:35:21
 * @LastEditors: Anna
 * @LastEditTime: 2021-09-12 16:54:43
 */
import request from '@/utils/request'
import { baseUrl } from '@/api/url'

 // 查询教师信息
export function searchTeachers(ZGH) {
  return request({
    url: baseUrl + `/admin/teacher_info/get/${ZGH}`,
    method: 'get',
  })
}