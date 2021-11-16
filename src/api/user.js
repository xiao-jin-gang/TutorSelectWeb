/*
 * @Author: Rex Joush
 * @Date: 2021-08-11 15:19:50
 * @LastEditors: Rex Joush
 * @LastEditTime: 2021-08-11 15:29:22
 */
import request from '@/utils/request'
import { baseUrl } from '@/api/url'
export function login(data) {
  return request({
    // url: baseUrl + '/user/login',
    url: baseUrl + '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: baseUrl + '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: baseUrl + '/user/logout',
    method: 'post'
  })
}
