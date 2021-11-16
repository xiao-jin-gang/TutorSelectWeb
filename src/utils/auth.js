/*
 * @Author: Rex Joush
 * @Date: 2021-08-11 15:19:50
 * @LastEditors: Rex Joush
 * @LastEditTime: 2021-08-11 15:40:39
 */
import Cookies from 'js-cookie'

const TokenKey = 'token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
