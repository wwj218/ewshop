import { request } from "./request";

//注册
export function register(data){
  return request({
    url:'/api/auth/register',
    method: 'post',
    data
  })
}
//登录
export function login(data){
  return request({
    url:'/api/auth/login',
    method: 'post',
    data
  })
}
//退出
export function logout(data){
  return request({
    url:'/api/auth/logout',
    method: 'post',
  })
}

//得到用户信息
export function getUser(){
  return request({
    url:'/api/user',
  })
}

//更新用户头像
export function getUserAvater(params){
  return request({
    url:'/api/user/avatar',
    method: 'patch',
    params
  })
}

//更新用户名称
export function getUserName(params){
  return request({
    url:'/api/user',
    method: 'put',
    params
  })
}